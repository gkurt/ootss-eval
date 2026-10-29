// The coding track's tools, shared by both ways of running a model (run.mjs --via api, and the MCP
// server tools-server.mjs for --via cli), so a model gets the same tools either way:
//
//   show, play, try, check   the rules on the level (ootss.mjs), a budget of calls in all
//   run_js                   JavaScript in Node's permission mode: no file system, no processes, no
//                            network, 10 s. A scratchpad that cannot reach the rules
import { spawn } from "node:child_process";
import { parseMoves, command } from "./ootss.mjs";

export const RULE_TOOLS = {
  show: "The board, the lists of heroes, objects, gates and plates, and the status (won or not), after playing the moves from the start. If a move fails, shows the board before it and why it failed.",
  play: "Plays the moves from the start and reports what each one changed (who moved where, gates opening), one line per move, stopping at the first move that fails (refused: nothing could move; lost: a hero would die).",
  try: "From the state after the moves, what each possible next move (U D L R C, and X in mirror levels) would do. Use an empty string for the start.",
  check: "One line: WON after k moves, NOT WON after k moves, or FAILED at move k and why.",
};
const MOVES = {
  type: "object", additionalProperties: false, required: ["moves"],
  properties: { moves: { type: "string", description: "Moves from the start of the level: letters U D L R C X; spaces are ignored." } },
};
const CODE = {
  type: "object", additionalProperties: false, required: ["code"],
  properties: { code: { type: "string", description: "The program; print results with console.log." } },
};
const RUN_JS = "Runs JavaScript (Node.js, CommonJS) and returns what it prints. A scratchpad for computing: no file system, no processes, no network, 10 seconds, and no access to the game rules. Does not cost rule-tool calls.";

// Tool definitions as {name, description, schema}; each API shapes them its own way.
export function toolDefs(budget, sandbox) {
  const defs = Object.entries(RULE_TOOLS).map(([name, d]) => ({ name, description: `${d} Costs 1 of your ${budget} rule-tool calls.`, schema: MOVES }));
  if (sandbox) defs.push({ name: "run_js", description: RUN_JS, schema: CODE });
  return defs;
}

export function runJs(code) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, ["--permission", "--max-old-space-size=512", "-"], { stdio: ["pipe", "pipe", "pipe"] });
    let out = "", err = "", killed = false;
    p.stdout.on("data", (d) => { if (out.length < 20000) out += d; });
    p.stderr.on("data", (d) => { if (err.length < 5000) err += d; });
    const timer = setTimeout(() => { killed = true; p.kill(); }, 10000);
    p.on("close", (code) => {
      clearTimeout(timer);
      const text = [out.slice(0, 20000), err ? `stderr:\n${err.slice(0, 5000)}` : "", killed ? "(stopped after 10 s)" : code ? `(exit code ${code})` : ""].filter(Boolean).join("\n");
      resolve({ text: text || "(no output)", isError: killed || code !== 0 });
    });
    p.stdin.on("error", () => {});
    p.stdin.end(code);
  });
}

// A tool box for one run: call(name, args) -> {text, isError}; counts rule-tool calls.
export function toolBox(L, budget, sandbox) {
  let used = 0;
  return {
    get used() { return used; },
    async call(name, args) {
      if (name === "run_js" && sandbox) {
        if (typeof args?.code !== "string") return { text: "run_js needs a string `code`.", isError: true };
        return runJs(args.code);
      }
      if (!RULE_TOOLS[name]) return { text: `Unknown tool ${name}.`, isError: true };
      if (typeof args?.moves !== "string") return { text: `${name} needs a string \`moves\`.`, isError: true };
      if (++used > budget) return { text: "Budget used up: no rule-tool calls are left. Give your final answer now.", isError: true };
      try {
        const r = command(L, name, parseMoves(args.moves));
        return { text: `${r.text}\n(rule-tool calls left: ${budget - used})` };
      } catch (e) {
        return { text: String(e.message || e), isError: true };
      }
    },
  };
}
