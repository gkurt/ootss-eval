// A 1600×900 card for sharing the results (#/share). Not linked from the site; render it with
//   chrome --headless --screenshot=card.png --window-size=1600,900 http://localhost:5173/#/share
import { useEffect, useRef } from "react"
import { Logo } from "@/components/site-header"
import { Board, cropFor } from "@/lib/board"
import { loadLevel, replay } from "@/lib/engine"
import { getIndex, getLevel, getRunFile, useData, type Index, type LevelFile, type RunFile } from "@/lib/data"
import { byModel, dur, modelColor, modelName, TRACK, TRACKS } from "@/lib/format"

const FEATURED = "claude-opus-5-5"
const OPEN = ["mirror_21", "surrounded", "worlds_collide_heroes_and_mirrors_v3", "walk_it_over"]

type Shot = { level: LevelFile; rec: RunFile }

async function load() {
  const index = await getIndex()
  const frontier = index.runs.find((r) => r.set === "frontier")!
  const shots = await Promise.all(
    OPEN.map(async (l) => ({ level: await getLevel(l), rec: await getRunFile(frontier.id, FEATURED, "reasoning", l) })),
  )
  return { index, shots }
}

export function SharePage() {
  const { data } = useData(load, [])
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])
  return (
    <div className="dark flex h-[900px] w-[1600px] overflow-hidden bg-stage text-foreground" style={{ fontFeatureSettings: '"ss01"' }}>
      {data ? <Card index={data.index} shots={data.shots} /> : null}
    </div>
  )
}

function Card({ index, shots }: { index: Index; shots: Shot[] }) {
  const recs = index.runs.flatMap((run) => run.records.map((r) => ({ set: run.set, r })))
  const models = [...new Set(recs.map((x) => x.r.model))].sort(byModel)
  const sets = [
    { key: "starter", name: "Starter set", sub: "12 levels, tiers 1–5" },
    { key: "frontier", name: "Open levels", sub: "4 levels, no known solution" },
  ]
  const runs = recs.length
  return (
    <div
      className="relative flex size-full gap-14 px-[72px] py-[64px]"
      style={{
        background:
          "radial-gradient(60% 70% at 100% 0%, color-mix(in oklch, var(--primary) 16%, transparent), transparent 70%), radial-gradient(45% 60% at 0% 100%, color-mix(in oklch, var(--gold) 10%, transparent), transparent 70%)",
      }}
    >
      <div className="flex w-[760px] shrink-0 flex-col">
        <div className="flex items-center gap-3 text-[20px] font-medium text-muted-foreground">
          <Logo className="size-9" />
          <span>
            Claude <span className="text-foreground/40">×</span> Order of the Sinking Star
          </span>
        </div>

        <h1 className="mt-10 text-[60px] leading-[1.05] font-semibold tracking-[-0.03em] text-balance">
          <span style={{ color: modelColor(FEATURED) }}>Claude Opus 5.5</span> solved all 4 levels our solvers couldn't.
        </h1>
        <p className="mt-6 text-[22px] leading-snug text-pretty text-muted-foreground">
          Puzzle levels from the game's demo. The model reads the rule book and a text map, then answers with a list of moves. A rules engine checks
          every answer.
        </p>

        <div className="mt-auto">
          <div className="mb-3 grid grid-cols-[150px_repeat(4,1fr)] gap-x-5 text-[15px] text-muted-foreground">
            <span />
            {sets.map((s) => (
              <div key={s.key} className="col-span-2 border-b border-foreground/15 pb-2">
                <span className="font-medium text-foreground">{s.name}</span> <span>· {s.sub}</span>
              </div>
            ))}
            <span />
            {sets.flatMap((s) =>
              TRACKS.map((t) => (
                <span key={s.key + t} className="pt-2">
                  {TRACK[t].name}
                </span>
              )),
            )}
          </div>
          <div className="grid grid-cols-[150px_repeat(4,1fr)] items-center gap-x-5 gap-y-4">
            {models.map((m) => (
              <Row key={m} model={m} cells={sets.flatMap((s) => TRACKS.map((t) => recs.filter((x) => x.set === s.key && x.r.model === m && x.r.track === t).map((x) => x.r.won)))} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-[repeat(2,minmax(0,1fr))] gap-4">
          {shots.map((s) => (
            <Shot key={s.level.meta.name} shot={s} />
          ))}
        </div>
        <p className="mt-5 text-[17px] leading-snug text-muted-foreground">
          <span className="text-foreground">mirror_21:</span> a breadth-first search went through 140 million positions and found no win. Opus found one in
          73 moves, by reasoning alone, on its first try.
        </p>
      </div>

      <div className="absolute inset-x-[72px] bottom-[26px] flex justify-between text-[14px] text-muted-foreground/80">
        <span>
          {runs} runs via Claude Code · reasoning alone, or rule tools on a 40-call budget (no brute force)
        </span>
        <span>Open-level solutions also replayed in a second, independent simulator</span>
      </div>
    </div>
  )
}

function Row({ model, cells }: { model: string; cells: boolean[][] }) {
  return (
    <>
      <span className="flex items-center gap-2.5 text-[20px] font-medium">
        <span className="size-3 rounded-full" style={{ background: modelColor(model) }} />
        {modelName(model)}
      </span>
      {cells.map((c, i) => {
        const won = c.filter(Boolean).length
        return (
          <div key={i} className="space-y-1.5">
            <div className="font-mono text-[22px] font-medium tabular-nums">
              {won}
              <span className="text-muted-foreground">/{c.length}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
              <div className="h-full rounded-full" style={{ width: `${(100 * won) / Math.max(1, c.length)}%`, background: modelColor(model) }} />
            </div>
          </div>
        )
      })}
    </>
  )
}

// The level at the moment the model's answer wins.
function Shot({ shot }: { shot: Shot }) {
  const host = useRef<HTMLDivElement>(null)
  const { level, rec } = shot
  useEffect(() => {
    if (!host.current || !rec.answer) return
    const L = loadLevel(level.values)
    const R = replay(L, rec.answer)
    const crop = cropFor(L.rows, R.frames.map((f) => f.st), 1)
    const b = new Board(host.current, L, { cell: 32, crop })
    b.render(R.frames[R.frames.length - 1].st, { animate: false })
  }, [level, rec])
  return (
    <div className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl bg-[#070a14] ring-1 ring-white/10">
      <div className="min-h-0 flex-1 p-3">
        {/* the tile is a size container, so the board fits it whatever its shape */}
        <div className="flex size-full items-center justify-center [container-type:size]">
          <div ref={host} className="w-[min(100cqw,calc(100cqh*var(--ar)))]!" />
        </div>
      </div>
      <div className="flex flex-col gap-0.5 border-t border-white/10 px-4 py-2.5 text-[15px]">
        <span className="font-mono text-[13px] whitespace-nowrap text-white/85">{level.meta.name}</span>
        <span className="text-white/60">
          <span className="font-medium" style={{ color: "var(--win)" }}>
            ✓ {rec.result.wonAt} moves
          </span>{" "}
          · {dur(rec.attempts.find((a) => a.won)?.t ?? rec.seconds)}
        </span>
      </div>
    </div>
  )
}
