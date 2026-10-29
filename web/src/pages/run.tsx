import { Link, useParams } from "react-router"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ErrorState, Loading, Meter, ModelLabel, NotFound, Outcome, PageHeader, Section, TierBadge } from "@/components/page"
import { LevelThumb } from "@/components/level-thumb"
import { runDate } from "@/pages/runs"
import { getIndex, useData, type Run } from "@/lib/data"
import { dur, fmt, levelTitle, modelColor, runColumns, runHref, TRACK, usd, verdict } from "@/lib/format"

export function RunPage() {
  const { id = "" } = useParams()
  const { data, error } = useData(getIndex, [])
  if (error) return <ErrorState error={error} />
  if (!data) return <Loading />
  const run = data.runs.find((r) => r.id === id)
  if (!run) return <NotFound />
  const s = run.settings
  return (
    <div>
      <PageHeader eyebrow={`Run · ${runDate(run)}`} title={run.title}>
        <p>{run.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="font-normal">
            via {s.via === "cli" ? "Claude Code" : "the API"}
          </Badge>
          <Badge variant="secondary" className="font-normal">
            effort {s.effort}
          </Badge>
          <Badge variant="secondary" className="font-normal">
            {s.minutes} min per run
          </Badge>
          <Badge variant="secondary" className="font-normal">
            reasoning: {s.attempts} answers
          </Badge>
          <Badge variant="secondary" className="font-normal">
            tools: {s.budget} calls{s.sandbox ? " + JS scratchpad" : ""}
          </Badge>
        </div>
      </PageHeader>

      <Section title="Summary" description="Per model and track. Time to solve runs from the start of a run to its winning answer, over the solved runs.">
        <SummaryTable run={run} />
      </Section>

      <Section title="Results" description="Click any result to replay it with the full transcript.">
        <ResultsGrid run={run} levelsMeta={data.levels} />
      </Section>
    </div>
  )
}

function Head({ children, tip, className }: { children: React.ReactNode; tip?: string; className?: string }) {
  if (!tip) return <TableHead className={className}>{children}</TableHead>
  return (
    <TableHead className={className}>
      <Tooltip>
        <TooltipTrigger className="cursor-help underline decoration-dotted underline-offset-4">{children}</TooltipTrigger>
        <TooltipContent className="max-w-64">{tip}</TooltipContent>
      </Tooltip>
    </TableHead>
  )
}

function SummaryTable({ run }: { run: Run }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Model</TableHead>
            <TableHead>Track</TableHead>
            <TableHead className="min-w-40">Solved</TableHead>
            <Head tip="Runs whose first answer won.">Right first time</Head>
            <Head tip="Answers that did not win, over all runs. The tools track gives one answer per run.">Wrong answers</Head>
            <Head tip="play and check calls in the tools track; in brackets, how many tried moves that did not win.">Test plays</Head>
            <Head tip="Rule-tool calls per run (show, play, try, check), out of the budget.">Tool calls</Head>
            <TableHead>Time / run</TableHead>
            <TableHead>Time to solve</TableHead>
            <TableHead className="text-right">Output tokens</TableHead>
            <TableHead className="pr-4 text-right">Est. cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runColumns(run).map(({ model, track }) => {
            const rs = run.records.filter((r) => r.model === model && r.track === track)
            const won = rs.filter((r) => r.won)
            const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null)
            const sum = (f: (r: (typeof rs)[number]) => number) => rs.reduce((a, r) => a + f(r), 0)
            return (
              <TableRow key={model + track}>
                <TableCell className="pl-4">
                  <ModelLabel model={model} />
                </TableCell>
                <TableCell className="text-muted-foreground">{TRACK[track].name}</TableCell>
                <TableCell>
                  <Meter value={won.length} total={rs.length} color={modelColor(model)} />
                </TableCell>
                <TableCell className="font-mono tabular-nums">
                  {rs.filter((r) => r.firstRight).length}/{rs.length}
                </TableCell>
                <TableCell className="font-mono tabular-nums">{sum((r) => r.wrongAnswers)}</TableCell>
                <TableCell className="font-mono tabular-nums">
                  {track === "coding" ? (
                    <>
                      {sum((r) => r.testPlays)} <span className="text-muted-foreground">({sum((r) => r.failedPlays)})</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="font-mono tabular-nums">{track === "coding" ? (sum((r) => r.toolCalls) / rs.length).toFixed(1) : <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell className="font-mono tabular-nums">{dur(avg(rs.map((r) => r.seconds)))}</TableCell>
                <TableCell className="font-mono tabular-nums">{dur(avg(won.map((r) => r.solveSeconds ?? r.seconds)))}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">{fmt(sum((r) => r.output))}</TableCell>
                <TableCell className="pr-4 text-right font-mono tabular-nums">{usd(sum((r) => r.cost))}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function ResultsGrid({ run, levelsMeta }: { run: Run; levelsMeta: Record<string, { tier: number; shortest_known: number | null }> }) {
  const cols = runColumns(run)
  const levels = run.settings.levels.filter((l) => run.records.some((r) => r.level === l))
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table className="border-separate border-spacing-0">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 min-w-56 bg-card pl-4">Level</TableHead>
            {cols.map((c) => (
              <TableHead key={c.model + c.track} className="min-w-36 align-bottom">
                <ModelLabel model={c.model} className="text-foreground" />
                <div className="pl-4 font-normal text-muted-foreground">{TRACK[c.track].name}</div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {levels.map((lv) => {
            const meta = levelsMeta[lv]
            return (
              <TableRow key={lv} className="hover:bg-transparent">
                <TableCell className="sticky left-0 z-10 bg-card py-2 pl-4">
                  <Link to={`/levels/${encodeURIComponent(lv)}`} className="group flex items-center gap-3">
                    <LevelThumb name={lv} size={64} className="size-12 shrink-0" />
                    <div className="min-w-0">
                      <div className="truncate font-medium group-hover:underline">{levelTitle(lv)}</div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <TierBadge tier={meta?.tier ?? 0} />
                        {meta?.shortest_known ? `known: ${meta.shortest_known} moves` : "no known solution"}
                      </div>
                    </div>
                  </Link>
                </TableCell>
                {cols.map((c) => {
                  const r = run.records.find((x) => x.level === lv && x.model === c.model && x.track === c.track)
                  if (!r) return <TableCell key={c.model + c.track} className="text-muted-foreground">—</TableCell>
                  const v = verdict(r)
                  return (
                    <TableCell key={c.model + c.track} className="p-1.5">
                      <Link
                        to={runHref(run.id, r)}
                        title={v.long}
                        className={`block rounded-lg px-2.5 py-2 transition-colors ${v.ok ? "bg-win-soft hover:ring-1 hover:ring-win/50" : "bg-loss-soft hover:ring-1 hover:ring-loss/50"}`}
                      >
                        <Outcome ok={v.ok} className="text-sm">
                          {v.short}
                        </Outcome>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {dur(r.seconds)}
                          {r.track === "reasoning" && r.answers > 1 ? ` · ${r.answers} answers` : ""}
                        </div>
                      </Link>
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
