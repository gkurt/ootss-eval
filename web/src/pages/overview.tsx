import { Link } from "react-router"
import { ArrowRightIcon, BrainIcon, ScaleIcon, WrenchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ErrorState, Loading, Meter, ModelLabel, Section } from "@/components/page"
import { LevelThumb } from "@/components/level-thumb"
import { RunCard } from "@/pages/runs"
import { getIndex, useData, type Index, type RunRecord } from "@/lib/data"
import { byModel, levelTitle, modelColor, runHref, SET_NAME, TRACK, TRACKS, usd } from "@/lib/format"

// Every record of a level set, across runs (a model is in one run per set).
function bySet(index: Index) {
  const sets = new Map<string, { run: string; r: RunRecord }[]>()
  for (const run of index.runs) for (const r of run.records) sets.set(run.set, [...(sets.get(run.set) ?? []), { run: run.id, r }])
  return sets
}

export function OverviewPage() {
  const { data, error } = useData(getIndex, [])
  if (error) return <ErrorState error={error} />
  if (!data) return <Loading />

  const sets = bySet(data)
  const frontier = data.runs.find((r) => r.set === "frontier")
  const models = [...new Set(data.runs.flatMap((r) => r.records.map((x) => x.model)))].sort(byModel)
  const setOrder = ["starter", "frontier"].filter((s) => sets.has(s))
  const opusOpen = frontier?.records.filter((r) => r.model === "claude-opus-5-5" && r.track === "reasoning").sort((a, b) => a.level.localeCompare(b.level)) ?? []
  const totalCost = data.runs.reduce((a, run) => a + run.records.reduce((b, r) => b + r.cost, 0), 0)
  const totalRuns = data.runs.reduce((a, run) => a + run.records.length, 0)

  return (
    <div>
      <section className="relative isolate overflow-hidden rounded-2xl border bg-card px-6 py-10 sm:px-10 sm:py-14">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_0%,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_70%),radial-gradient(40%_60%_at_0%_100%,color-mix(in_oklch,var(--gold)_12%,transparent),transparent_70%)]" />
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="space-y-5">
            <Badge variant="outline" className="gap-1.5 font-normal">
              <span className="size-1.5 rounded-full bg-gold" /> {totalRuns} model runs, every answer machine-checked
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">Can Claude solve Order of the Sinking Star?</h1>
            <p className="max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
              Claude models get the game's rule book and a text briefing of a puzzle level, and answer with a move sequence. A rules engine checks every
              answer, and this site replays every run move by move.
            </p>
            <div className="flex flex-wrap gap-2">
              {frontier && (
                <Button nativeButton={false} render={<Link to={`/runs/${frontier.id}`} />}>
                  See the open-level run <ArrowRightIcon />
                </Button>
              )}
              <Button variant="outline" nativeButton={false} render={<Link to="/method" />}>
                How it works
              </Button>
            </div>
          </div>

          {frontier && (
            <Card className="bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardDescription className="text-xs font-medium tracking-wider uppercase">Open levels</CardDescription>
                <CardTitle className="text-lg leading-snug">Opus 5.5 solved all four levels that no search had solved, by reasoning alone.</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {opusOpen.map((r) => (
                  <Link key={r.level} to={runHref(frontier.id, r)} className="group rounded-lg border bg-card p-2 transition-colors hover:border-primary/50">
                    <LevelThumb name={r.level} size={150} className="aspect-[4/3] w-full" />
                    <div className="mt-2 flex items-baseline justify-between gap-2 px-0.5">
                      <span className="truncate text-xs font-medium">{levelTitle(r.level)}</span>
                      <span className="shrink-0 font-mono text-xs text-win">{r.wonAt}</span>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Section
        title="Scoreboard"
        description="Levels solved, per model and track. The starter set spans difficulty tiers 1 to 5; the open levels had no known solution before these runs."
        className="mt-12"
      >
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48 pl-4">Model</TableHead>
                {setOrder.map((s) =>
                  TRACKS.map((t) => (
                    <TableHead key={s + t} className="min-w-44">
                      <div className="text-foreground">{SET_NAME[s] ?? s}</div>
                      <div className="font-normal text-muted-foreground">{TRACK[t].name}</div>
                    </TableHead>
                  )),
                )}
                <TableHead className="pr-4 text-right">Est. cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((m) => (
                <TableRow key={m}>
                  <TableCell className="pl-4">
                    <ModelLabel model={m} />
                  </TableCell>
                  {setOrder.map((s) =>
                    TRACKS.map((t) => {
                      const rs = (sets.get(s) ?? []).filter((x) => x.r.model === m && x.r.track === t)
                      return (
                        <TableCell key={s + t}>
                          {rs.length ? <Meter value={rs.filter((x) => x.r.won).length} total={rs.length} color={modelColor(m)} /> : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                      )
                    }),
                  )}
                  <TableCell className="pr-4 text-right font-mono text-sm text-muted-foreground tabular-nums">
                    {usd(data.runs.reduce((a, run) => a + run.records.filter((r) => r.model === m).reduce((b, r) => b + r.cost, 0), 0))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Costs are Claude Code's estimates at list prices; {usd(totalCost)} for all {totalRuns} runs.
        </p>
      </Section>

      <Section title="How a run works" description="Same levels, same prompt, two ways to work. Every answer goes through the same rules engine.">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard icon={<BrainIcon />} title="Reasoning track">
            No tools. The model reads the rule book and the briefing, thinks, and answers with moves. A wrong answer gets the checker's verdict back, and
            it may answer again, up to three times.
          </InfoCard>
          <InfoCard icon={<WrenchIcon />} title="Tools track">
            Four tools run the rules on the level (show, play, try, check), 40 calls in all, plus a JavaScript scratchpad with no access to the rules.
            The budget rules out brute force. One final answer.
          </InfoCard>
          <InfoCard icon={<ScaleIcon />} title="Scoring">
            Solved or not, by the rules engine. The site also tracks answers that failed, test plays that failed, time, tokens and cost, and keeps the
            full transcript.
          </InfoCard>
        </div>
      </Section>

      <Section
        title="Runs"
        actions={
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link to="/runs" />}>
            All runs <ArrowRightIcon />
          </Button>
        }
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {data.runs.map((run) => (
            <RunCard key={run.id} run={run} />
          ))}
        </div>
      </Section>
    </div>
  )
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary [&_svg]:size-4.5">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{children}</CardContent>
    </Card>
  )
}
