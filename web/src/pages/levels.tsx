import { Link } from "react-router"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ErrorState, Loading, PageHeader, TierBadge } from "@/components/page"
import { LevelThumb } from "@/components/level-thumb"
import { roleByName } from "@/lib/board"
import { getIndex, useData, type Index, type RunRecord } from "@/lib/data"
import { byModel, levelTitle, modelName, TRACK, TRACKS } from "@/lib/format"
import { cn } from "@/lib/utils"

export const recordsFor = (index: Index, level: string) =>
  index.runs.flatMap((run) => run.records.filter((r) => r.level === level).map((r) => ({ run, r })))

export function HeroChips({ heroes }: { heroes: string[] }) {
  return (
    <span className="inline-flex -space-x-1">
      {heroes.map((h) => {
        const role = roleByName(h)
        return (
          <span
            key={h}
            title={h}
            className="flex size-5 items-center justify-center rounded-full text-[11px] ring-2 ring-card"
            style={{ background: role?.color ?? "#999", color: role?.ink ?? "#0b1020" }}
          >
            {role?.glyph ?? "?"}
          </span>
        )
      })}
    </span>
  )
}

// One square per model and track: solved or not.
function ResultDots({ recs }: { recs: RunRecord[] }) {
  const models = [...new Set(recs.map((r) => r.model))].sort(byModel)
  return (
    <div className="flex gap-2">
      {models.map((m) => (
        <Tooltip key={m}>
          <TooltipTrigger className="flex gap-0.5">
            {TRACKS.map((t) => {
              const r = recs.find((x) => x.model === m && x.track === t)
              return <span key={t} className={cn("size-2.5 rounded-sm", !r ? "bg-muted" : r.won ? "bg-win" : "bg-loss/70")} />
            })}
          </TooltipTrigger>
          <TooltipContent>
            {modelName(m)}:{" "}
            {TRACKS.map((t) => {
              const r = recs.find((x) => x.model === m && x.track === t)
              return `${TRACK[t].name.toLowerCase()} ${!r ? "not run" : r.won ? "solved" : "missed"}`
            }).join(", ")}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}

export function LevelsPage() {
  const { data, error } = useData(getIndex, [])
  if (error) return <ErrorState error={error} />
  if (!data) return <Loading />
  const levels = Object.values(data.levels).sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name))
  return (
    <div>
      <PageHeader title="Levels">
        The {levels.length} levels the runs used, by difficulty tier. Tiers come from how hard each level was for a plain breadth-first search on the
        same rules; open levels had no known solution before these runs.
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {levels.map((l) => {
          const recs = recordsFor(data, l.name).map((x) => x.r)
          const solved = recs.filter((r) => r.won).length
          return (
            <Card key={l.name} className="relative gap-0 p-0 transition-colors hover:ring-primary/40">
              <LevelThumb name={l.name} size={280} className="aspect-[4/3] rounded-none" />
              <div className="space-y-2.5 p-4">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/levels/${encodeURIComponent(l.name)}`} className="font-medium after:absolute after:inset-0">
                    {levelTitle(l.name)}
                  </Link>
                  <TierBadge tier={l.tier} />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <HeroChips heroes={l.heroes} />
                  <span className="truncate">{l.features.length ? l.features.join(", ") : "no hazards"}</span>
                </div>
                <div className="flex items-center justify-between gap-2 border-t pt-2.5 text-xs text-muted-foreground">
                  <span>
                    solved in {solved} of {recs.length} runs
                  </span>
                  <span className="relative z-10">
                    <ResultDots recs={recs} />
                  </span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
