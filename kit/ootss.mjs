#!/usr/bin/env node
// OOTSS level tools for agents, on the rules engine (engine/ootss.mjs). Every answer here comes
// from the engine; nothing re-implements a rule.
//
//   node ootss.mjs list                       levels with tier, size, heroes and mechanics
//   node ootss.mjs show  <level> [moves]      the board after the moves, and the game status
//   node ootss.mjs play  <level> <moves>      what each move did, step by step
//   node ootss.mjs check <level> <moves>      one line: WON, NOT WON, or FAILED at move k
//   node ootss.mjs try   <level> [moves]      what each possible next move would do
//   node ootss.mjs state <level> [moves]      the state as JSON
//   node ootss.mjs describe <level>           the level briefing (levels/<name>.md)
//
// Moves are letters: U D L R (move the selected heroes north/south/west/east), C (select the next
// hero group), X (activate the magic mirrors). Spaces and commas are ignored.
// Exit codes: check/play give 0 when the level is won, 1 when not won, 2 when a move fails.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const M = (await import(pathToFileURL(join(HERE, "engine", "ootss.mjs")).href)).default;

const list = (xs) => xs.reduceRight((t, h) => ({ $: "Con", head: h, tail: t }), { $: "Nil" });
const arr = (l) => { const out = []; for (; l && l.$ === "Con"; l = l.tail) out.push(l.head); return out; };
function value(v) {
  if (v === null || typeof v !== "object") return v;
  if (v.$rows === "tiles") return M.tiles_of(list(v.rows));
  if (v.$rows === "top") return M.top_of(list(v.rows));
  const out = {};
  for (const [k, x] of Object.entries(v)) out[k] = k === "$" ? x : value(x);
  return out;
}

export const MANIFEST = JSON.parse(readFileSync(join(HERE, "levels.json"), "utf8"));

export function load(name) {
  const path = join(HERE, "data", `${name}.json`);
  if (!existsSync(path)) throw new Error(`unknown level "${name}" (see: node ootss.mjs list)`);
  const d = JSON.parse(readFileSync(path, "utf8"));
  const lv = value(d.values.level), init = value(d.values.init);
  const s = M.start(lv, init);
  if (s.$ !== "Some") throw new Error("the rules reject this level's start");
  return { name, meta: d.meta, lv, init, start: s.value, rows: d.values.level.tiles.rows, top: d.values.level.top.rows };
}

// Coordinates for agents: x = column, y = row (0 at the top-left of the map), layer 0 = where
// heroes walk, -1 = sunk into the water / below, 1 = on top of a wall. (The model stores
// column + 1, row + 1 and layer + 2 behind a solid border.)
const X = (p) => p.c - 1, Y = (p) => p.r - 1, Z = (p) => p.z - 2;
const ROLE = { Warrior: "W", Thief: "T", Wizard: "Z", Cleric: "C", Bard: "B", Druid: "D", Trader: "R", Queen: "Q" };
const DIRNAME = { DN: "north", DE: "east", DS: "south", DW: "west", DUp: "up", DDown: "down" };
const VEC = { DN: [0, -1], DE: [1, 0], DS: [0, 1], DW: [-1, 0] };
const CW = { DN: "DE", DE: "DS", DS: "DW", DW: "DN" };
const FLIP = { DN: "DS", DS: "DN", DE: "DW", DW: "DE" };

const groupsOf = (st) => arr(M.leaders(st.ents)).map((l) => M.leader_group(l));
const groupNo = (st, g) => groupsOf(st).indexOf(g) + 1; // groups numbered 1.. in selection order

export function describeEnt(e, st) {
  const k = e.kind;
  if (k.$ === "Guy") return { kind: "hero", role: k.role.$.toLowerCase(), group: groupNo(st, k.group) };
  if (k.$ === "Rock") {
    const o = { kind: k.mirrorable ? "crystal" : "boulder" };
    if (k.stash.$ !== "SNone") o.holds = k.stash.$ === "STree" ? "tree" : k.stash.$ === "SMonster" ? k.stash.mk.$.toLowerCase() : k.stash.role.$.toLowerCase();
    return o;
  }
  if (k.$ === "Monster") return { kind: k.mk.$.toLowerCase(), facing: DIRNAME[k.dir.$] };
  if (k.$ === "Mirror") return { kind: k.magic ? "magic mirror" : "plain mirror", facing: DIRNAME[k.facing.$], faces: [DIRNAME[FLIP[k.facing.$]], DIRNAME[CW[k.facing.$]]] };
  return { kind: k.$.toLowerCase() };
}

function glyph(e) {
  const k = e.kind;
  if (k.$ === "Guy") return ROLE[k.role.$];
  if (k.$ === "Rock") return k.mirrorable ? "*" : "o";
  if (k.$ === "Monster") return k.mk.$ === "Dragon" ? "d" : "g";
  if (k.$ === "Tree") return "&";
  if (k.$ === "Sign") return "!";
  if (k.$ === "Mirror") {
    // the glass lies across the quadrant its two faces look into
    const a = VEC[FLIP[k.facing.$]], b = VEC[CW[k.facing.$]];
    return (a[0] + b[0]) * (a[1] + b[1]) > 0 ? "/" : "\\";
  }
  return "?";
}

export function stateJSON(L, st) {
  const es = arr(st.ents).filter((e) => !e.dead);
  const gs = arr(st.gates);
  return {
    selected_group: groupNo(st, st.sel),
    groups: groupsOf(st).length,
    heroes: es.filter((e) => e.kind.$ === "Guy").map((e) => ({ id: e.id, ...describeEnt(e, st), x: X(e.at), y: Y(e.at), layer: Z(e.at) })),
    objects: es.filter((e) => e.kind.$ !== "Guy").map((e) => ({ id: e.id, ...describeEnt(e, st), x: X(e.at), y: Y(e.at), layer: Z(e.at) })),
    gates: arr(L.lv.gates).map((g, i) => ({ x: X(g.at), y: Y(g.at), layer: Z(g.at), flavor: g.flavor, inverted: g.notted, monster_gate: g.monster,
      open: !M.closed_gate(L.lv, st.gates, { $: "Nil" }, g.at), closes_toward: DIRNAME[g.close.$] })),
    plates: arr(L.lv.plates).map((p) => ({ x: X(p.at), y: Y(p.at), flavor: p.flavor, pressed: es.some((e) => e.at.c === p.at.c && e.at.r === p.at.r && e.at.z === p.at.z) })),
    doors: arr(L.lv.doors).map((d) => ({ x: X(d), y: Y(d), occupied: es.some((e) => e.kind.$ === "Guy" && e.at.c === d.c && e.at.r === d.r && e.at.z === d.z) })),
    won: M.won(L.lv, st),
    _gates_raw: gs,
  };
}

// The map: terrain, then fixtures, then whatever stands highest in each cell (layer >= 0).
export function render(L, st) {
  const R = L.rows.length - 1, W = L.rows[0].length - 1;
  const T = { F: ".", W: "#", A: "~", S: " " };
  const g = [];
  for (let r = 1; r <= R; r++) g.push([...L.rows[r]].slice(1, W + 1).map((ch) => T[ch] ?? " "));
  const put = (p, ch) => { if (g[Y(p)] && Y(p) >= 0 && X(p) >= 0 && X(p) < W) g[Y(p)][X(p)] = ch; };
  for (const p of arr(L.lv.plates)) put(p.at, "_");
  for (const d of arr(L.lv.doors)) put(d, "@");
  for (const gt of arr(L.lv.gates)) put(gt.at, M.closed_gate(L.lv, st.gates, { $: "Nil" }, gt.at) ? "%" : "'");
  const es = arr(st.ents).filter((e) => !e.dead).sort((a, b) => a.at.z - b.at.z);
  for (const e of es) put(e.at, e.at.z < 2 ? "," : glyph(e));
  const ruler = (n) => {
    const tens = [...Array(W)].map((_, i) => (i % 10 === 0 ? String(Math.floor(i / 10) % 10) : " ")).join("");
    const ones = [...Array(W)].map((_, i) => String(i % 10)).join("");
    return n ? tens : ones;
  };
  const out = ["    " + ruler(1), "    " + ruler(0)];
  g.forEach((row, y) => out.push(String(y).padStart(3) + " " + row.join("")));
  return out.join("\n");
}

const LEGEND = [
  [".", "floor"], ["#", "wall"], ["~", "water"], [" ", "solid ground outside the level (impassable)"],
  ["@", "door"], ["_", "pressure plate"], ["%", "closed gate"], ["'", "open gate"],
  ["W", "warrior"], ["T", "thief"], ["Z", "wizard"], ["C", "cleric"], ["B", "bard"], ["D", "druid"], ["R", "trader"], ["Q", "queen"],
  ["o", "boulder"], ["*", "crystal"], ["g", "goblin"], ["d", "dragon"], ["&", "tree"], ["!", "sign"],
  ["/", "mirror, glass from bottom-left to top-right"], ["\\", "mirror, glass from top-left to bottom-right"],
  [",", "something sunk below the surface (see the lists)"],
];

// One input, classified: ok (the new state), refused (nothing happened: a bump), lost (a hero
// would die), using the model's own pieces of act.
export function step(L, st, k) {
  if (k === "C") {
    const r = M.switch(st);
    return r.$ === "Some" ? { result: "ok", st: r.value } : { result: "refused", why: "there is only one hero group" };
  }
  if (k === "X" && !L.lv.mirrors) return { result: "refused", why: "this level has no mirrors" };
  const t = k === "X" ? M.activate(L.lv, st) : M.enact(L.lv, st, M.input_dir({ $: k }));
  if (M.txn_empty(t)) return { result: "refused", why: k === "X" ? "no mirror has a valid reflection to activate" : "blocked: nothing can move that way" };
  const r = M.settle(L.lv, st, t);
  if (r.$ !== "Some") return { result: "lost", why: "a hero would die (drowned, eaten, burned or crushed)" };
  return { result: "ok", st: r.value };
}

export function parseMoves(s) {
  const m = (s || "").toUpperCase().replace(/[\s,;]+/g, "");
  const bad = m.replace(/[UDLRCX]/g, "");
  if (bad) throw new Error(`unknown move letters: ${[...new Set(bad)].join(" ")} (use U D L R C X)`);
  return m;
}

export function run(L, moves) {
  let st = L.start;
  const steps = [];
  for (let i = 0; i < moves.length; i++) {
    const r = step(L, st, moves[i]);
    steps.push({ n: i + 1, move: moves[i], ...r });
    if (r.result !== "ok") return { st, steps, failed: i, won: false };
    st = r.st;
    if (M.won(L.lv, st)) return { st, steps, failed: -1, won: true, wonAt: i + 1 };
  }
  return { st, steps, failed: -1, won: M.won(L.lv, st) };
}

const MOVE = { U: "U (north)", D: "D (south)", L: "L (west)", R: "R (east)", C: "C (next group)", X: "X (activate)" };

function changes(L, a, b) {
  const pos = (e) => `(${X(e.at)},${Y(e.at)}${Z(e.at) ? `,layer ${Z(e.at)}` : ""})`;
  const A = new Map(arr(a.ents).map((e) => [e.id, e])), out = [];
  for (const e of arr(b.ents)) {
    const p = A.get(e.id);
    const name = `${describeEnt(e, b).role || describeEnt(e, b).kind}#${e.id}`;
    if (!p) out.push(`${name} appears at ${pos(e)}`);
    else if (p.at.c !== e.at.c || p.at.r !== e.at.r || p.at.z !== e.at.z) out.push(`${name} ${pos(p)}->${pos(e)}`);
    else if (JSON.stringify(p.kind) !== JSON.stringify(e.kind)) out.push(`${name} becomes ${describeEnt(e, b).kind}`);
    A.delete(e.id);
  }
  for (const e of A.values()) out.push(`${describeEnt(e, a).role || describeEnt(e, a).kind}#${e.id} is gone`);
  const ga = arr(a.gates), gb = arr(b.gates);
  gb.forEach((g, i) => { if (g !== ga[i]) { const gt = arr(L.lv.gates)[i]; out.push(`gate at (${X(gt.at)},${Y(gt.at)}) ${g ? "opens" : "closes"}`); } });
  if (a.sel !== b.sel) out.push(`selected group ${groupNo(b, b.sel)}`);
  return out.join("; ") || "no visible change";
}

function statusLine(L, st) {
  const j = stateJSON(L, st);
  const onDoors = j.doors.filter((d) => d.occupied).length;
  return `${j.won ? "WON" : "not won"} · heroes on doors ${onDoors}/${j.doors.length} (heroes: ${j.heroes.length}) · selected group ${j.selected_group} of ${j.groups}`;
}

function lists(L, st) {
  const j = stateJSON(L, st);
  const at = (o) => `(${o.x},${o.y}${o.layer ? `, layer ${o.layer}` : ""})`;
  const out = [];
  out.push("Heroes:");
  for (const h of j.heroes) out.push(`  ${h.role} #${h.id} at ${at(h)}, group ${h.group}`);
  if (j.objects.length) {
    out.push("Objects:");
    for (const o of j.objects) out.push(`  ${o.kind} #${o.id} at ${at(o)}${o.facing ? `, facing ${o.facing}` : ""}${o.faces ? ` (reflects toward ${o.faces.join(" and ")})` : ""}${o.holds ? `, holds a ${o.holds}` : ""}`);
  }
  if (j.gates.length) {
    out.push("Gates:");
    for (const g of j.gates) out.push(`  (${g.x},${g.y}${g.layer ? `, layer ${g.layer}` : ""}) flavor ${g.flavor}: ${g.open ? "open" : "closed"}${g.inverted ? ", inverted" : ""}${g.monster_gate ? ", monster gate" : ""}, closes toward ${g.closes_toward}`);
  }
  if (j.plates.length) {
    out.push("Pressure plates:");
    for (const p of j.plates) out.push(`  (${p.x},${p.y}) flavor ${p.flavor}${p.pressed ? ", pressed" : ""}`);
  }
  out.push("Doors: " + j.doors.map((d) => `(${d.x},${d.y})${d.occupied ? " occupied" : ""}`).join(", "));
  return out.join("\n");
}

export function describe(L) {
  const m = MANIFEST.levels.find((x) => x.name === L.name) || {};
  const fences = arr(L.lv.fences).map((f) => `(${f.c - 1},${f.r - 1}) ${DIRNAME[f.edge.$]} edge`);
  const tall = [];
  L.top.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === "#" && r >= 1 && c >= 1) tall.push(`(${c - 1},${r - 1})`); }));
  const used = new Set(render(L, L.start).replace(/^.*\n.*\n/, "").split("\n").map((l) => l.slice(4)).join(""));
  const legend = LEGEND.filter(([ch]) => used.has(ch)).map(([ch, t]) => `  ${ch === " " ? "(space)" : ch}  ${t}`).join("\n");
  return [
    `# ${L.name}`,
    "",
    `Size ${L.rows[0].length - 1} x ${L.rows.length - 1}. Heroes: ${m.heroes?.join(", ") || "?"}. Mechanics: ${m.features?.length ? m.features.join(", ") : "walking and pushing only"}.`,
    "Goal: every hero stands on a door at the same time (as many heroes as doors).",
    L.lv.walk_water ? "In this level a hero standing above layer 0 (for example on a wall) may step out over water. From layer 0, heroes still refuse to step into water." : null,
    "",
    "```",
    render(L, L.start),
    "```",
    "",
    "Legend:",
    legend,
    "",
    lists(L, L.start),
    fences.length ? `Fences (block walking and pushing across that edge): ${fences.join(", ")}` : null,
    tall.length ? `Walls two blocks high: ${tall.join(", ")}` : null,
    "",
    "Moves: U D L R move the selected hero group north, south, west, east; C selects the next group" + (L.lv.mirrors ? "; X activates the magic mirrors." : "."),
  ].filter((x) => x !== null).join("\n");
}

// One tool command on a level, as text (what the CLI prints) and the CLI's exit code.
export function command(L, cmd, moves) {
  const out = [];
  const R = run(L, moves);
  const done = (code = R.won ? 0 : R.failed >= 0 ? 2 : 1) => ({ text: out.join("\n"), code });
  if (cmd === "show") {
    out.push(render(L, R.st));
    out.push(lists(L, R.st));
    if (R.failed >= 0) out.push(`Move ${R.failed + 1} (${moves[R.failed]}) failed: ${R.steps[R.failed].result}: ${R.steps[R.failed].why}. Board shown before it.`);
    out.push(statusLine(L, R.st));
    return done();
  }
  if (cmd === "play") {
    let prev = L.start;
    for (const s of R.steps) {
      out.push(`${String(s.n).padStart(4)} ${MOVE[s.move].padEnd(15)} ${s.result === "ok" ? changes(L, prev, s.st) : `${s.result.toUpperCase()}: ${s.why}`}`);
      if (s.st) prev = s.st;
    }
    if (R.won && R.wonAt < moves.length) out.push(`(won after move ${R.wonAt}; the remaining ${moves.length - R.wonAt} moves were not played)`);
    out.push(statusLine(L, R.st));
    return done();
  }
  if (cmd === "check") {
    if (R.won) out.push(`WON after ${R.wonAt} moves`);
    else if (R.failed >= 0) out.push(`FAILED at move ${R.failed + 1} (${moves[R.failed]}): ${R.steps[R.failed].result}: ${R.steps[R.failed].why}`);
    else out.push(`NOT WON after ${moves.length} moves`);
    return done();
  }
  if (cmd === "try") {
    if (R.failed >= 0) { out.push(`Move ${R.failed + 1} (${moves[R.failed]}) failed: ${R.steps[R.failed].why}`); return done(2); }
    for (const k of "UDLRCX") {
      if (k === "X" && !L.lv.mirrors) continue;
      const r = step(L, R.st, k);
      out.push(`${MOVE[k].padEnd(15)} ${r.result === "ok" ? changes(L, R.st, r.st) + (M.won(L.lv, r.st) ? "  => WON" : "") : `${r.result}: ${r.why}`}`);
    }
    return done(0);
  }
  if (cmd === "state") {
    const j = stateJSON(L, R.st);
    delete j._gates_raw;
    out.push(JSON.stringify({ level: L.name, moves_played: R.failed >= 0 ? R.failed : moves.length, failed: R.failed >= 0 ? { move: R.failed + 1, ...R.steps[R.failed], st: undefined } : null, ...j }, null, 1));
    return done(0);
  }
  throw new Error(`unknown command "${cmd}"`);
}

// CLI --------------------------------------------------------------------------------------------
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [cmd, name, movesArg] = process.argv.slice(2);
  try {
    if (!cmd || cmd === "help" || cmd === "-h" || cmd === "--help") {
      console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").slice(1, 17).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
      process.exit(0);
    }
    if (cmd === "list") {
      for (const l of MANIFEST.levels) console.log(`${l.name.padEnd(40)} tier ${l.tier}  ${String(l.width).padStart(2)}x${String(l.height).padEnd(2)}  ${l.heroes.join(",").padEnd(18)} ${l.features.join(",")}`);
      process.exit(0);
    }
    const L = load(name);
    const moves = parseMoves(movesArg);
    if (cmd === "describe") { console.log(describe(L)); process.exit(0); }
    const r = command(L, cmd, moves);
    console.log(r.text);
    process.exit(r.code);
  } catch (e) {
    console.error(String(e.message || e));
    process.exit(3);
  }
}
