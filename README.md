# Sinking Star Eval

Claude models solving puzzle levels from the *Order of the Sinking Star* demo. A model gets the
game's rule book and a text briefing of a level, and answers with a move sequence; a rules
engine checks every answer. The site in `web/` shows the results and replays every run move by
move, with the full transcript.

## Results

| Model | Starter set, reasoning | Starter set, tools | Open levels, reasoning | Open levels, tools |
|---|---|---|---|---|
| Claude Opus 5.5 | 12/12 | 12/12 | 4/4 | 4/4 |
| Claude Sonnet 5.5 | 10/12 | 11/12 | 3/4 | 3/4 |
| Claude Haiku 5.5 | 7/12 | 10/12 | 0/4 | 1/4 |

- **Starter set:** twelve levels across difficulty tiers 1 to 5, 30 minutes per run.
- **Open levels:** the four demo levels with no known solution. Earlier search runs gave up on
  all of them: mirror_21 after a complete breadth-first search of 140M states, the others after
  12M states each. Two hours per run. Opus 5.5 solved all four, in both tracks, every time on
  its first answer and mostly within 12 minutes.

All runs went through Claude Code at effort high; about $55 at list prices for the 96 runs.

## Two tracks

- **Reasoning.** No tools. The model answers with its moves; a wrong answer gets the checker's
  verdict back (which move failed and why, or "not won"), up to three answers.
- **Tools.** Four tools that run the rules on the level (`show`, `play`, `try`, `check`), 40
  calls in all, and `run_js`, a JavaScript scratchpad with no file system, network or rules. The
  budget rules out brute force, and the prompt asks for no search over moves. One final answer.

## What is here

| Path | What |
|---|---|
| `kit/RULES.md` | The rule book every model reads first |
| `kit/levels/<name>.md` | The briefing for one level: map with coordinates, legend, every hero and object |
| `kit/levels.json` | Index of the 104 demo levels: heroes, mechanics, size, difficulty tier, level sets |
| `kit/ootss.mjs` | Command-line tools on the rules engine: check an answer, play it step by step, show a state |
| `kit/engine/ootss.mjs` | The rules engine. Scores every answer, and runs every replay on the site |
| `kit/data/<name>.json` | Level values for the engine, with a reference solution where one is known. Keep away from models under test |
| `kit/run.mjs` | Runs Claude models on a level set and scores them |
| `kit/tools.mjs`, `kit/tools-server.mjs` | The tools track's tools, and the same tools as an MCP server for Claude Code |
| `runs/<id>/` | One run: a file per model, track and level (answers, score, timed transcript, tokens, cost), `summary.md` |
| `runs/index.json` | The runs the site shows, with titles |
| `web/` | The site: Vite, React, Tailwind and shadcn/ui on Base UI |

## The site

```bash
cd web
npm install
npm run dev       # builds web/public/data from kit/ and runs/, then serves on localhost:5173
npm run build     # static site in web/dist (hash routing, relative paths: host it anywhere)
```

Pages: an overview with the scoreboard, each run's summary and level-by-model results, a replay
for every result (board, player, every answer and tool call, the transcript), the levels, the
method and the rule book.

## Checking an answer

```bash
node kit/ootss.mjs check mirror_21 LLLDDDUUULUURDDDDRUURULXXRRDDLLULDDDRXUUUUUURDDDRDLLULDDDXLRXRXLXLLLLLL
```

`check` prints one line (`WON after 71 moves`, `NOT WON after 12 moves`, or
`FAILED at move 5 (R): refused: blocked: nothing can move that way`) and exits 0, 1 or 2. The
other commands: `list`, `show <level> [moves]`, `play <level> <moves>`, `try <level> [moves]`,
`state <level> [moves]`, `describe <level>`.

Moves are letters: `U D L R` move the selected heroes, `C` selects the next hero group, `X`
activates the magic mirrors.

## Running models

```bash
cd kit && npm install
claude auth login                       # once; runs use Claude Code's own login
node run.mjs --models claude-opus-5-5 --track both --set starter --id my-run
node run.mjs --models oracle --levels heroes2_13 --id test-oracle   # no model: tests the pipeline
node run.mjs --summary --id my-run      # rebuild runs/my-run/summary.md
```

Each run is a fresh `claude -p` process in an empty temporary folder, with the eval's system
prompt in place of Claude Code's, no built-in tools, no settings files, and in the tools track
only the eval's tools. `--via api` uses the Messages API instead (`ANTHROPIC_API_KEY`), and
returns summarized thinking, which Claude Code does not. Options: `--attempts`, `--budget`,
`--no-sandbox`, `--effort`, `--minutes`, `--jobs`; the header of `run.mjs` explains each. Run again with the same `--id` to resume. Runs whose id starts with `test-` are
git-ignored.

To show a run on the site, add it to `runs/index.json`.

## Caveats

- The rules come from the game's code and were never checked by playing the game. Where they
  differ from the game, the eval follows the engine. The open-level solutions are solutions
  under these rules; they have not been played in the game.
- A move that changes nothing is refused here, while the game spends a turn on it. No solution
  needs such a move.
- The level layouts are the game's own data. Keep this repository private.
