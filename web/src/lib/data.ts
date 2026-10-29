// Data the site reads from public/data (built by scripts/build-data.mjs), cached per URL.
import { useEffect, useState } from "react"

export type Track = "reasoning" | "coding"

export type RunRecord = {
  model: string
  track: Track
  level: string
  tier: number
  ref: number | null
  won: boolean
  wonAt: number | null
  failedAt: number | null
  how: string | null
  line: string
  answered: boolean
  answers: number
  firstRight: boolean
  wrongAnswers: number
  toolCalls: number
  jsRuns: number
  testPlays: number
  failedPlays: number
  output: number
  thinking: number
  cost: number
  seconds: number
  apiSeconds: number | null
  solveSeconds: number | null
  via: string
}

export type Run = {
  id: string
  title: string
  set: string
  description: string
  started: string
  settings: {
    via: string
    effort: string
    attempts: number
    budget: number
    sandbox: boolean
    minutes: number
    models: string[]
    levels: string[]
  }
  records: RunRecord[]
}

export type LevelMeta = {
  name: string
  set: string
  heroes: string[]
  features: string[]
  width: number
  height: number
  entities: number
  doors: number
  shortest_known: number | null
  tier: number
}

export type Index = {
  generated: string
  tiers: Record<string, string> | null
  runs: Run[]
  levels: Record<string, LevelMeta>
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type LevelFile = { meta: LevelMeta; values: any; briefing: string }

export type RunEvent = {
  t: number
  type: "thinking" | "text" | "tool" | "answer" | "feedback" | "note"
  text?: string
  name?: string
  n?: number | null
  moves?: string
  code?: string
  output?: string
  error?: boolean
  done?: number
  check?: { won: boolean; failedAt: number | null; how: string | null }
  // answers: the checker's line
  line?: string
  won?: boolean
}

export type RunFile = {
  run: string
  model: string
  track: Track
  level: string
  tier: number
  reference_length: number | null
  via: string
  settings: Record<string, any>
  seconds: number
  api_seconds?: number
  answer: string | null
  result: { won: boolean; wonAt: number | null; failedAt: number | null; how: string | null; line: string }
  attempts: { moves: string | null; won: boolean; wonAt?: number | null; failedAt?: number | null; how?: string | null; line: string; t: number }[]
  tool_calls: number
  js_runs: number
  requests: number
  stop_reason: string | null
  usage: { input: number; output: number; cache_read: number; cache_write: number; thinking?: number }
  cost: number
  events: RunEvent[]
  cli?: { version?: string; model?: string }
}

const cache = new Map<string, Promise<any>>()
const BASE = `${import.meta.env.BASE_URL}data/`

export function fetchData<T>(path: string, as: "json" | "text" = "json"): Promise<T> {
  let p = cache.get(path)
  if (!p) {
    p = fetch(BASE + path).then((r) => {
      if (!r.ok) throw new Error(`${path}: ${r.status}`)
      return as === "json" ? r.json() : r.text()
    })
    cache.set(path, p)
  }
  return p
}

export const getIndex = () => fetchData<Index>("index.json")
export const getLevel = (name: string) => fetchData<LevelFile>(`levels/${encodeURIComponent(name)}.json`)
export const getRunFile = (id: string, model: string, track: string, level: string) =>
  fetchData<RunFile>(`runs/${id}/${model}/${track}/${encodeURIComponent(level)}.json`)
export const getRules = () => fetchData<string>("rules.md", "text")

// A promise as React state: { data, error } (both undefined while loading).
export function useData<T>(load: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<{ data?: T; error?: Error; key: string }>({ key: "" })
  const key = JSON.stringify(deps)
  useEffect(() => {
    let live = true
    load().then(
      (data) => live && setState({ data, key }),
      (error) => live && setState({ error, key }),
    )
    return () => {
      live = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return state.key === key ? state : { key }
}
