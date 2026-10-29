// Board rendering: terrain on a canvas, gates, plates, doors and entities as animated SVG on top.
// Positions are the engine's own: column and row are +1 behind a solid border, and the stored
// z is layer + 2.
import { arr, gateClosed, groups, mirageOf, type Level, type V } from "./engine"

const SVGNS = "http://www.w3.org/2000/svg"
export const FLAVOR = ["#f59e0b", "#22d3ee", "#e879f9", "#a3e635", "#fb7185", "#60a5fa", "#fde047", "#c4b5fd"]
export const ROLE: Record<string, { color: string; glyph: string; name: string; ink?: string }> = {
  Warrior: { color: "#ef4444", glyph: "⚔", name: "warrior" },
  Thief: { color: "#a855f7", glyph: "✧", name: "thief" },
  Wizard: { color: "#3b82f6", glyph: "✶", name: "wizard" },
  Cleric: { color: "#f1f5f9", glyph: "✚", name: "cleric", ink: "#b45309" },
  Bard: { color: "#ec4899", glyph: "♪", name: "bard" },
  Druid: { color: "#22c55e", glyph: "❦", name: "druid" },
  Trader: { color: "#2dd4bf", glyph: "⚖", name: "trader" },
  Queen: { color: "#eab308", glyph: "♛", name: "queen" },
}
export const roleByName = (name: string) => Object.values(ROLE).find((r) => r.name === name)

const ANGLE: Record<string, number> = { DN: -90, DE: 0, DS: 90, DW: 180, DUp: -90, DDown: 90 }
const VEC: Record<string, [number, number]> = { DN: [0, -1], DE: [1, 0], DS: [0, 1], DW: [-1, 0] }
const CW: Record<string, string> = { DN: "DE", DE: "DS", DS: "DW", DW: "DN" }

// Heights for shading: water -1, floor 0, wall 1, wall with a layer-1 block 2, solid 3.
function heights(rows: string[], top: string[]) {
  return rows.map((row, r) => [...row].map((ch, c) => (ch === "A" ? -1 : ch === "F" ? 0 : ch === "W" ? (top[r][c] === "#" ? 2 : 1) : 3)))
}

// A wall block with no wall block next to it (walls and solid cells count as walls).
const isPost = (H: number[][], c: number, r: number) =>
  H[r][c] >= 1 && H[r][c] <= 2 && [[0, -1], [0, 1], [-1, 0], [1, 0]].every(([dc, dr]) => (H[r + dr]?.[c + dc] ?? 3) <= 0)

// What a cell is, for the hover card.
export function terrainAt(L: Level, c: number, r: number) {
  const H = heights(L.rows, L.top)
  const ch = L.rows[r]?.[c]
  const up = L.top[r]?.[c] === "#"
  if (ch === "F") return { name: "Floor", detail: "heroes can stand here; rocks and mirrors can be pushed onto it" }
  if (ch === "A")
    return {
      name: "Water",
      detail: L.lv.walk_water
        ? "heroes may wade in here; a pushed rock sinks and becomes floor"
        : "heroes and monsters that fall in drown; a pushed rock or mirror sinks and becomes floor",
    }
  if (ch === "W") {
    const post = isPost(H, c, r)
    return {
      name: post ? (up ? "Tall post" : "Post") : up ? "Tall wall" : "Wall",
      detail: up ? "blocks walking, pushing and beams at layers 0 and 1" : "blocks walking, pushing and beams; something can rest on top at layer 1",
    }
  }
  return { name: "Solid", detail: "blocked at every height" }
}

export function drawTerrain(ctx: CanvasRenderingContext2D, rows: string[], top: string[], S: number, { grid = true } = {}) {
  const H = heights(rows, top)
  const W = rows[0].length - 1
  const R = rows.length - 1
  ctx.fillStyle = "#070a14"
  ctx.fillRect(0, 0, W * S, R * S)
  const at = (c: number, r: number) => (r >= 0 && r < H.length && c >= 0 && c < H[r].length ? H[r][c] : 3)
  for (let r = 1; r <= R; r++) {
    for (let c = 1; c <= W; c++) {
      const h = H[r][c]
      const x = (c - 1) * S
      const y = (r - 1) * S
      if (h === 3) {
        const g = ctx.createLinearGradient(x, y, x, y + S)
        g.addColorStop(0, "#151b2e")
        g.addColorStop(1, "#0d1222")
        ctx.fillStyle = g
        ctx.fillRect(x, y, S, S)
        continue
      }
      if (h === -1) {
        const g = ctx.createLinearGradient(x, y, x + S, y + S)
        g.addColorStop(0, "#1e5a9e")
        g.addColorStop(1, "#17457d")
        ctx.fillStyle = g
        ctx.fillRect(x, y, S, S)
        if (S >= 12) {
          ctx.strokeStyle = "rgba(186,230,253,0.16)"
          ctx.lineWidth = Math.max(1, S / 28)
          for (const f of [0.3, 0.68]) {
            ctx.beginPath()
            const yy = y + S * f + ((c * 7 + r * 3) % 5) * S * 0.02
            ctx.moveTo(x + S * 0.15, yy)
            ctx.quadraticCurveTo(x + S * 0.35, yy - S * 0.08, x + S * 0.55, yy)
            ctx.quadraticCurveTo(x + S * 0.75, yy + S * 0.08, x + S * 0.9, yy)
            ctx.stroke()
          }
        }
      } else if (h === 0) {
        ctx.fillStyle = (c + r) % 2 ? "#d8c69f" : "#d2bf97"
        ctx.fillRect(x, y, S, S)
        if (grid && S >= 10) {
          ctx.strokeStyle = "rgba(120,96,60,0.18)"
          ctx.lineWidth = 1
          ctx.strokeRect(x + 0.5, y + 0.5, S - 1, S - 1)
        }
      } else if (isPost(H, c, r)) {
        const landNext = [[0, -1], [0, 1], [-1, 0], [1, 0]].some(([dc, dr]) => at(c + dc, r + dr) === 0)
        ctx.fillStyle = landNext ? ((c + r) % 2 ? "#d8c69f" : "#d2bf97") : "#1b4f8c"
        ctx.fillRect(x, y, S, S)
        const cx = x + S / 2
        const cy = y + S / 2
        const rad = S * 0.36
        ctx.fillStyle = "rgba(0,0,0,0.35)"
        ctx.beginPath()
        ctx.ellipse(cx + S * 0.08, cy + S * 0.12, rad, rad * 0.8, 0, 0, Math.PI * 2)
        ctx.fill()
        const g = ctx.createRadialGradient(cx - rad * 0.4, cy - rad * 0.45, rad * 0.1, cx, cy, rad)
        g.addColorStop(0, h === 2 ? "#ddd3c2" : "#c4b8a4")
        g.addColorStop(1, h === 2 ? "#9d917d" : "#7f7462")
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(cx, cy, rad, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "rgba(40,32,22,0.7)"
        ctx.lineWidth = Math.max(1, S * 0.04)
        ctx.stroke()
        if (h === 2 && S >= 10) {
          ctx.strokeStyle = "rgba(255,255,255,0.35)"
          ctx.beginPath()
          ctx.arc(cx, cy, rad * 0.55, 0, Math.PI * 2)
          ctx.stroke()
        }
        continue
      } else {
        const top2 = h === 2
        const g = ctx.createLinearGradient(x, y, x, y + S)
        g.addColorStop(0, top2 ? "#c7bcaa" : "#a99d8a")
        g.addColorStop(1, top2 ? "#ada18d" : "#8f8371")
        ctx.fillStyle = g
        ctx.fillRect(x, y, S, S)
        ctx.fillStyle = "rgba(255,255,255,0.18)"
        ctx.fillRect(x, y, S, Math.max(1, S * 0.08))
        ctx.fillStyle = "rgba(0,0,0,0.22)"
        ctx.fillRect(x, y + S * 0.86, S, S * 0.14)
        if (top2 && S >= 10) {
          ctx.strokeStyle = "rgba(255,255,255,0.25)"
          ctx.strokeRect(x + S * 0.18, y + S * 0.18, S * 0.64, S * 0.64)
        }
      }
      // shadows cast by higher neighbours to the north and west
      const dn = at(c, r - 1) - h
      const dw = at(c - 1, r) - h
      if (dn > 0) {
        const g = ctx.createLinearGradient(x, y, x, y + S * 0.42)
        g.addColorStop(0, `rgba(0,0,0,${Math.min(0.5, 0.18 * dn + 0.1)})`)
        g.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = g
        ctx.fillRect(x, y, S, S * 0.42)
      }
      if (dw > 0) {
        const g = ctx.createLinearGradient(x, y, x + S * 0.3, y)
        g.addColorStop(0, `rgba(0,0,0,${Math.min(0.4, 0.12 * dw + 0.08)})`)
        g.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = g
        ctx.fillRect(x, y, S * 0.3, S)
      }
      // foam where water meets land
      if (h === -1 && S >= 8) {
        ctx.fillStyle = "rgba(224,242,254,0.35)"
        const e = Math.max(1, S * 0.06)
        if (at(c, r - 1) >= 0 && at(c, r - 1) < 3) ctx.fillRect(x, y, S, e)
        if (at(c, r + 1) >= 0 && at(c, r + 1) < 3) ctx.fillRect(x, y + S - e, S, e)
        if (at(c - 1, r) >= 0 && at(c - 1, r) < 3) ctx.fillRect(x, y, e, S)
        if (at(c + 1, r) >= 0 && at(c + 1, r) < 3) ctx.fillRect(x + S - e, y, e, S)
      }
    }
  }
}

// The part of a level worth showing: land, doors and every place an entity visits, padded.
export function cropFor(rows: string[], states: V[], pad = 2): [number, number, number, number] | null {
  const W = rows[0].length - 1
  const R = rows.length - 1
  let c0 = W
  let r0 = R
  let c1 = 1
  let r1 = 1
  const take = (c: number, r: number) => {
    c0 = Math.min(c0, c)
    c1 = Math.max(c1, c)
    r0 = Math.min(r0, r)
    r1 = Math.max(r1, r)
  }
  rows.forEach((row, r) => [...row].forEach((ch, c) => r >= 1 && c >= 1 && (ch === "F" || ch === "W") && take(c, r)))
  for (const st of states) for (const e of arr(st.ents)) take(e.at.c, e.at.r)
  if (c0 > c1) return null
  return [Math.max(1, c0 - pad), Math.max(1, r0 - pad), Math.min(W, c1 + pad), Math.min(R, r1 + pad)]
}

// A small static picture of a level (raw level JSON, no engine needed).
export function drawThumb(canvas: HTMLCanvasElement, values: V, maxW: number) {
  const rows = values.level.tiles.rows
  const top = values.level.top.rows
  const [c0, r0, c1, r1] = cropFor(rows, [values.init], 1) || [1, 1, rows[0].length - 1, rows.length - 1]
  const W = c1 - c0 + 1
  const R = r1 - r0 + 1
  const S = Math.max(3, Math.floor(maxW / W))
  const dpr = window.devicePixelRatio || 1
  canvas.width = W * S * dpr
  canvas.height = R * S * dpr
  canvas.style.aspectRatio = `${W} / ${R}`
  const ctx = canvas.getContext("2d")!
  ctx.scale(dpr, dpr)
  ctx.translate(-(c0 - 1) * S, -(r0 - 1) * S)
  drawTerrain(ctx, rows, top, S, { grid: false })
  const dot = (p: V, color: string, rad = 0.36, sq = false) => {
    const x = (p.c - 0.5) * S
    const y = (p.r - 0.5) * S
    ctx.fillStyle = color
    ctx.beginPath()
    if (sq) ctx.rect(x - S * rad, y - S * rad, 2 * S * rad, 2 * S * rad)
    else ctx.arc(x, y, S * rad, 0, Math.PI * 2)
    ctx.fill()
  }
  for (const d of arr(values.level.doors)) dot(d, "#fbbf24", 0.4, true)
  for (const p of arr(values.level.plates)) dot(p.at, FLAVOR[p.flavor % FLAVOR.length], 0.3, true)
  for (const g of arr(values.level.gates)) dot(g.at, FLAVOR[g.flavor % FLAVOR.length], 0.45, true)
  for (const e of arr(values.init.ents)) {
    const k = e.kind
    const color =
      k.$ === "Guy" ? ROLE[k.role.$].color
      : k.$ === "Rock" ? (k.mirrorable ? "#67e8f9" : "#9ca3af")
      : k.$ === "Monster" ? (k.mk.$ === "Dragon" ? "#dc2626" : "#65a30d")
      : k.$ === "Tree" ? "#15803d"
      : k.$ === "Mirror" ? (k.magic ? "#c084fc" : "#e2e8f0")
      : "#a16207"
    dot(e.at, color, k.$ === "Guy" ? 0.42 : 0.34)
  }
}

const el = (tag: string, attrs: Record<string, string | number> = {}, parent?: Element) => {
  const n = document.createElementNS(SVGNS, tag)
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v))
  if (parent) parent.appendChild(n)
  return n
}

// Glyphs, drawn around (0, 0) in cell units (the group is scaled by the cell size).
function glyph(g: Element, e: V) {
  const k = e.kind
  el("ellipse", { class: "shadow", cx: 0.04, cy: 0.3, rx: 0.32, ry: 0.11 }, g)
  const body = el("g", { class: "body" }, g)
  if (k.$ === "Guy") {
    const r = ROLE[k.role.$]
    el("circle", { r: 0.36, fill: r.color, stroke: "#0b1020", "stroke-width": 0.05 }, body)
    el("circle", { r: 0.3, fill: "none", stroke: "rgba(255,255,255,0.45)", "stroke-width": 0.03 }, body)
    el("text", { y: 0.13, "text-anchor": "middle", "font-size": 0.42, fill: r.ink || "#0b1020", class: "glyph" }, body).textContent = r.glyph
  } else if (k.$ === "Rock") {
    if (k.mirrorable) {
      el("polygon", { points: "0,-0.38 0.33,-0.19 0.33,0.19 0,0.38 -0.33,0.19 -0.33,-0.19", fill: "#67e8f9", stroke: "#0e7490", "stroke-width": 0.05, class: "crystal" }, body)
      el("polyline", { points: "-0.33,-0.19 0,0 0.33,-0.19", fill: "none", stroke: "rgba(255,255,255,0.6)", "stroke-width": 0.035 }, body)
      el("line", { x1: 0, y1: 0, x2: 0, y2: 0.38, stroke: "rgba(14,116,144,0.6)", "stroke-width": 0.035 }, body)
    } else {
      el("path", { d: "M-0.36,0.08 C-0.38,-0.22 -0.14,-0.38 0.08,-0.36 C0.3,-0.34 0.4,-0.14 0.37,0.08 C0.34,0.3 0.12,0.38 -0.08,0.36 C-0.28,0.34 -0.35,0.24 -0.36,0.08 Z", fill: "#8b8f99", stroke: "#3f4350", "stroke-width": 0.05 }, body)
      el("path", { d: "M-0.2,-0.18 C-0.1,-0.27 0.06,-0.28 0.15,-0.22", fill: "none", stroke: "rgba(255,255,255,0.45)", "stroke-width": 0.05, "stroke-linecap": "round" }, body)
    }
    const s = k.stash.$
    if (s !== "SNone") {
      const c = s === "STree" ? "#16a34a" : s === "SMonster" ? "#dc2626" : ROLE[k.stash.role.$].color
      el("circle", { r: 0.11, cx: 0, cy: 0.04, fill: c, stroke: "#0b1020", "stroke-width": 0.03 }, body)
    }
  } else if (k.$ === "Monster") {
    const rot = el("g", { transform: `rotate(${ANGLE[k.dir.$]})` }, body)
    if (k.mk.$ === "Dragon") {
      el("path", { d: "M0.42,0 L0.12,-0.3 L-0.1,-0.42 L-0.05,-0.18 L-0.38,-0.3 L-0.26,0 L-0.38,0.3 L-0.05,0.18 L-0.1,0.42 L0.12,0.3 Z", fill: "#dc2626", stroke: "#450a0a", "stroke-width": 0.05, "stroke-linejoin": "round" }, rot)
      el("circle", { cx: 0.2, cy: -0.07, r: 0.04, fill: "#fde047" }, rot)
      el("circle", { cx: 0.2, cy: 0.07, r: 0.04, fill: "#fde047" }, rot)
    } else {
      el("circle", { r: 0.32, fill: "#65a30d", stroke: "#1a2e05", "stroke-width": 0.05 }, rot)
      el("path", { d: "M-0.05,-0.3 L-0.32,-0.44 L-0.22,-0.18 Z M-0.05,0.3 L-0.32,0.44 L-0.22,0.18 Z", fill: "#4d7c0f" }, rot)
      el("path", { d: "M0.42,0 L0.26,-0.1 L0.26,0.1 Z", fill: "#fef08a" }, rot)
      el("circle", { cx: 0.12, cy: -0.1, r: 0.05, fill: "#fef08a" }, rot)
      el("circle", { cx: 0.12, cy: 0.1, r: 0.05, fill: "#fef08a" }, rot)
    }
  } else if (k.$ === "Tree") {
    el("rect", { x: -0.05, y: 0.05, width: 0.1, height: 0.28, fill: "#78350f" }, body)
    el("circle", { cx: -0.13, cy: -0.02, r: 0.2, fill: "#15803d" }, body)
    el("circle", { cx: 0.13, cy: -0.02, r: 0.2, fill: "#16a34a" }, body)
    el("circle", { cx: 0, cy: -0.18, r: 0.22, fill: "#22c55e" }, body)
  } else if (k.$ === "Sign") {
    el("rect", { x: -0.04, y: -0.05, width: 0.08, height: 0.38, fill: "#78350f" }, body)
    el("rect", { x: -0.3, y: -0.33, width: 0.6, height: 0.3, rx: 0.04, fill: "#ca8a04", stroke: "#713f12", "stroke-width": 0.04 }, body)
  } else if (k.$ === "Mirror") {
    // Faces look along A = opposite of the facing and B = the facing turned clockwise: glass on
    // the diagonal across that quadrant, opaque back behind it.
    const [ax, ay] = VEC[k.facing.$] ? (VEC[k.facing.$].map((v) => -v) as [number, number]) : [0, 1]
    const [bx, by] = VEC[CW[k.facing.$]] || [1, 0]
    const nx = ax + bx
    const ny = ay + by
    const q = 0.42
    const p1 = [-ny * q, nx * q]
    const p2 = [ny * q, -nx * q]
    const back = [-nx * q, -ny * q]
    el("polygon", { points: `${p1} ${p2} ${back}`, fill: "#6b7280", stroke: "#374151", "stroke-width": 0.04, "stroke-linejoin": "round" }, body)
    el("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], stroke: k.magic ? "#7dd3fc" : "#cbd5e1", "stroke-width": 0.13, "stroke-linecap": "round", class: k.magic ? "glass magic" : "glass" }, body)
    el("line", { x1: p1[0] * 0.7, y1: p1[1] * 0.7, x2: p2[0] * 0.2, y2: p2[1] * 0.2, stroke: "rgba(255,255,255,0.7)", "stroke-width": 0.035, "stroke-linecap": "round", transform: `translate(${nx * 0.025},${ny * 0.025})` }, body)
  }
  return body
}

function kindLabel(e: V) {
  const k = e.kind
  if (k.$ === "Guy") return ROLE[k.role.$].name
  if (k.$ === "Rock") return (k.mirrorable ? "crystal" : "boulder") + (k.stash.$ !== "SNone" ? ` holding a ${k.stash.$.slice(1).toLowerCase()}` : "")
  if (k.$ === "Monster") return `${k.mk.$.toLowerCase()} facing ${{ DN: "north", DE: "east", DS: "south", DW: "west" }[k.dir.$ as string] ?? ""}`
  if (k.$ === "Mirror") return `${k.magic ? "magic " : ""}mirror`
  return k.$.toLowerCase()
}
const layerName = (z: number) => (z < 0 ? "sunk" : z > 0 ? "on top" : "")
export const describe = (e: V) => [kindLabel(e), layerName(e.at.z - 2)].filter(Boolean).join(", ")

const sig = (e: V) => JSON.stringify(e.kind)
type Ent = { g: SVGGElement; sig: string; z?: number }

export class Board {
  L: Level
  S: number
  W: number
  R: number
  ox: number
  oy: number
  svg: SVGSVGElement
  floorLayer: Element
  gateLayer: Element
  mirageLayer: Element
  entLayer: Element
  fxLayer: Element
  ents = new Map<number, Ent>()
  plates: { p: V; g: Element }[] = []
  doors: { d: V; g: Element }[] = []
  gates: { gt: V; g: Element }[] = []
  mirageNotes: { at: V; text: string }[] = []
  st: V = null
  drawn = false
  hoverCell: string | null = null

  constructor(host: HTMLElement, L: Level, { cell = 40, crop = null as [number, number, number, number] | null } = {}) {
    this.L = L
    this.S = cell
    const rows = L.rows
    const [c0, r0, c1, r1] = crop || [1, 1, rows[0].length - 1, rows.length - 1]
    this.W = c1 - c0 + 1
    this.R = r1 - r0 + 1
    this.ox = (c0 - 1) * cell
    this.oy = (r0 - 1) * cell
    host.replaceChildren()
    host.classList.add("board")
    host.style.aspectRatio = `${this.W} / ${this.R}`
    host.style.setProperty("--ar", String(this.W / this.R))
    const canvas = document.createElement("canvas")
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = this.W * cell * dpr
    canvas.height = this.R * cell * dpr
    const ctx = canvas.getContext("2d")!
    ctx.scale(dpr, dpr)
    ctx.translate(-this.ox, -this.oy)
    drawTerrain(ctx, rows, L.top, cell)
    host.appendChild(canvas)
    this.svg = el("svg", { viewBox: `${this.ox} ${this.oy} ${this.W * cell} ${this.R * cell}`, class: "overlay", preserveAspectRatio: "none" }) as SVGSVGElement
    host.appendChild(this.svg)
    const defs = el("defs", {}, this.svg)
    defs.innerHTML = `
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <pattern id="bars" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="8" fill="rgba(0,0,0,0.25)"/></pattern>`
    this.floorLayer = el("g", {}, this.svg)
    this.gateLayer = el("g", {}, this.svg)
    this.mirageLayer = el("g", { class: "mirages" }, this.svg)
    this.entLayer = el("g", {}, this.svg)
    this.fxLayer = el("g", {}, this.svg)
    this.drawStatic()
    this.initHover(host)
  }

  // Hover card: what the cell under the pointer is, and what stands on it.
  initHover(host: HTMLElement) {
    const tip = document.createElement("div")
    tip.className = "cell-tip"
    host.appendChild(tip)
    const mark = el("rect", { class: "cell-mark", width: this.S, height: this.S, rx: 4 }, this.fxLayer) as SVGRectElement
    const hide = () => {
      tip.classList.remove("show")
      mark.style.display = "none"
      this.hoverCell = null
    }
    hide()
    this.svg.addEventListener("pointerleave", hide)
    this.svg.addEventListener("pointermove", (ev) => {
      if (ev.pointerType === "touch") return
      const pt = this.svg.createSVGPoint()
      pt.x = ev.clientX
      pt.y = ev.clientY
      const p = pt.matrixTransform(this.svg.getScreenCTM()!.inverse())
      const c = Math.floor(p.x / this.S) + 1
      const r = Math.floor(p.y / this.S) + 1
      if (p.x < this.ox || p.y < this.oy || p.x >= this.ox + this.W * this.S || p.y >= this.oy + this.R * this.S) return hide()
      if (this.hoverCell !== `${c},${r}`) {
        this.hoverCell = `${c},${r}`
        mark.setAttribute("x", String((c - 1) * this.S))
        mark.setAttribute("y", String((r - 1) * this.S))
        mark.style.display = ""
        this.fillTip(tip, c, r)
      }
      const box = host.getBoundingClientRect()
      let x = ev.clientX - box.left + 16
      let y = ev.clientY - box.top + 16
      if (x + tip.offsetWidth > box.width) x = ev.clientX - box.left - tip.offsetWidth - 12
      if (y + tip.offsetHeight > box.height) y = Math.max(4, ev.clientY - box.top - tip.offsetHeight - 12)
      tip.style.transform = `translate(${x}px, ${y}px)`
      tip.classList.add("show")
    })
  }

  fillTip(tip: HTMLElement, c: number, r: number) {
    const t = terrainAt(this.L, c, r)
    const lv = this.L.lv
    const st = this.st
    const same = (p: V) => p.c === c && p.r === r
    const here: string[] = []
    if (st) for (const e of arr(st.ents).filter((e) => !e.dead && same(e.at)).sort((a, b) => b.at.z - a.at.z)) here.push(describe(e))
    for (const d of arr(lv.doors)) if (same(d)) here.push("door: every hero must stand on one")
    for (const p of arr(lv.plates)) if (same(p.at)) here.push("pressure plate")
    for (const g of arr(lv.gates))
      if (same(g.at)) {
        const closed = st ? gateClosed(lv, st, g.at) : null
        here.push(`${g.monster ? "monster gate" : g.notted ? "inverted gate" : "gate"}${closed === null ? "" : closed ? ", closed" : ", open"}`)
      }
    for (const f of arr(lv.fences)) if (f.c === c && f.r === r) here.push(`fence on the ${{ DN: "north", DE: "east", DS: "south", DW: "west" }[f.edge.$ as string]} edge`)
    for (const m of this.mirageNotes) if (same(m.at)) here.push(m.text)
    const div = (cls: string, text: string) => {
      const n = document.createElement("div")
      n.className = cls
      n.textContent = text
      return n
    }
    const head = document.createElement("div")
    head.className = "tip-head"
    head.append(div("tip-name", t.name), div("tip-xy", `${c - 1}, ${r - 1}`))
    tip.replaceChildren(head, div("tip-detail", t.detail))
    if (here.length) {
      const ul = document.createElement("ul")
      for (const x of here) {
        const li = document.createElement("li")
        li.textContent = x
        ul.append(li)
      }
      tip.append(ul)
    }
  }

  xy(p: V): [number, number] {
    return [(p.c - 0.5) * this.S, (p.r - 0.5) * this.S]
  }

  drawStatic() {
    const S = this.S
    const lv = this.L.lv
    for (const f of arr(lv.fences)) {
      const x = (f.c - 1) * S
      const y = (f.r - 1) * S
      const d = f.edge.$
      const [x1, y1, x2, y2] = d === "DN" ? [x, y, x + S, y] : d === "DS" ? [x, y + S, x + S, y + S] : d === "DW" ? [x, y, x, y + S] : [x + S, y, x + S, y + S]
      el("line", { x1, y1, x2, y2, class: "fence" }, this.floorLayer)
    }
    this.plates = arr(lv.plates).map((p) => {
      const [x, y] = this.xy(p.at)
      const g = el("g", { class: "plate", transform: `translate(${x},${y})` }, this.floorLayer)
      const c = FLAVOR[p.flavor % FLAVOR.length]
      el("rect", { x: -S * 0.32, y: -S * 0.32, width: S * 0.64, height: S * 0.64, rx: S * 0.1, fill: "rgba(15,23,42,0.35)", stroke: c, "stroke-width": S * 0.07 }, g)
      el("rect", { x: -S * 0.18, y: -S * 0.18, width: S * 0.36, height: S * 0.36, rx: S * 0.05, fill: c, class: "plate-core" }, g)
      return { p, g }
    })
    this.doors = arr(lv.doors).map((d) => {
      const [x, y] = this.xy(d)
      const g = el("g", { class: "door", transform: `translate(${x},${y})` }, this.floorLayer)
      el("path", { d: `M${-S * 0.32},${S * 0.36} L${-S * 0.32},${-S * 0.06} A${S * 0.32},${S * 0.32} 0 0 1 ${S * 0.32},${-S * 0.06} L${S * 0.32},${S * 0.36} Z`, fill: "rgba(251,191,36,0.25)", stroke: "#fbbf24", "stroke-width": S * 0.06 }, g)
      el("text", { y: S * 0.2, "text-anchor": "middle", "font-size": S * 0.4, fill: "#fbbf24", class: "glyph" }, g).textContent = "★"
      return { d, g }
    })
    this.gates = arr(lv.gates).map((gt) => {
      const [x, y] = this.xy(gt.at)
      const g = el("g", { class: "gate", transform: `translate(${x},${y})` }, this.gateLayer)
      const c = FLAVOR[gt.flavor % FLAVOR.length]
      const box = { x: -S * 0.46, y: -S * 0.46, width: S * 0.92, height: S * 0.92, rx: S * 0.08 }
      el("rect", { ...box, fill: c, class: "gate-fill" }, g)
      el("rect", { ...box, fill: "url(#bars)", class: "gate-bars" }, g)
      el("rect", { ...box, fill: "none", stroke: c, "stroke-width": S * 0.06, class: "gate-edge" }, g)
      if (gt.notted) el("text", { y: S * 0.14, "text-anchor": "middle", "font-size": S * 0.42, class: "gate-mark" }, g).textContent = "¬"
      if (gt.monster) el("text", { y: S * 0.14, "text-anchor": "middle", "font-size": S * 0.4, class: "gate-mark" }, g).textContent = "☠"
      return { gt, g }
    })
  }

  render(st: V, { animate = true, ms = 180, sel = st.sel } = {}) {
    const S = this.S
    const lv = this.L.lv
    this.st = st
    this.hoverCell = null
    this.svg.style.setProperty("--ms", `${animate ? ms : 0}ms`)
    const es = arr(st.ents).filter((e) => !e.dead)
    const occupied = new Set(es.map((e) => `${e.at.c},${e.at.r},${e.at.z}`))
    for (const { gt, g } of this.gates) g.classList.toggle("open", !gateClosed(lv, st, gt.at))
    for (const { p, g } of this.plates) g.classList.toggle("pressed", occupied.has(`${p.at.c},${p.at.r},${p.at.z}`))
    for (const { d, g } of this.doors) g.classList.toggle("reached", es.some((e) => e.kind.$ === "Guy" && e.at.c === d.c && e.at.r === d.r && e.at.z === d.z))
    const gs = groups(st)
    const multi = gs.length > 1
    const seen = new Set<number>()
    for (const e of es) {
      seen.add(e.id)
      let n = this.ents.get(e.id)
      const s = sig(e) + (multi ? gs.indexOf(e.kind.group) : "")
      const fresh = !n || n.sig !== s
      if (fresh) {
        if (n) n.g.remove()
        const g = el("g", { class: "ent" + (e.kind.$ === "Guy" ? " hero" : "") }, this.entLayer) as SVGGElement
        const inner = el("g", { transform: `scale(${S})` }, g)
        glyph(inner, e)
        if (e.kind.$ === "Guy") {
          el("circle", { r: 0.47, class: "sel-ring" }, inner)
          if (multi) {
            el("circle", { cx: 0.3, cy: -0.3, r: 0.15, fill: "#0b1020", stroke: ROLE[e.kind.role.$].color, "stroke-width": 0.03 }, inner)
            el("text", { x: 0.3, y: -0.25, "text-anchor": "middle", "font-size": 0.17, fill: "#e2e8f0", class: "badge" }, inner).textContent = String(gs.indexOf(e.kind.group) + 1)
          }
        }
        n = { g, sig: s }
        this.ents.set(e.id, n)
        if (!animate || !this.drawn) g.style.transition = "none"
        else g.style.opacity = "0"
      }
      const layer = e.at.z - 2
      const [x, y] = this.xy(e.at)
      const sc = layer < 0 ? 0.82 : 1 + 0.1 * layer
      n!.g.style.transform = `translate(${x}px, ${y - layer * S * 0.14}px) scale(${sc})`
      n!.g.classList.toggle("sunk", layer < 0)
      n!.g.classList.toggle("high", layer > 0)
      n!.g.classList.toggle("selected", e.kind.$ === "Guy" && e.kind.group === sel)
      n!.z = e.at.z * 1000 + e.at.r
      const node = n!
      if (fresh && animate && this.drawn)
        requestAnimationFrame(() => {
          node.g.style.transition = ""
          node.g.style.opacity = ""
        })
      else if (fresh) requestAnimationFrame(() => (node.g.style.transition = ""))
    }
    for (const [id, n] of this.ents) {
      if (seen.has(id)) continue
      this.ents.delete(id)
      if (animate) {
        n.g.classList.add("gone")
        setTimeout(() => n.g.remove(), ms + 200)
      } else n.g.remove()
    }
    this.drawMirages(st, es)
    // stacking: lower layers first, then rows from the back; reorder only when it changed
    const order = [...this.ents.values()].sort((a, b) => (a.z ?? 0) - (b.z ?? 0))
    const cur = [...this.entLayer.children].filter((c) => !c.classList.contains("gone"))
    if (order.some((n, i) => cur[i] !== n.g)) for (const n of order) this.entLayer.appendChild(n.g)
    this.drawn = true
  }

  // Each magic mirror's mirage: a faded copy of the reflected entity where ACTIVATE would send
  // it, and the beam it travels (entity -> mirror -> target).
  drawMirages(st: V, es: V[]) {
    this.mirageLayer.replaceChildren()
    this.mirageNotes = []
    if (!this.L.lv.mirrors) return
    const S = this.S
    for (const m of es) {
      if (m.kind.$ !== "Mirror" || !m.kind.magic) continue
      const mg = mirageOf(m, this.L.lv, st)
      if (!mg) continue
      const g = el("g", { class: `mirage ${mg.valid ? "valid" : "invalid"}` }, this.mirageLayer)
      const [ex, ey] = this.xy(mg.e.at)
      const [mx, my] = this.xy(m.at)
      const [tx, ty] = this.xy(mg.tgt)
      el("polyline", { points: `${ex},${ey} ${mx},${my} ${tx},${ty}`, class: "beam" }, g)
      const ghost = el("g", { transform: `translate(${tx},${ty}) scale(${S})` }, g)
      glyph(ghost, mg.e)
      el("rect", { x: -0.46, y: -0.46, width: 0.92, height: 0.92, rx: 0.12, class: "mirage-cell" }, ghost)
      this.mirageNotes.push({ at: mg.tgt, text: `mirage of the ${describe(mg.e)}: X would move it here${mg.valid ? "" : ", but it is blocked"}` })
    }
  }
}
