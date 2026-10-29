import type { Run, RunRecord, Track } from "./data"

export const fmt = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString("en-US"))

export const dur = (s: number | null | undefined) =>
  s == null ? "—"
  : s < 60 ? `${Math.round(s)}s`
  : s < 3600 ? `${Math.floor(s / 60)}m ${String(Math.round(s % 60)).padStart(2, "0")}s`
  : `${Math.floor(s / 3600)}h ${String(Math.round((s % 3600) / 60)).padStart(2, "0")}m`

export const usd = (n: number) => `$${n < 10 ? n.toFixed(2) : n.toFixed(0)}`

// Models, in the order the site lists them, with a name and a colour each.
export const MODELS: Record<string, { name: string; short: string; color: string }> = {
  "claude-opus-5-5": { name: "Claude Opus 5.5", short: "Opus 5.5", color: "var(--model-opus)" },
  "claude-sonnet-5-5": { name: "Claude Sonnet 5.5", short: "Sonnet 5.5", color: "var(--model-sonnet)" },
  "claude-haiku-5-5": { name: "Claude Haiku 5.5", short: "Haiku 5.5", color: "var(--model-haiku)" },
}
export const modelName = (m: string) => MODELS[m]?.short ?? m.replace(/^claude-/, "")
export const modelColor = (m: string) => MODELS[m]?.color ?? "var(--muted-foreground)"
const modelRank = (m: string) => {
  const i = Object.keys(MODELS).indexOf(m)
  return i < 0 ? 99 : i
}
export const byModel = (a: string, b: string) => modelRank(a) - modelRank(b) || a.localeCompare(b)

export const TRACKS: Track[] = ["reasoning", "coding"]
export const TRACK: Record<Track, { name: string; blurb: string }> = {
  reasoning: { name: "Reasoning", blurb: "no tools; up to 3 answers, each scored with feedback" },
  coding: { name: "Tools", blurb: "rule tools on a 40-call budget and a JS scratchpad; one answer" },
}

export const SET_NAME: Record<string, string> = { starter: "Starter set", frontier: "Open levels" }

// The columns of a run: every model and track it has, models in site order.
export function runColumns(run: Run) {
  const models = [...new Set(run.records.map((r) => r.model))].sort(byModel)
  return models.flatMap((model) => TRACKS.filter((track) => run.records.some((r) => r.model === model && r.track === track)).map((track) => ({ model, track })))
}

// A run's outcome in a few words.
export function verdict(r: Pick<RunRecord, "won" | "wonAt" | "failedAt" | "how" | "answered" | "line">) {
  if (r.won) return { ok: true, short: `${r.wonAt} moves`, long: r.line }
  if (r.failedAt) return { ok: false, short: `${r.how} at move ${r.failedAt}`, long: r.line }
  if (/limit/i.test(r.line)) return { ok: false, short: "out of time", long: r.line }
  return { ok: false, short: r.answered ? "not won" : "no answer", long: r.line }
}

// Level names are the game's own identifiers (mirror_21, heroes2_22_v2); shown as they are.
export const levelTitle = (name: string) => name

export const runHref = (id: string, r: { model: string; track: string; level: string }) =>
  `/runs/${encodeURIComponent(id)}/${encodeURIComponent(r.model)}/${r.track}/${encodeURIComponent(r.level)}`
