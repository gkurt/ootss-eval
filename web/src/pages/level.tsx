import { useMemo, useState } from "react"
import { Link, useParams } from "react-router"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ErrorState, Loading, ModelLabel, NotFound, Outcome, PageHeader, Section, Stat, TierBadge } from "@/components/page"
import { ReplayBoard } from "@/components/replay-board"
import { HeroChips, recordsFor } from "@/pages/levels"
import { getIndex, getLevel, getRunFile, useData, type Run, type RunRecord } from "@/lib/data"
import { byModel, dur, levelTitle, modelName, runHref, TRACK, usd, verdict } from "@/lib/format"
import { ChevronDownIcon } from "lucide-react"

export function LevelPage() {
  const { name = "" } = useParams()
  const index = useData(getIndex, [])
  const lv = useData(() => getLevel(name), [name])
  const recs = useMemo(() => (index.data ? recordsFor(index.data, name) : []), [index.data, name])
  // the shortest winning answer any model gave, to play on the board
  const best = useMemo(() => recs.filter((x) => x.r.won).sort((a, b) => (a.r.wonAt ?? 0) - (b.r.wonAt ?? 0))[0], [recs])
  const bestFile = useData(() => (best ? getRunFile(best.run.id, best.r.model, best.r.track, name) : Promise.resolve(null)), [best?.run.id, best?.r.model, best?.r.track, name])
  const [showStart, setShowStart] = useState(false)

  const error = index.error || lv.error
  if (error) return /404/.test(error.message) ? <NotFound /> : <ErrorState error={error} />
  if (!index.data || !lv.data) return <Loading rows={2} />
  const meta = lv.data.meta
  const moves = !showStart && bestFile.data?.answer ? bestFile.data.answer : ""
  const sorted = [...recs].sort((a, b) => byModel(a.r.model, b.r.model) || a.r.track.localeCompare(b.r.track) || a.run.started.localeCompare(b.run.started))

  return (
    <div>
      <PageHeader
        eyebrow={
          <span className="flex items-center gap-2">
            Level <TierBadge tier={meta.tier} />
          </span>
        }
        title={levelTitle(meta.name)}
      >
        {index.data.tiers?.[String(meta.tier)] && <p>Tier {meta.tier}: {index.data.tiers[String(meta.tier)]}.</p>}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">
              {moves ? (
                <>
                  Shortest solution found: <b className="text-foreground">{best!.r.wonAt} moves</b> by {modelName(best!.r.model)} ({TRACK[best!.r.track].name.toLowerCase()})
                </>
              ) : best ? (
                "The start of the level."
              ) : (
                "No model has solved this level yet. The board shows the start."
              )}
            </span>
            {best && (
              <Button size="xs" variant="outline" onClick={() => setShowStart((s) => !s)}>
                {showStart ? "Show the solution" : "Show the start"}
              </Button>
            )}
          </div>
          <ReplayBoard values={lv.data.values} moves={moves} />
        </div>
        <aside className="space-y-4">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-sm">About this level</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Heroes" value={<span className="flex items-center gap-2"><HeroChips heroes={meta.heroes} /> {meta.heroes.join(", ")}</span>} className="col-span-2" />
              <Stat label="Mechanics" value={meta.features.length ? meta.features.join(", ") : "none"} className="col-span-2" />
              <Stat label="Map" value={`${meta.width} × ${meta.height}`} />
              <Stat label="Objects" value={meta.entities} />
              <Stat label="Doors" value={meta.doors} />
              <Stat label="Known solution" value={meta.shortest_known ? `${meta.shortest_known} moves` : "none before these runs"} />
            </CardContent>
          </Card>
        </aside>
      </div>

      <Section title="Model runs on this level">
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Model</TableHead>
                <TableHead>Track</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Answers</TableHead>
                <TableHead>Est. cost</TableHead>
                <TableHead className="pr-4">Run</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map(({ run, r }) => (
                <RunRow key={run.id + r.model + r.track} run={run} r={r} />
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section title="What the model sees" description="The level briefing, as sent after the rule book. The map uses the legend below it; coordinates are x, y from the top left.">
        <Collapsible>
          <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
            Show the briefing <ChevronDownIcon />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="prose-run mt-4 rounded-xl border bg-card p-5">
              <Markdown remarkPlugins={[remarkGfm]}>{lv.data.briefing}</Markdown>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Section>
    </div>
  )
}

function RunRow({ run, r }: { run: Run; r: RunRecord }) {
  const v = verdict(r)
  return (
    <TableRow>
      <TableCell className="pl-4">
        <ModelLabel model={r.model} />
      </TableCell>
      <TableCell className="text-muted-foreground">{TRACK[r.track].name}</TableCell>
      <TableCell>
        <Link to={runHref(run.id, r)} className="hover:underline">
          <Outcome ok={v.ok}>{v.short}</Outcome>
        </Link>
      </TableCell>
      <TableCell className="font-mono tabular-nums">{dur(r.seconds)}</TableCell>
      <TableCell className="font-mono tabular-nums">{r.answers}</TableCell>
      <TableCell className="font-mono tabular-nums">{usd(r.cost)}</TableCell>
      <TableCell className="pr-4">
        <Link to={`/runs/${run.id}`} className="text-muted-foreground hover:text-foreground hover:underline">
          {run.title}
        </Link>
      </TableCell>
    </TableRow>
  )
}
