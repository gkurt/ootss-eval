#!/usr/bin/env node
// The coding track's tools (tools.mjs) as an MCP server on stdio, for runs through Claude Code
// (run.mjs --via cli):
//
//   node tools-server.mjs <level> <budget> [--no-sandbox]
//
// JSON-RPC 2.0, one message per line (the MCP stdio transport).
import { createInterface } from "node:readline";
import { load } from "./ootss.mjs";
import { toolDefs, toolBox } from "./tools.mjs";

const [level, budgetArg, ...rest] = process.argv.slice(2);
const budget = +budgetArg || 40, sandbox = !rest.includes("--no-sandbox");
const box = toolBox(load(level), budget, sandbox);
const tools = toolDefs(budget, sandbox).map((d) => ({ name: d.name, description: d.description, inputSchema: d.schema }));

const send = (msg) => process.stdout.write(JSON.stringify({ jsonrpc: "2.0", ...msg }) + "\n");
createInterface({ input: process.stdin }).on("line", async (line) => {
  let m;
  try { m = JSON.parse(line); } catch { return; }
  if (m.id === undefined) return; // notifications
  try {
    if (m.method === "initialize")
      send({ id: m.id, result: { protocolVersion: m.params?.protocolVersion || "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "ootss", version: "1" } } });
    else if (m.method === "tools/list") send({ id: m.id, result: { tools } });
    else if (m.method === "tools/call") {
      const r = await box.call(m.params?.name, m.params?.arguments);
      send({ id: m.id, result: { content: [{ type: "text", text: r.text }], ...(r.isError ? { isError: true } : {}) } });
    } else if (m.method === "ping") send({ id: m.id, result: {} });
    else send({ id: m.id, error: { code: -32601, message: `no method ${m.method}` } });
  } catch (e) {
    send({ id: m.id, error: { code: -32603, message: String(e.message || e) } });
  }
});
