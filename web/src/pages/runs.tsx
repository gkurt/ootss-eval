import { Link } from "react-router"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorState, Loading, Meter, ModelLabel, PageHeader } from "@/components/page"
import { getIndex, useData, type Run } from "@/lib/data"
import { byModel, dur, modelColor, SET_NAME, TRACK, TRACKS, usd } from "@/lib/format"

export const runDate = (run: Run) => new Date(run.started).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })

export function RunCard({ run }: { run: Run }) {
  const models = [...new Set(run.records.map((r) => r.model))].sort(byModel)
  const levels = new Set(run.records.map((r) => r.level)).size
  return (
    <Card className="relative transition-colors hover:ring-primary/40">
      <CardHeader>
        <CardDescription className="flex items-center gap-2 text-xs">
          <span>{runDate(run)}</span>
          <span>·</span>
          <span>{SET_NAME[run.set] ?? run.set}</span>
        </CardDescription>
        <CardTitle className="text-base">
          <Link to={`/runs/${run.id}`} className="after:absolute after:inset-0">
            {run.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-x-4 gap-y-2 text-sm">
          <span />
          {TRACKS.map((t) => (
            <span key={t} className="text-xs text-muted-foreground">
              {TRACK[t].name}
            </span>
          ))}
          {models.map((m) => (
            <Row key={m} run={run} model={m} />
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex flex-wrap gap-1.5 border-t pt-3 text-xs text-muted-foreground">
        <Badge variant="secondary" className="font-normal">
          {levels} levels
        </Badge>
        <Badge variant="secondary" className="font-normal">
          {run.settings.minutes} min per run
        </Badge>
        <Badge variant="secondary" className="font-normal">
          effort {run.settings.effort}
        </Badge>
      </CardFooter>
    </Card>
  )
}

function Row({ run, model }: { run: Run; model: string }) {
  return (
    <>
      <ModelLabel model={model} className="text-sm" />
      {TRACKS.map((t) => {
        const rs = run.records.filter((r) => r.model === model && r.track === t)
        return <Meter key={t} value={rs.filter((r) => r.won).length} total={rs.length} color={modelColor(model)} />
      })}
    </>
  )
}

export function RunsPage() {
  const { data, error } = useData(getIndex, [])
  if (error) return <ErrorState error={error} />
  if (!data) return <Loading />
  return (
    <div>
      <PageHeader title="Runs">
        Each run puts one or more models on a set of levels, in both tracks. Open a run for its summary and the result of every level, and any result
        for the full replay.
      </PageHeader>
      <div className="space-y-4">
        {data.runs.map((run) => {
          const cost = run.records.reduce((a, r) => a + r.cost, 0)
          const time = run.records.reduce((a, r) => a + r.seconds, 0)
          return (
            <div key={run.id} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
              <RunCard run={run} />
              <Card className="justify-center">
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p className="text-pretty text-foreground">{run.description}</p>
                  <p>
                    {run.records.length} runs · {dur(time)} of model time in all · {usd(cost)} estimated · via {run.settings.via === "cli" ? "Claude Code" : "the API"}
                  </p>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
