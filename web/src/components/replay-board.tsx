import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ChevronFirstIcon, ChevronLastIcon, PauseIcon, PlayIcon, StepBackIcon, StepForwardIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"
import { Board, cropFor } from "@/lib/board"
import { loadLevel, replay, type V } from "@/lib/engine"

const KEY: Record<string, string> = { U: "↑", D: "↓", L: "←", R: "→", C: "⇄", X: "✦" }
const KEY_NAME: Record<string, string> = { U: "up", D: "down", L: "left", R: "right", C: "next hero", X: "activate mirrors" }
const SPEEDS = [2, 5, 10, 20]

type Props = {
  values: V
  moves: string
  // why the first refused move failed, from the checker (shown on the board)
  failText?: string | null
  className?: string
  autoPlay?: boolean
}

// A level board that replays a move string with the engine, with player controls and a move tape.
export function ReplayBoard({ values, moves, failText, className, autoPlay = false }: Props) {
  const L = useMemo(() => loadLevel(values), [values])
  const R = useMemo(() => replay(L, moves), [L, moves])
  const last = R.frames.length - 1
  const host = useRef<HTMLDivElement>(null)
  const board = useRef<Board | null>(null)
  const tape = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(autoPlay && last > 0)
  const [speed, setSpeed] = useState(5)

  // a fresh board whenever the level or the moves change
  useEffect(() => {
    if (!host.current || !L.start) return
    const crop = cropFor(L.rows, R.frames.map((f) => f.st), 1)
    board.current = new Board(host.current, L, { cell: 40, crop })
    board.current.render(R.frames[0].st, { animate: false })
    setI(0)
    setPlaying(autoPlay && R.frames.length > 1)
  }, [L, R, autoPlay])

  useEffect(() => {
    board.current?.render(R.frames[Math.min(i, last)].st, { animate: true, ms: Math.min(200, 800 / speed) })
    const chip = tape.current?.querySelector<HTMLElement>(`[data-i="${i - 1}"]`)
    const box = tape.current
    if (chip && box) {
      const top = chip.offsetTop - box.offsetTop
      if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - chip.offsetHeight) box.scrollTop = top - box.clientHeight / 2
    }
  }, [i, R, last, speed])

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => {
      setI((x) => {
        if (x >= last) {
          setPlaying(false)
          return x
        }
        return x + 1
      })
    }, 1000 / speed)
    return () => clearInterval(t)
  }, [playing, speed, last])

  const go = useCallback((x: number) => {
    setPlaying(false)
    setI(Math.max(0, Math.min(last, x)))
  }, [last])

  const toggle = useCallback(() => {
    if (i >= last) setI(0)
    setPlaying((p) => !p)
  }, [i, last])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest("input, textarea, select, [contenteditable], [role=slider]") || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === " ") {
        e.preventDefault()
        toggle()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        go(i + 1)
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        go(i - 1)
      } else if (e.key === "Home") go(0)
      else if (e.key === "End") go(last)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go, toggle, i, last])

  if (!L.start) return <div className="rounded-xl border p-6 text-sm text-muted-foreground">The engine rejects this level's start.</div>

  const atEnd = i === last
  const banner =
    !atEnd || moves.length === 0 ? null
    : R.won ? { ok: true, text: `Won after ${R.wonAt} moves` }
    : R.failedAt >= 0 ? { ok: false, text: `Move ${R.failedAt + 1} (${KEY_NAME[moves[R.failedAt]] ?? moves[R.failedAt]}) ${failText ?? "was refused"}` }
    : { ok: false, text: "Every move played; the level is not won" }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative overflow-hidden rounded-xl bg-stage ring-1 ring-foreground/10">
        <div ref={host} />
        {banner && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-3">
            <div
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium shadow-lg backdrop-blur-md",
                banner.ok ? "bg-amber-400/90 text-amber-950" : "bg-rose-500/90 text-white",
              )}
            >
              {banner.ok ? "★ " : ""}
              {banner.text}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className="flex items-center gap-0.5">
          <IconButton label="Start" keys="Home" onClick={() => go(0)} disabled={i === 0}>
            <ChevronFirstIcon />
          </IconButton>
          <IconButton label="Back one move" keys="←" onClick={() => go(i - 1)} disabled={i === 0}>
            <StepBackIcon />
          </IconButton>
          <Button size="icon" className="mx-0.5 rounded-full" onClick={toggle} disabled={last === 0} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </Button>
          <IconButton label="Forward one move" keys="→" onClick={() => go(i + 1)} disabled={atEnd}>
            <StepForwardIcon />
          </IconButton>
          <IconButton label="End" keys="End" onClick={() => go(last)} disabled={atEnd}>
            <ChevronLastIcon />
          </IconButton>
        </div>
        <Slider className="min-w-32 flex-1" min={0} max={Math.max(1, last)} value={[i]} onValueChange={(v) => go(Array.isArray(v) ? v[0] : v)} disabled={last === 0} aria-label="Move" />
        <span className="w-20 text-right font-mono text-xs text-muted-foreground tabular-nums">
          {i} / {last}
        </span>
        <ToggleGroup value={[String(speed)]} onValueChange={(v) => v[0] && setSpeed(Number(v[0]))} variant="outline" size="sm" aria-label="Speed">
          {SPEEDS.map((s) => (
            <ToggleGroupItem key={s} value={String(s)} className="px-2 font-mono text-xs">
              {s}/s
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {moves.length > 0 && (
        <div ref={tape} className="relative max-h-28 overflow-y-auto rounded-lg border bg-muted/30 p-2">
          <div className="flex flex-wrap gap-1">
            {[...moves].map((k, j) => {
              const failed = j === R.failedAt
              const unplayed = j >= R.frames.length - 1 && !failed
              return (
                <button
                  key={j}
                  data-i={j}
                  title={`Move ${j + 1}: ${KEY_NAME[k] ?? k}`}
                  onClick={() => go(Math.min(j + 1, last))}
                  className={cn(
                    "flex h-6 min-w-6 items-center justify-center rounded px-1 font-mono text-xs transition-colors",
                    j < i ? "bg-primary/15 text-foreground" : "bg-background text-muted-foreground hover:text-foreground",
                    j === i - 1 && "bg-primary text-primary-foreground",
                    failed && "bg-loss text-white",
                    unplayed && "opacity-35",
                  )}
                >
                  {KEY[k] ?? k}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function IconButton({ label, keys, children, ...props }: { label: string; keys: string } & React.ComponentProps<typeof Button>) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label={label} {...props} />}>{children}</TooltipTrigger>
      <TooltipContent className="flex items-center gap-2">
        {label} <Kbd>{keys}</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
