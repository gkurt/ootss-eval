// A 1600×900 card for sharing the results (#/share). Not linked from the site; render it with
//   chrome --headless --screenshot=card.png --window-size=1600,900 http://localhost:5173/#/share
import { useEffect, useRef } from "react"
import { Logo } from "@/components/site-header"
import { Board, cropFor } from "@/lib/board"
import { loadLevel, replay } from "@/lib/engine"
import { getIndex, getLevel, getRunFile, useData, type Index, type LevelFile, type RunFile, type RunRecord } from "@/lib/data"
import { byModel, dur, modelColor, modelName } from "@/lib/format"

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
    <div className="dark flex h-[900px] w-[1600px] overflow-hidden bg-stage text-foreground">
      {data ? <Card index={data.index} shots={data.shots} /> : null}
    </div>
  )
}

function Card({ index, shots }: { index: Index; shots: Shot[] }) {
  const recs = index.runs.flatMap((run) => run.records)
  const models = [...new Set(recs.map((r) => r.model))].sort(byModel)
  const levels = new Set(recs.map((r) => r.level)).size
  const featured = recs.filter((r) => r.model === FEATURED && r.track === "reasoning")
  const allByReasoning = featured.length === levels && featured.every((r) => r.won)
  return (
    <div
      className="relative flex size-full gap-16 px-[80px] pt-[68px] pb-[88px]"
      style={{
        background:
          "radial-gradient(55% 70% at 100% 0%, color-mix(in oklch, var(--primary) 15%, transparent), transparent 70%), radial-gradient(45% 60% at 0% 100%, color-mix(in oklch, var(--gold) 9%, transparent), transparent 70%)",
      }}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 text-[19px] font-medium text-muted-foreground">
          <Logo className="size-9" />
          Order of the Sinking Star · Claude eval
        </div>

        <h1 className="mt-9 text-[76px] leading-[1] font-semibold tracking-[-0.035em]">Can Claude solve Sinking Star?</h1>
        <p className="mt-5 text-[32px] leading-tight font-medium tracking-[-0.01em]" style={{ color: modelColor(FEATURED) }}>
          {allByReasoning ? `Opus 5.5 solved all ${levels} levels with reasoning alone.` : `Opus 5.5 solved ${featured.filter((r) => r.won).length} of ${levels} levels with reasoning alone.`}
        </p>
        <p className="mt-6 text-[21px] leading-snug text-pretty text-muted-foreground">
          {levels} puzzle levels from the game's demo. The model gets the rule book and a text map, and answers with a list of moves, by reasoning
          alone or with rule tools (40 calls, no brute force). A rules engine checks every answer.
        </p>

        <Scoreboard models={models} recs={recs} levels={levels} />
      </div>

      <div className="flex w-[520px] shrink-0 flex-col rounded-3xl bg-white/[0.03] p-7 ring-1 ring-white/10">
        <div className="text-[13px] font-medium tracking-[0.12em] text-gold uppercase">The 4 hardest</div>
        <h2 className="mt-2 text-[27px] leading-tight font-semibold tracking-[-0.01em]">Breadth-first search couldn't find a solution for these levels.</h2>
        <p className="mt-2 text-[17px] leading-snug text-muted-foreground">
          One search went through 140 million positions. Opus solved each level by reasoning alone, on its first answer.
        </p>
        <div className="mt-7 flex flex-1 flex-col justify-between">
          {shots.map((s) => (
            <ShotRow key={s.level.meta.name} shot={s} />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-[80px] bottom-[32px] flex justify-between text-[15px] text-muted-foreground/80">
        <span>{recs.length} runs via Claude Code at high effort · cost is Claude Code's estimate at list prices</span>
        <span>Solutions to the 4 also replayed in an independent simulator</span>
      </div>
    </div>
  )
}

function Scoreboard({ models, recs, levels }: { models: string[]; recs: RunRecord[]; levels: number }) {
  const cols = "grid-cols-[190px_1fr_1fr_130px_110px]"
  return (
    <div className="mt-auto">
      <div className={`grid ${cols} gap-x-8 border-b border-foreground/15 pb-3 text-[16px] text-muted-foreground`}>
        <span>Model</span>
        <span>Reasoning alone</span>
        <span>With tools</span>
        <span className="text-right">Avg time</span>
        <span className="text-right">Cost</span>
      </div>
      {models.map((m) => {
        const rs = recs.filter((r) => r.model === m)
        const solved = (t: string) => rs.filter((r) => r.track === t && r.won).length
        return (
          <div key={m} className={`grid ${cols} items-center gap-x-8 border-b border-foreground/8 py-4 last:border-0`}>
            <span className="flex items-center gap-3 text-[22px] font-medium">
              <span className="size-3 rounded-full" style={{ background: modelColor(m) }} />
              {modelName(m)}
            </span>
            {["reasoning", "coding"].map((t) => (
              <Bar key={t} value={solved(t)} total={levels} color={modelColor(m)} />
            ))}
            <span className="text-right font-mono text-[22px] tabular-nums">{dur(rs.reduce((a, r) => a + r.seconds, 0) / rs.length).replace(/ \d+s$/, "")}</span>
            <span className="text-right font-mono text-[22px] tabular-nums">${Math.round(rs.reduce((a, r) => a + r.cost, 0))}</span>
          </div>
        )
      })}
    </div>
  )
}

function Bar({ value, total, color }: { value: number; total: number; color: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-[72px] font-mono text-[24px] font-medium tabular-nums">
        {value}
        <span className="text-muted-foreground">/{total}</span>
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
        <div className="h-full rounded-full" style={{ width: `${(100 * value) / total}%`, background: color }} />
      </div>
    </div>
  )
}

// A small picture of the level at the moment the model's answer wins, and the result.
function ShotRow({ shot }: { shot: Shot }) {
  const host = useRef<HTMLDivElement>(null)
  const { level, rec } = shot
  useEffect(() => {
    if (!host.current || !rec.answer) return
    const L = loadLevel(level.values)
    const R = replay(L, rec.answer)
    const crop = cropFor(L.rows, R.frames.map((f) => f.st), 1)
    new Board(host.current, L, { cell: 24, crop }).render(R.frames[R.frames.length - 1].st, { animate: false })
  }, [level, rec])
  return (
    <div className="flex items-center gap-4 rounded-xl bg-black/25 p-2.5 ring-1 ring-white/[0.07]">
      <div className="h-[84px] w-[124px] shrink-0 overflow-hidden rounded-md bg-[#070a14]">
        <div className="flex size-full items-center justify-center [container-type:size]">
          <div ref={host} className="w-[min(100cqw,calc(100cqh*var(--ar)))]!" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[13px] leading-snug text-white/85">
          {/* long names break after an underscore */}
          {level.meta.name.split("_").map((part, i, all) => (
            <span key={i}>
              {part}
              {i < all.length - 1 && (
                <>
                  _<wbr />
                </>
              )}
            </span>
          ))}
        </div>
        <div className="mt-1 text-[15px] text-white/55">{level.meta.width} × {level.meta.height} map</div>
      </div>
      <div className="shrink-0 pr-2 text-right">
        <div className="text-[19px] font-semibold" style={{ color: "var(--win)" }}>
          ✓ {rec.result.wonAt} moves
        </div>
        <div className="text-[14px] text-white/55">in {dur(rec.attempts.find((a) => a.won)?.t ?? rec.seconds)}</div>
      </div>
    </div>
  )
}
