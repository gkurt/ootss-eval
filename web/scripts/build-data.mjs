// Builds web/public/data from the kit and the committed runs:
//   index.json                                   runs (titles, settings, one summary row per
//                                                model and track, one record per run) and the
//                                                levels they use
//   runs/<id>/<model>/<track>/<level>.json       the run files, for the replay page
//   levels/<name>.json                           a level's metadata, start values and briefing
//   rules.md                                     the rule book the models get
//
//   node web/scripts/build-data.mjs              (npm run data, in web/)
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync, copyFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, "..", "..")
const KIT = join(ROOT, "kit")
const RUNS = join(ROOT, "runs")
const OUT = join(HERE, "..", "public", "data")

const json = (p) => JSON.parse(readFileSync(p, "utf8"))
const write = (p, v) => {
  mkdirSync(dirname(p), { recursive: true })
  writeFileSync(p, typeof v === "string" ? v : JSON.stringify(v))
}

rmSync(OUT, { recursive: true, force: true })
const manifest = json(join(KIT, "levels.json"))
const metaOf = new Map(manifest.levels.map((l) => [l.name, l]))
const used = new Set()

// One line per run file: what the overview, run and level pages show.
function record(rec) {
  const won = rec.result?.won ?? false
  const plays = rec.events.filter((e) => e.check)
  return {
    model: rec.model,
    track: rec.track,
    level: rec.level,
    tier: rec.tier,
    ref: rec.reference_length ?? null,
    won,
    wonAt: rec.result?.wonAt ?? null,
    failedAt: rec.result?.failedAt ?? null,
    how: rec.result?.how ?? null,
    line: rec.result?.line ?? "",
    answered: rec.answer != null,
    answers: rec.attempts.length,
    firstRight: rec.attempts[0]?.won ?? false,
    wrongAnswers: rec.attempts.filter((a) => !a.won).length,
    toolCalls: rec.tool_calls,
    jsRuns: rec.js_runs,
    testPlays: plays.length,
    failedPlays: plays.filter((e) => !e.check.won).length,
    output: rec.usage.output,
    thinking: rec.usage.thinking ?? 0,
    cost: rec.cost,
    seconds: rec.seconds,
    apiSeconds: rec.api_seconds ?? null,
    solveSeconds: rec.attempts.find((a) => a.won)?.t ?? null,
    via: rec.via,
  }
}

const runs = []
for (const about of json(join(RUNS, "index.json"))) {
  const dir = join(RUNS, about.id)
  if (!existsSync(dir)) throw new Error(`runs/index.json lists ${about.id}, which is missing`)
  const records = []
  for (const model of readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== "prompts"))
    for (const track of readdirSync(join(dir, model.name)))
      for (const f of readdirSync(join(dir, model.name, track)).filter((f) => f.endsWith(".json"))) {
        const rec = json(join(dir, model.name, track, f))
        write(join(OUT, "runs", about.id, model.name, track, f), rec)
        records.push(record(rec))
        used.add(rec.level)
      }
  const settings = json(join(dir, "settings.json"))
  runs.push({
    ...about,
    started: settings.started,
    settings: {
      via: settings.via,
      effort: settings.effort,
      attempts: settings.attempts,
      budget: settings.budget,
      sandbox: settings.sandbox,
      minutes: settings.minutes,
      models: settings.models,
      levels: settings.levels,
    },
    rows: json(join(dir, "summary.json")).rows,
    records,
  })
}

const levels = {}
for (const name of used) {
  const d = json(join(KIT, "data", `${name}.json`))
  const meta = metaOf.get(name) ?? d.meta
  levels[name] = meta
  write(join(OUT, "levels", `${name}.json`), {
    meta,
    values: d.values,
    briefing: readFileSync(join(KIT, "levels", `${name}.md`), "utf8"),
  })
}

copyFileSync(join(KIT, "RULES.md"), join(OUT, "rules.md"))
write(join(OUT, "index.json"), { generated: new Date().toISOString(), tiers: manifest.tiers ?? null, runs, levels })
console.log(`${runs.length} runs, ${runs.reduce((a, r) => a + r.records.length, 0)} run files, ${used.size} levels -> web/public/data`)
