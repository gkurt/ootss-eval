// The rules engine (kit/engine/ootss.mjs) and thin helpers around it. Nothing here re-implements
// a rule: every step, win check and hero group comes from the engine.
import M from "@engine"

/* eslint-disable @typescript-eslint/no-explicit-any */
export type V = any

export { M }

export const list = (xs: V[]): V => xs.reduceRight((t, h) => ({ $: "Con", head: h, tail: t }), { $: "Nil" })
export const arr = (l: V): V[] => {
  const out: V[] = []
  for (; l && l.$ === "Con"; l = l.tail) out.push(l.head)
  return out
}

// Level JSON -> engine values; tile rows go through the engine's own parsers.
function value(v: V): V {
  if (v === null || typeof v !== "object") return v
  if (v.$rows === "tiles") return M.tiles_of(list(v.rows))
  if (v.$rows === "top") return M.top_of(list(v.rows))
  const out: V = {}
  for (const [k, x] of Object.entries(v)) out[k] = k === "$" ? x : value(x)
  return out
}

export type Level = { lv: V; init: V; start: V; rows: string[]; top: string[] }

export function loadLevel(values: V): Level {
  const lv = value(values.level)
  const init = value(values.init)
  const s = M.start(lv, init)
  return { lv, init, start: s.$ === "Some" ? s.value : null, rows: values.level.tiles.rows, top: values.level.top.rows }
}

export const step = (lv: V, st: V, k: string): V | null => {
  const r = M.act({ $: k }, lv, st)
  return r.$ === "Some" ? r.value : null
}
export const won = (lv: V, st: V): boolean => M.won(lv, st)

export type Frame = { st: V; k: string | null }
export type Replay = { frames: Frame[]; failedAt: number; won: boolean; wonAt: number }

// Replays an input string from the settled start: one frame per accepted input, stopping at the
// first refused input or at the win (moves after a win are ignored, as the checker does).
export function replay(L: Level, inputs: string): Replay {
  const frames: Frame[] = [{ st: L.start, k: null }]
  let st = L.start
  for (let i = 0; i < inputs.length; i++) {
    const n = step(L.lv, st, inputs[i])
    if (!n) return { frames, failedAt: i, won: false, wonAt: -1 }
    st = n
    frames.push({ st, k: inputs[i] })
    if (won(L.lv, st)) return { frames, failedAt: -1, won: true, wonAt: i + 1 }
  }
  return { frames, failedAt: -1, won: false, wonAt: -1 }
}

// A magic mirror's mirage: the entity it reflects, where ACTIVATE would send it, and whether
// that move is valid; null when it sees nothing.
export const mirageOf = (m: V, lv: V, st: V): V | null => {
  const r = M.mirror_mirage(m, lv, st)
  return r.$ === "Some" ? r.value : null
}
export const groups = (st: V): V[] => arr(M.leaders(st.ents)).map((l) => M.leader_group(l))
export const gateClosed = (lv: V, st: V, at: V): boolean => M.closed_gate(lv, st.gates, { $: "Nil" }, at)
