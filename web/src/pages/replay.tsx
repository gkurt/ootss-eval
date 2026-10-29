import { useMemo, useState } from "react"
import { Link, useParams } from "react-router"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ChevronLeftIcon, ChevronRightIcon, CodeIcon, MessageSquareIcon, PlayIcon, StickyNoteIcon, WrenchIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ErrorState, Loading, ModelLabel, NotFound, Outcome, Stat, TierBadge, TrackBadge } from "@/components/page"
import { ReplayBoard } from "@/components/replay-board"
import { getIndex, getLevel, getRunFile, useData, type Index, type LevelFile, type RunEvent, type RunFile } from "@/lib/data"
import { dur, fmt, levelTitle, modelName, runHref, usd, verdict } from "@/lib/format"

type Source = { key: string; label: string; moves: string; fail: string | null; note: string }

export function ReplayPage() {
  const { id = "", model = "", track = "", level = "" } = useParams()
  const index = useData(getIndex, [])
  const lv = useData(() => getLevel(level), [level])
  const rec = useData(() => getRunFile(id, model, track, level), [id, model, track, level])
  const error = index.error || lv.error || rec.error
  if (error) return /404/.test(error.message) ? <NotFound /> : <ErrorState error={error} />
  if (!index.data || !lv.data || !rec.data) return <Loading rows={2} />
  return <Replay key={`${id}/${model}/${track}/${level}`} index={index.data} level={lv.data} rec={rec.data} />
}

const why = (line: string) => line.replace(/^FAILED at move \d+ \([A-Z]\): /, "")

function sourcesOf(rec: RunFile): Source[] {
  const out: Source[] = []
  if (rec.answer != null) out.push({ key: "final", label: "Final answer", moves: rec.answer, fail: rec.result.failedAt ? why(rec.result.line) : null, note: rec.result.line })
  if (rec.track === "reasoning")
    rec.attempts.forEach((a, i) => {
      if (a.moves == null || (i === rec.attempts.length - 1 && a.moves === rec.answer)) return
      out.push({ key: `answer${i}`, label: `Answer ${i + 1}`, moves: a.moves, fail: a.failedAt ? why(a.line) : null, note: a.line })
    })
  rec.events.forEach((e, j) => {
    if (e.type === "tool" && e.moves != null && e.moves.length)
      out.push({ key: `ev${j}`, label: `${e.name} #${e.n ?? ""}`.trim(), moves: e.moves, fail: e.check?.failedAt ? e.check.how : null, note: `${e.name} call at ${dur(e.t)}` })
  })
  return out
}

function Replay({ index, level, rec }: { index: Index; level: LevelFile; rec: RunFile }) {
  const run = index.runs.find((r) => r.id === rec.run)
  const sources = useMemo(() => sourcesOf(rec), [rec])
  const [srcKey, setSrcKey] = useState(sources[0]?.key ?? "")
  const src = sources.find((s) => s.key === srcKey) ?? sources[0]
  const v = verdict({ ...rec.result, answered: rec.answer != null })

  // neighbours: the same model and track on the run's other levels
  const order = run ? run.settings.levels.filter((l) => run.records.some((r) => r.level === l && r.model === rec.model && r.track === rec.track)) : []
  const at = order.indexOf(rec.level)
  const prev = at > 0 ? order[at - 1] : null
  const next = at >= 0 && at < order.length - 1 ? order[at + 1] : null
  const href = (l: string) => runHref(rec.run, { model: rec.model, track: rec.track, level: l })

  return (
    <div>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/runs" />}>Runs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to={`/runs/${rec.run}`} />}>{run?.title ?? rec.run}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{levelTitle(rec.level)}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            <Link to={`/levels/${encodeURIComponent(rec.level)}`} className="hover:underline">
              {levelTitle(rec.level)}
            </Link>
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <ModelLabel model={rec.model} />
            <TrackBadge track={rec.track} />
            <TierBadge tier={rec.tier} />
            <Outcome ok={v.ok}>{v.ok ? `Solved in ${rec.result.wonAt} moves` : v.short}</Outcome>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" disabled={!prev} nativeButton={!prev} render={prev ? <Link to={href(prev)} /> : undefined}>
            <ChevronLeftIcon /> <span className="max-w-32 truncate">{prev ? levelTitle(prev) : "Previous"}</span>
          </Button>
          <Button variant="outline" size="sm" disabled={!next} nativeButton={!next} render={next ? <Link to={href(next)} /> : undefined}>
            <span className="max-w-32 truncate">{next ? levelTitle(next) : "Next"}</span> <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-3">
          {sources.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs text-muted-foreground">Replay</span>
              {sources.map((s) => (
                <Button key={s.key} size="xs" variant={s.key === src?.key ? "default" : "outline"} onClick={() => setSrcKey(s.key)} className="font-normal">
                  {s.label}
                </Button>
              ))}
            </div>
          )}
          {src ? (
            <ReplayBoard values={level.values} moves={src.moves} failText={src.fail} />
          ) : (
            <>
              <ReplayBoard values={level.values} moves="" />
              <p className="text-sm text-muted-foreground">This run gave no answer to replay. The board shows the start.</p>
            </>
          )}
        </div>

        <aside className="space-y-4">
          <ResultCard rec={rec} />
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-sm">Level</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Heroes" value={level.meta.heroes.join(", ")} />
              <Stat label="Size" value={`${level.meta.width} × ${level.meta.height}`} />
              <Stat label="Mechanics" value={level.meta.features.length ? level.meta.features.join(", ") : "none"} className="col-span-2" />
              <Stat label="Known solution" value={level.meta.shortest_known ? `${level.meta.shortest_known} moves` : "none"} />
              <Stat label="Doors" value={level.meta.doors} />
            </CardContent>
          </Card>
        </aside>
      </div>

      <Separator className="my-10" />
      <Transcript rec={rec} onReplay={(k) => setSrcKey(k)} sources={sources} />
    </div>
  )
}

function ResultCard({ rec }: { rec: RunFile }) {
  const won = rec.result.won
  const solvedAt = rec.attempts.find((a) => a.won)?.t
  return (
    <Card size="sm" className={cn("ring-1", won ? "ring-win/40" : "ring-loss/40")}>
      <CardHeader>
        <CardTitle className="text-sm">Result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className={cn("rounded-lg px-3 py-2 font-mono text-xs leading-relaxed", won ? "bg-win-soft text-win" : "bg-loss-soft text-loss")}>{rec.result.line}</div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Wall time" value={dur(rec.seconds)} hint={rec.api_seconds ? `${dur(rec.api_seconds)} in the model` : undefined} />
          <Stat label="Solved at" value={solvedAt != null ? dur(solvedAt) : "—"} />
          <Stat label="Answers" value={`${rec.attempts.length} of ${rec.track === "reasoning" ? rec.settings.attempts : 1}`} />
          <Stat label="Rule-tool calls" value={rec.track === "coding" ? `${rec.tool_calls} of ${rec.settings.budget}` : "—"} hint={rec.js_runs ? `${rec.js_runs} JS runs` : undefined} />
          <Stat label="Output tokens" value={fmt(rec.usage.output)} hint={rec.usage.thinking ? `${fmt(rec.usage.thinking)} thinking` : undefined} />
          <Stat label="Est. cost" value={usd(rec.cost)} />
        </div>
        <div className="text-xs text-muted-foreground">
          {modelName(rec.model)}, effort {rec.settings.effort}, via {rec.via === "cli" ? `Claude Code${rec.cli?.version ? ` ${rec.cli.version}` : ""}` : "the API"}
        </div>
      </CardContent>
    </Card>
  )
}

function Transcript({ rec, sources, onReplay }: { rec: RunFile; sources: Source[]; onReplay: (key: string) => void }) {
  const events = rec.events.filter((e) => e.type !== "thinking" || e.text)
  const hidden = rec.via === "cli" && !rec.events.some((e) => e.type === "thinking" && e.text)
  // the replay source an event's moves belong to, if any
  const replayKey = (e: RunEvent) => {
    if (e.type === "tool") return sources.find((s) => s.key === `ev${rec.events.indexOf(e)}`)?.key
    if (e.type === "answer") {
      const k = rec.attempts.findIndex((a) => Math.abs(a.t - e.t) < 0.05)
      if (k === rec.attempts.length - 1 && rec.answer != null) return "final"
      return sources.find((s) => s.key === `answer${k}`)?.key
    }
    return undefined
  }
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Transcript</h2>
          <p className="text-sm text-muted-foreground">
            Everything the run produced, stamped with the time since it started.
            {hidden && ` Claude Code reports thinking as a token count only (${fmt(rec.usage.thinking ?? 0)} tokens here), so the reasoning between these steps is not shown.`}
          </p>
        </div>
      </div>
      <ol className="relative space-y-4 border-l pl-6 sm:ml-14">
        {events.map((e, j) => (
          <li key={j} className="relative">
            <span className="absolute top-1 -left-[1.95rem] flex size-4 items-center justify-center rounded-full border bg-background text-muted-foreground [&_svg]:size-2.5">
              <EventIcon e={e} />
            </span>
            <span className="absolute top-0.5 -left-[5.5rem] hidden w-12 text-right font-mono text-xs text-muted-foreground tabular-nums sm:block">{dur(e.t)}</span>
            <Event e={e} replay={replayKey(e)} onReplay={onReplay} />
          </li>
        ))}
      </ol>
    </section>
  )
}

function EventIcon({ e }: { e: RunEvent }) {
  if (e.type === "tool") return e.name === "run_js" ? <CodeIcon /> : <WrenchIcon />
  if (e.type === "answer") return <PlayIcon />
  if (e.type === "text") return <MessageSquareIcon />
  return <StickyNoteIcon />
}

function Event({ e, replay, onReplay }: { e: RunEvent; replay?: string; onReplay: (k: string) => void }) {
  const stamp = <span className="mr-2 font-mono text-xs text-muted-foreground sm:hidden">{dur(e.t)}</span>
  const replayBtn = replay && (
    <Button
      size="xs"
      variant="ghost"
      onClick={() => {
        onReplay(replay)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }}
    >
      <PlayIcon /> Replay
    </Button>
  )
  if (e.type === "text" || e.type === "thinking")
    return (
      <div>
        {stamp}
        <div className={cn("prose-run rounded-xl border bg-card px-4 py-3", e.type === "thinking" && "text-muted-foreground italic")}>
          <Markdown remarkPlugins={[remarkGfm]}>{e.text ?? ""}</Markdown>
        </div>
      </div>
    )
  if (e.type === "tool") {
    const lines = (e.output ?? "").split("\n").length
    return (
      <div className="rounded-xl border bg-card">
        <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-sm">
          {stamp}
          <span className="font-mono font-medium">{e.name}</span>
          {e.n ? <span className="text-xs text-muted-foreground">call {e.n}</span> : null}
          {e.check && (
            <Badge variant="outline" className={e.check.won ? "border-win/40 text-win" : "border-loss/40 text-loss"}>
              {e.check.won ? "wins" : e.check.failedAt ? `${e.check.how} at ${e.check.failedAt}` : "not won"}
            </Badge>
          )}
          {e.moves != null && <code className="max-w-full truncate rounded bg-muted px-1.5 py-0.5 font-mono text-xs sm:max-w-md">{e.moves || "(start)"}</code>}
          <span className="ml-auto">{replayBtn}</span>
        </div>
        {e.code != null && <pre className="max-h-96 overflow-auto border-t bg-muted/40 px-4 py-3 font-mono text-xs leading-snug">{e.code}</pre>}
        <Collapsible defaultOpen={lines <= 8}>
          <CollapsibleTrigger className="w-full border-t px-4 py-1.5 text-left text-xs text-muted-foreground hover:text-foreground">
            Output · {lines} lines{e.done != null && e.done - e.t >= 1 ? ` · ${dur(e.done - e.t)}` : ""}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <pre className={cn("max-h-96 overflow-auto border-t px-4 py-3 font-mono text-xs leading-snug", e.error && "text-loss")}>{e.output ?? "(no result)"}</pre>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  }
  if (e.type === "answer")
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {stamp}
          <span className="font-medium">Answer</span>
          <span className="text-xs text-muted-foreground">{e.moves ? `${e.moves.length} moves` : "no moves"}</span>
          <span className="ml-auto">{replayBtn}</span>
        </div>
        {e.moves ? <code className="mt-2 block font-mono text-xs break-all text-muted-foreground">{e.moves}</code> : null}
        {e.line && (
          <Outcome ok={!!e.won} className="mt-2 text-xs font-normal">
            {e.line}
          </Outcome>
        )}
      </div>
    )
  if (e.type === "feedback")
    return (
      <div className="rounded-xl border border-dashed px-4 py-2.5 font-mono text-xs whitespace-pre-wrap text-muted-foreground">
        {stamp}
        {e.text}
      </div>
    )
  return (
    <div className="text-sm text-muted-foreground italic">
      {stamp}
      {e.text}
    </div>
  )
}
