#!/usr/bin/env node
// Runs Claude models on OOTSS levels and scores every answer with the rules engine (ootss.mjs).
//
//   node run.mjs --models claude-sonnet-5-5 --track both --set starter
//   node run.mjs --summary --id <run>          rebuild runs/<run>/summary.md from the run files
//
// Two tracks, the same briefing (levels/<name>.md) and rule book (RULES.md):
//   reasoning  no tools. The model answers with a move string; a wrong answer gets the check line
//              back ("FAILED at move 5 (R): refused: ...") and another try, up to --attempts.
//   coding     tools on the rules (show, play, try, check: --budget calls in all) and run_js, a
//              JavaScript scratchpad that cannot reach the rules (tools.mjs). One final answer.
// Either way the final answer is scored by ootss.mjs: won, or how it failed.
//
// Two ways to reach a model:
//   --via cli  (default) Claude Code in print mode (`claude -p`), with its own login. Each run is
//              a fresh `claude` process in an empty temporary folder, with our system prompt in
//              place of Claude Code's, no built-in tools, no settings, and only our tools (an MCP
//              server, tools-server.mjs) in the coding track.
//   --via api  the Messages API through the Anthropic SDK (ANTHROPIC_API_KEY).
//
// Options:
//   --models a,b         model ids; "oracle" answers with the reference solution and
//                        "oracle-flaky" gets it right on the second try (no model: for testing)
//   --track reasoning|coding|both                               (default both)
//   --set starter|all_solved|frontier, or --levels a,b         (default starter)
//   --attempts 3         reasoning: answers allowed
//   --budget 40          coding: rule-tool calls allowed
//   --no-sandbox         coding: no run_js
//   --effort high        reasoning effort (low, medium, high, xhigh, max)
//   --minutes 30         time limit per run
//   --jobs 3             runs in parallel
//   --claude <path>      the Claude Code executable for --via cli (default: claude on the PATH)
//   --id <name>          folder under runs/ (default: date-time). An existing folder resumes:
//                        finished runs are skipped
//   --dry-run            write each prompt to runs/<id>/prompts/ and stop
//
// Writes runs/<id>/<model>/<track>/<level>.json per run (answer, score, timed transcript events,
// tokens, time) and runs/<id>/summary.json, summary.md.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, appendFileSync, mkdtempSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { MANIFEST, load, run, parseMoves } from "./ootss.mjs";
import { toolDefs, toolBox, RULE_TOOLS } from "./tools.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

// Options ----------------------------------------------------------------------------------------
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d; };
const flag = (k) => argv.includes(`--${k}`);
const O = {
  via: opt("via", "cli"),
  models: opt("models", "claude-sonnet-5-5").split(",").map((s) => s.trim()).filter(Boolean),
  tracks: { both: ["reasoning", "coding"], reasoning: ["reasoning"], coding: ["coding"] }[opt("track", "both")],
  levels: opt("levels") ? opt("levels").split(",") : MANIFEST.sets[opt("set", "starter")],
  attempts: +opt("attempts", 3),
  budget: +opt("budget", 40),
  sandbox: !flag("no-sandbox"),
  effort: opt("effort", "high"),
  minutes: +opt("minutes", 30),
  jobs: +opt("jobs", 3),
  claude: opt("claude", "claude"),
  id: opt("id", new Date().toISOString().slice(0, 16).replace(/[-:]/g, "").replace("T", "-")),
  dry: flag("dry-run"),
};
if (!O.tracks) throw new Error("--track is reasoning, coding or both");
if (!O.levels) throw new Error(`no level set "${opt("set")}" (sets: ${Object.keys(MANIFEST.sets).join(", ")})`);
if (!["cli", "api"].includes(O.via)) throw new Error("--via is cli or api");
const OUT = join(HERE, "..", "runs", O.id);

// Prices in $ per million tokens (input, output), for the API's cost estimate. Cache writes cost
// 1.25x input and cache reads 0.1x. (Claude Code reports its own estimate.)
const PRICE = {
  "claude-fable-5-1": [10, 50], "claude-opus-5-5": [4, 20], "claude-opus-5": [5, 25],
  "claude-sonnet-5-5": [2, 10], "claude-sonnet-5": [2, 10], "claude-haiku-5-5": [0.1, 0.5],
};
const cost = (model, u) => {
  const [i, o] = PRICE[model] || [0, 0];
  return (u.input * i + u.cache_write * i * 1.25 + u.cache_read * i * 0.1 + u.output * o) / 1e6;
};

// Prompts ----------------------------------------------------------------------------------------
// The rule book comes first and is the same for every level and track, so it is cached; the
// track's instructions follow, and the level briefing is the first user message.
const RULES = readFileSync(join(HERE, "RULES.md"), "utf8");
const ANSWER = "When you are done, end your reply with the complete move sequence from the start of the level, inside <moves></moves>, for example <moves>RRUL C DDX</moves>. Spaces are ignored. Only the last <moves> block counts; moves after the level is won are ignored.";
const INSTRUCTIONS = {
  reasoning: () => [
    "You are solving a level of the puzzle game Order of the Sinking Star. The rule book above is exact: a checker that runs these rules will score your answer.",
    "Work the level out by reasoning. You have no tools.",
    ANSWER,
    O.attempts > 1 ? `If the answer does not win, you are told the first move that failed and why (or that every move was valid but the level was not won), and you may answer again. You have ${O.attempts} answers in all.` : "You have one answer.",
  ].join("\n\n"),
  coding: () => [
    "You are solving a level of the puzzle game Order of the Sinking Star. The rule book above is exact: a checker that runs these rules will score your answer.",
    `You have tools that run the rules on this level: show (the board after some moves), play (what each move did), try (what each possible next move would do) and check (whether a move sequence wins). Every call to one of them costs 1 from a budget of ${O.budget} calls.`,
    O.sandbox ? "You also have run_js, a JavaScript scratchpad to compute with: parse the map, measure distances, keep notes, test an idea. It does not have the rules and costs nothing from the budget. Do not write a program that searches over game states or move sequences: use code to understand the level, not to brute-force it." : null,
    ANSWER,
    "You have one final answer. Check it with the tools first if your budget allows.",
  ].filter(Boolean).join("\n\n"),
};
const briefing = (name) => readFileSync(join(HERE, "levels", `${name}.md`), "utf8").trim();
const systemText = (track) => `${RULES.trim()}\n\n---\n\n${INSTRUCTIONS[track]()}`;

const lastMoves = (text) => {
  const all = [...text.matchAll(/<moves>([\s\S]*?)<\/moves>/gi)];
  return all.length ? all[all.length - 1][1] : null;
};
const checkLine = (L, moves) => {
  const R = run(L, moves);
  const line = R.won ? `WON after ${R.wonAt} moves`
    : R.failed >= 0 ? `FAILED at move ${R.failed + 1} (${moves[R.failed]}): ${R.steps[R.failed].result}: ${R.steps[R.failed].why}`
      : `NOT WON after ${moves.length} moves`;
  return { won: R.won, wonAt: R.wonAt ?? null, failedAt: R.failed >= 0 ? R.failed + 1 : null, how: R.failed >= 0 ? R.steps[R.failed].result : null, line };
};

// The transcript ---------------------------------------------------------------------------------
// Events the viewer shows, each stamped with t, seconds since the run started: thinking, text,
// tool calls (with moves or code, and the output), answers with their check line, feedback, notes.
const event = (rec, e) => { rec.events.push({ t: Math.round((Date.now() - rec._t0) / 100) / 10, ...e }); return rec.events.at(-1); };
function logBlock(rec, b) {
  if (b.type === "thinking" && b.thinking) event(rec, { type: "thinking", text: b.thinking });
  else if (b.type === "text" && b.text.trim()) event(rec, { type: "text", text: b.text });
  else if (b.type === "tool_use") {
    const name = b.name.replace(/^mcp__ootss__/, "");
    if (RULE_TOOLS[name]) rec.tool_calls++;
    else if (name === "run_js") rec.js_runs++;
    event(rec, { type: "tool", id: b.id, name, n: RULE_TOOLS[name] ? rec.tool_calls : null, moves: typeof b.input?.moves === "string" ? b.input.moves : undefined, code: b.input?.code });
  }
}
function logResult(rec, id, text, isError) {
  const ev = rec.events.findLast((e) => e.type === "tool" && e.id === id);
  if (!ev) return;
  ev.output = text;
  if (isError) ev.error = true;
  ev.done = Math.round((Date.now() - rec._t0) / 100) / 10;
  if (ev.moves != null) try { ev.moves = parseMoves(ev.moves); } catch { /* shown as typed */ }
}

// Marks each play and check call with what the checker says of its moves, so the summary can
// count the test plays that did not win.
function scoreTests(rec, L) {
  let changed = false;
  for (const e of rec.events)
    if (e.type === "tool" && (e.name === "play" || e.name === "check") && typeof e.moves === "string" && !e.check) {
      try { const { won, failedAt, how } = checkLine(L, parseMoves(e.moves)); e.check = { won, failedAt, how }; changed = true; } catch { /* not moves */ }
    }
  return changed;
}

// One answer: parse the last <moves> block, score it, record it. Returns the feedback line.
function takeAnswer(rec, L, text, stop) {
  const raw = lastMoves(text);
  let a;
  try {
    if (raw == null) throw new Error(stop === "max_tokens" ? "Your reply was cut off before a <moves> block." : "No <moves> block found in your reply.");
    const moves = parseMoves(raw);
    a = { moves, ...checkLine(L, moves) };
    rec.answer = moves;
  } catch (e) {
    a = { moves: null, won: false, line: String(e.message) };
  }
  const ev = event(rec, { type: "answer", moves: a.moves, line: a.line, won: a.won });
  rec.attempts.push({ ...a, t: ev.t });
  return a;
}

// Sessions: turn(user text) -> {text, stop}, the model's reply after any tool calls --------------
let client = null;
async function anthropic() {
  if (!client) {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    client = new Anthropic({ maxRetries: 6 });
  }
  return client;
}

// A stand-in model for testing the runner and the viewer: it answers with the reference solution
// ("oracle-flaky": a wrong answer first). In the coding track it calls check first.
function oracle(model, params, job) {
  const ref = job.reference;
  const turns = params.messages.filter((m) => m.role === "assistant").length;
  const usage = { input_tokens: 0, output_tokens: 0, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 };
  const msg = (content, stop_reason) => ({ content, stop_reason, usage });
  const wrong = model === "oracle-flaky" && turns === 0 ? ref.slice(0, -2) + (ref.at(-1) === "U" ? "D" : "U") : null;
  if (params.tools && turns === 0)
    return msg([{ type: "thinking", thinking: "I know this one; let me check it.", signature: "" }, { type: "tool_use", id: "toolu_oracle0", name: "check", input: { moves: wrong || ref } }], "tool_use");
  if (params.tools && turns === 1 && model === "oracle-flaky")
    return msg([{ type: "tool_use", id: "toolu_oracle1", name: "run_js", input: { code: `console.log(${JSON.stringify(ref)}.length)` } }, { type: "tool_use", id: "toolu_oracle2", name: "play", input: { moves: ref } }], "tool_use");
  return msg([{ type: "thinking", thinking: "The reference solution.", signature: "" }, { type: "text", text: `Here is my answer.\n<moves>${wrong || ref}</moves>` }], "end_turn");
}

function apiSession(job, rec, L, track) {
  const messages = [];
  const box = track === "coding" ? toolBox(L, O.budget, O.sandbox) : null;
  const tools = box && toolDefs(O.budget, O.sandbox).map((d) => ({ name: d.name, description: d.description, input_schema: d.schema, strict: true, eager_input_streaming: true }));
  const system = [{ type: "text", text: RULES.trim(), cache_control: { type: "ephemeral" } }, { type: "text", text: INSTRUCTIONS[track]() }];
  const ask = async (params) => {
    if (job.model.startsWith("oracle")) return oracle(job.model, params, job);
    const stream = (await anthropic()).messages.stream({
      model: job.model, max_tokens: 64000,
      thinking: { type: "adaptive", display: "summarized" },
      output_config: { effort: O.effort },
      cache_control: { type: "ephemeral" },
      ...params,
    });
    return stream.finalMessage();
  };
  return {
    async turn(userText) {
      messages.push({ role: "user", content: userText });
      let text = "";
      for (;;) {
        const t1 = Date.now();
        const m = await ask({ system, messages, ...(tools ? { tools } : {}) });
        rec.api_seconds += (Date.now() - t1) / 1000;
        rec.requests++;
        for (const [k, f] of [["input", "input_tokens"], ["output", "output_tokens"], ["cache_read", "cache_read_input_tokens"], ["cache_write", "cache_creation_input_tokens"]]) rec.usage[k] += m.usage[f] || 0;
        rec.cost = Math.round(cost(job.model, rec.usage) * 10000) / 10000;
        rec.stop_reason = m.stop_reason;
        m.content.forEach((b) => logBlock(rec, b));
        messages.push({ role: "assistant", content: m.content });
        text += m.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
        const calls = m.content.filter((b) => b.type === "tool_use");
        if (m.stop_reason === "refusal" || !calls.length || m.stop_reason === "max_tokens") return { text, stop: m.stop_reason };
        const results = [];
        for (const b of calls) {
          const r = await box.call(b.name, b.input);
          logResult(rec, b.id, r.text, r.isError);
          results.push({ type: "tool_result", tool_use_id: b.id, content: r.text, ...(r.isError ? { is_error: true } : {}) });
        }
        messages.push({ role: "user", content: results });
        if (rec.tool_calls > O.budget + 5) return { text, stop: "budget" };
        if (Date.now() - rec._t0 > O.minutes * 60000) return { text, stop: "time" };
      }
    },
    close() {},
  };
}

// Claude Code in print mode, fed user messages as stream-json. The process keeps the conversation,
// so the reasoning track's feedback goes to the same session.
function cliSession(job, rec, L, track) {
  const dir = mkdtempSync(join(tmpdir(), "ootss-eval-"));
  writeFileSync(join(dir, "system.md"), systemText(track));
  const args = ["-p", "--model", job.model, "--effort", O.effort, "--input-format", "stream-json", "--output-format", "stream-json", "--verbose",
    "--system-prompt-file", join(dir, "system.md"), "--setting-sources", "", "--tools", "", "--strict-mcp-config", "--no-session-persistence",
    "--permission-mode", "dontAsk"];
  if (track === "coding") {
    const server = [join(HERE, "tools-server.mjs"), job.level, String(O.budget), ...(O.sandbox ? [] : ["--no-sandbox"])];
    writeFileSync(join(dir, "mcp.json"), JSON.stringify({ mcpServers: { ootss: { command: process.execPath, args: server } } }));
    args.push("--mcp-config", join(dir, "mcp.json"), "--allowedTools", toolDefs(O.budget, O.sandbox).map((d) => `mcp__ootss__${d.name}`).join(","));
  }
  // The child must not think it runs inside this Claude Code session (or any other).
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^CLAUDE/.test(k)));
  const p = spawn(O.claude, args, { cwd: dir, env, stdio: ["pipe", "pipe", "pipe"] });
  let pending = null, text = "", stderr = "", stopped = null, closed = false;
  const finish = (r) => { const f = pending; pending = null; f?.resolve(r); };
  const fail = (e) => { const f = pending; pending = null; f?.reject(e); };
  const kill = (why) => { stopped = why; p.kill(); };
  const timer = setTimeout(() => kill("time"), O.minutes * 60000 - (Date.now() - rec._t0));
  p.stderr.on("data", (d) => { if (stderr.length < 4000) stderr += d; });
  p.stdin.on("error", () => {});
  createInterface({ input: p.stdout }).on("line", (line) => {
    let j;
    try { j = JSON.parse(line); } catch { return; }
    if (j.type === "system" && j.subtype === "init") rec.cli = { version: j.claude_code_version, model: j.model, tools: j.tools, mcp: (j.mcp_servers || []).map((s) => `${s.name}:${s.status}`) };
    else if (j.type === "assistant") {
      for (const b of j.message?.content || []) {
        logBlock(rec, b);
        if (b.type === "text") text += b.text + "\n";
      }
      if (rec.tool_calls > O.budget + 5) kill("budget");
    } else if (j.type === "user" && Array.isArray(j.message?.content)) {
      for (const b of j.message.content) if (b.type === "tool_result")
        logResult(rec, b.tool_use_id, typeof b.content === "string" ? b.content : (b.content || []).map((c) => c.text || "").join("\n"), b.is_error);
    } else if (j.type === "result") {
      // Totals so far in this session.
      const mu = Object.values(j.modelUsage || {});
      const sum = (f) => mu.reduce((a, u) => a + (u[f] || 0), 0);
      rec.usage = { input: sum("inputTokens"), output: sum("outputTokens"), cache_read: sum("cacheReadInputTokens"), cache_write: sum("cacheCreationInputTokens"), thinking: sum("thinkingTokens") };
      rec.cost = Math.round((j.total_cost_usd || 0) * 10000) / 10000;
      rec.api_seconds = (j.duration_api_ms || 0) / 1000;
      rec.requests = j.num_turns ?? rec.requests;
      rec.stop_reason = j.stop_reason || j.subtype;
      rec.cli_results = [...(rec.cli_results || []), { subtype: j.subtype, is_error: j.is_error, ms: j.duration_ms, api_ms: j.duration_api_ms, turns: j.num_turns, cost: j.total_cost_usd }];
      if (!j.duration_api_ms && !rec.usage.output) fail(new Error(`claude: ${(j.result || j.subtype || "no reply").toString().slice(0, 300)}`));
      else { const r = { text, stop: j.is_error ? j.subtype : "end_turn" }; text = ""; finish(r); }
    }
  });
  const exited = new Promise((res) => p.on("close", (code) => {
    closed = true;
    clearTimeout(timer);
    if (pending) {
      if (stopped || rec.events.length) finish({ text, stop: stopped || `exit ${code}` });
      else fail(new Error(`claude exited (${code}): ${stderr.trim().slice(0, 300) || "no output"}`));
    }
    res();
  }));
  p.on("error", (e) => fail(new Error(`cannot start ${O.claude}: ${e.message}`)));
  return {
    turn(userText) {
      if (closed) return Promise.resolve({ text: "", stop: stopped || "exit" });
      return new Promise((resolve, reject) => {
        pending = { resolve, reject };
        p.stdin.write(JSON.stringify({ type: "user", message: { role: "user", content: [{ type: "text", text: userText }] } }) + "\n");
      });
    },
    async close() {
      p.stdin.end();
      const t = setTimeout(() => p.kill(), 10000);
      await exited;
      clearTimeout(t);
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

// Runs -------------------------------------------------------------------------------------------
const STOPPED = { refusal: "The model declined (stop_reason: refusal).", budget: "Stopped: kept calling tools after the budget ran out.", time: `Stopped: the ${O.minutes}-minute limit.` };

async function runJob(job) {
  const file = join(OUT, job.model, job.track, `${job.level}.json`);
  if (existsSync(file)) return { rec: JSON.parse(readFileSync(file, "utf8")), skipped: true };
  const L = load(job.level);
  const meta = MANIFEST.levels.find((l) => l.name === job.level);
  const via = job.model.startsWith("oracle") ? "oracle" : O.via;
  const rec = {
    run: O.id, model: job.model, track: job.track, level: job.level, tier: meta.tier, reference_length: meta.shortest_known, via,
    settings: { effort: O.effort, attempts: job.track === "reasoning" ? O.attempts : 1, budget: job.track === "coding" ? O.budget : null, sandbox: job.track === "coding" ? O.sandbox : null, minutes: O.minutes },
    started: new Date().toISOString(), seconds: null, api_seconds: 0,
    answer: null, result: null, attempts: [], tool_calls: 0, js_runs: 0, requests: 0, stop_reason: null,
    usage: { input: 0, output: 0, cache_read: 0, cache_write: 0 }, cost: 0, events: [], _t0: Date.now(),
  };
  const s = (via === "cli" ? cliSession : apiSession)(job, rec, L, job.track);
  try {
    let msg = briefing(job.level);
    for (let a = 1; a <= rec.settings.attempts; a++) {
      const r = await s.turn(msg);
      const ended = STOPPED[r.stop] || /^exit/.test(r.stop || "");
      if (ended) { event(rec, { type: "note", text: STOPPED[r.stop] || `Claude Code stopped (${r.stop}).` }); if (!lastMoves(r.text)) break; }
      const ans = takeAnswer(rec, L, r.text, r.stop);
      if (ans.won || a === rec.settings.attempts || ended) break;
      const left = rec.settings.attempts - a;
      msg = `Checker: ${ans.line}\nYou have ${left} answer${left > 1 ? "s" : ""} left.`;
      event(rec, { type: "feedback", text: msg });
    }
  } finally {
    await s.close();
  }
  rec.seconds = Math.round((Date.now() - rec._t0) / 100) / 10;
  rec.api_seconds = Math.round(rec.api_seconds * 10) / 10;
  delete rec._t0;
  rec.result = rec.answer != null ? checkLine(L, rec.answer) : { won: false, line: rec.attempts.at(-1)?.line || rec.events.findLast((e) => e.type === "note")?.text || "no answer" };
  scoreTests(rec, L);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(rec, null, 1));
  return { rec };
}

// Summary ----------------------------------------------------------------------------------------
function readRuns(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const model of readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== "prompts"))
    for (const track of readdirSync(join(dir, model.name)))
      for (const f of readdirSync(join(dir, model.name, track)).filter((f) => f.endsWith(".json"))) {
        const path = join(dir, model.name, track, f), rec = JSON.parse(readFileSync(path, "utf8"));
        if (scoreTests(rec, load(rec.level))) writeFileSync(path, JSON.stringify(rec, null, 1));
        out.push(rec);
      }
  return out;
}
const dur = (s) => (s == null ? "—" : s < 60 ? `${Math.round(s)}s` : s < 3600 ? `${Math.floor(s / 60)}m${String(Math.round(s % 60)).padStart(2, "0")}s` : `${(s / 3600).toFixed(1)}h`);

function summarize(dir) {
  const recs = readRuns(dir);
  const tiers = [...new Set(recs.map((r) => r.tier))].sort();
  const rows = [];
  for (const model of [...new Set(recs.map((r) => r.model))])
    for (const track of ["reasoning", "coding"]) {
      const rs = recs.filter((r) => r.model === model && r.track === track);
      if (!rs.length) continue;
      const won = rs.filter((r) => r.result.won);
      const sum = (f, xs = rs) => xs.reduce((a, r) => a + f(r), 0);
      const solveTime = (r) => r.attempts.find((a) => a.won)?.t ?? r.seconds;
      const plays = (r) => r.events.filter((e) => e.check);
      rows.push({
        model, track, runs: rs.length, solved: won.length,
        tiers: Object.fromEntries(tiers.map((t) => [t, [rs.filter((r) => r.tier === t && r.result.won).length, rs.filter((r) => r.tier === t).length]])),
        moves_vs_reference: won.some((r) => r.reference_length) ? Math.round(100 * sum((r) => r.result.wonAt / r.reference_length, won.filter((r) => r.reference_length)) / won.filter((r) => r.reference_length).length) / 100 : null,
        attempts: Math.round(100 * sum((r) => r.attempts.length) / rs.length) / 100,
        wrong_answers: sum((r) => r.attempts.filter((a) => !a.won).length),
        first_right: rs.filter((r) => r.attempts[0]?.won).length,
        test_plays: track === "coding" ? sum((r) => plays(r).length) : null,
        failed_plays: track === "coding" ? sum((r) => plays(r).filter((e) => !e.check.won).length) : null,
        tool_calls: Math.round(10 * sum((r) => r.tool_calls) / rs.length) / 10,
        output_tokens: sum((r) => r.usage.output), input_tokens: sum((r) => r.usage.input + r.usage.cache_read + r.usage.cache_write),
        cost: Math.round(sum((r) => r.cost) * 100) / 100,
        seconds: Math.round(sum((r) => r.seconds)), seconds_per_run: Math.round(sum((r) => r.seconds) / rs.length),
        seconds_to_solve: won.length ? Math.round(sum(solveTime, won) / won.length) : null,
      });
    }
  const levels = [...new Set(recs.map((r) => r.level))].sort((a, b) => recs.find((r) => r.level === a).tier - recs.find((r) => r.level === b).tier);
  const cols = rows.map((r) => [r.model, r.track]);
  const cell = (lv, [model, track]) => {
    const r = recs.find((x) => x.level === lv && x.model === model && x.track === track);
    if (!r) return "";
    const t = ` · ${dur(r.seconds)}`;
    if (r.result.won) return `✓ ${r.result.wonAt}${r.track === "reasoning" && r.attempts.length > 1 ? ` (answer ${r.attempts.length})` : ""}${t}`;
    return (r.result.failedAt ? `✗ ${r.result.how} @${r.result.failedAt}` : r.answer != null ? "✗ not won" : "✗ no answer") + t;
  };
  const md = [
    `# Eval run ${dir.split(/[\\/]/).pop()}`, "",
    "| Model | Track | Solved | " + tiers.map((t) => `Tier ${t}`).join(" | ") + " | Moves / ref | Answers | Right first time | Wrong answers | Test plays (failed) | Tool calls | Time / run | Time to solve | Output tok | Input tok | Est. $ |",
    "|---|---|---|" + tiers.map(() => "---|").join("") + "---|---|---|---|---|---|---|---|---|---|---|",
    ...rows.map((r) => `| ${r.model} | ${r.track} | ${r.solved}/${r.runs} | ${tiers.map((t) => `${r.tiers[t][0]}/${r.tiers[t][1]}`).join(" | ")} | ${r.moves_vs_reference ?? "—"} | ${r.attempts} | ${r.first_right}/${r.runs} | ${r.wrong_answers} | ${r.test_plays == null ? "—" : `${r.test_plays} (${r.failed_plays})`} | ${r.tool_calls} | ${dur(r.seconds_per_run)} | ${dur(r.seconds_to_solve)} | ${r.output_tokens.toLocaleString("en-US")} | ${r.input_tokens.toLocaleString("en-US")} | ${r.cost} |`),
    "", "Per level (✓ k = won after k moves; ✗ refused/lost @k = move k failed; then the run's time):", "",
    "| Level | Tier | Ref | " + cols.map(([m, t]) => `${m} ${t}`).join(" | ") + " |",
    "|---|---|---|" + cols.map(() => "---|").join(""),
    ...levels.map((lv) => { const r0 = recs.find((r) => r.level === lv); return `| ${lv} | ${r0.tier} | ${r0.reference_length ?? "none known"} | ${cols.map((c) => cell(lv, c)).join(" | ")} |`; }),
    "", "Moves / ref: winning moves over the reference solution's length (below 1 is shorter). Answers: answers given per run. Right first time: runs whose first answer won. Wrong answers: answers that did not win, over all runs (the coding track gives one). Test plays: play and check calls in the coding track, and in brackets how many of them did not win. Time to solve: from the start of a run to its winning answer, over the solved runs. Est. $: from list prices (Claude Code's estimate for --via cli).",
  ].join("\n");
  writeFileSync(join(dir, "summary.json"), JSON.stringify({ run: dir.split(/[\\/]/).pop(), rows }, null, 1));
  writeFileSync(join(dir, "summary.md"), md + "\n");
  return md;
}

// Main -------------------------------------------------------------------------------------------
if (flag("summary")) {
  console.log(summarize(OUT));
  process.exit(0);
}
const unknown = O.levels.filter((n) => !MANIFEST.levels.some((l) => l.name === n));
if (unknown.length) throw new Error(`unknown levels: ${unknown.join(", ")}`);
const jobs = [];
for (const model of O.models)
  for (const track of O.tracks)
    for (const level of O.levels) {
      const reference = JSON.parse(readFileSync(join(HERE, "data", `${level}.json`), "utf8")).reference_solution;
      if (model.startsWith("oracle") && !reference) continue;
      jobs.push({ model, track, level, reference });
    }
mkdirSync(OUT, { recursive: true });
if (O.dry) {
  for (const track of O.tracks)
    for (const level of O.levels) {
      const p = join(OUT, "prompts", track, `${level}.md`);
      mkdirSync(dirname(p), { recursive: true });
      writeFileSync(p, [systemText(track), "---- user ----", briefing(level), track === "coding" ? `---- tools ----\n${JSON.stringify(toolDefs(O.budget, O.sandbox), null, 1)}` : ""].join("\n\n"));
    }
  console.log(`prompts for ${O.levels.length} levels x ${O.tracks.length} tracks -> ${join(OUT, "prompts")}`);
  process.exit(0);
}
writeFileSync(join(OUT, "settings.json"), JSON.stringify({ ...O, started: new Date().toISOString() }, null, 1));
console.log(`${jobs.length} runs via ${O.via} -> runs/${O.id}`);
let next = 0, done = 0, halt = null;
const t0 = Date.now();
await Promise.all(Array.from({ length: Math.min(O.jobs, jobs.length) }, async () => {
  while (next < jobs.length && !halt) {
    const job = jobs[next++];
    try {
      const { rec: r, skipped } = await runJob(job);
      done++;
      console.log(`[${done}/${jobs.length}] ${job.model} ${job.track} ${job.level}: ${skipped ? "(done before) " : ""}${r.result.won ? "WON" : "no"} · ${r.result.line} · ${dur(r.seconds)} · ${r.usage.output} out tok · $${r.cost}`);
    } catch (e) {
      // Not written to a run file, so the next run with this --id retries it.
      appendFileSync(join(OUT, "errors.log"), `${new Date().toISOString()} ${job.model} ${job.track} ${job.level}: ${e.stack || e}\n`);
      console.error(`ERROR ${job.model} ${job.track} ${job.level}: ${e.message || e}`);
      if (/authenticat|log ?in|usage limit|rate.?limit|credit|cannot start/i.test(String(e.message))) halt = e.message;
    }
  }
}));
if (halt) console.error(`\nStopped early: ${halt}\nFix it and run again with --id ${O.id} to go on.`);
console.log(`\n${summarize(OUT)}\n\n${dur((Date.now() - t0) / 1000)}`);
