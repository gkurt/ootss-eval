import { Link } from "react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader, Section } from "@/components/page"

const TOOLS = [
  ["show", "the board, the lists of heroes, objects, gates and plates, and the status, after some moves"],
  ["play", "what each move did, one line per move, stopping at the first move that fails"],
  ["try", "what each possible next move would do from a position"],
  ["check", "whether a move sequence wins"],
  ["run_js", "a JavaScript scratchpad for working things out; it has no file system, network or rules, and costs nothing from the budget"],
]

export function MethodPage() {
  return (
    <div className="max-w-4xl">
      <PageHeader title="Method">
        How the runs are set up, what the models get, and what counts as solved.
      </PageHeader>

      <Section title="The game">
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Order of the Sinking Star is a turn-based puzzle game. Every level has heroes, each with its own ability (the warrior pushes a whole row,
            the thief pulls, the wizard swaps places, the cleric shields its neighbours from monsters, the druid transmutes what it walks into, and
            so on), and doors. A level is won when every hero stands on a
            door at the same time. Water drowns, goblins and dragons kill, plates open gates, and magic mirrors teleport whatever they reflect.
          </p>
          <p>
            The levels here are the demo's own. Their rules are written up in a{" "}
            <Link to="/rules" className="text-primary underline-offset-4 hover:underline">
              rule book
            </Link>{" "}
            and implemented in a rules engine (<code className="font-mono text-xs">kit/engine/ootss.mjs</code>), which scores every answer and runs
            every replay on this site. The rules come from the game's code and were not checked against the game by playing it; where they differ, the
            eval follows the engine.
          </p>
        </div>
      </Section>

      <Section title="What the model gets">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-sm">System prompt</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              The whole rule book (about 300 lines), then the track's instructions: how to answer, how many answers or tool calls it has.
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-sm">First message</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              The level briefing: an ASCII map with a legend, every hero and object with its position and facing, the doors, and the move letters. Each
              level page shows its briefing.
            </CardContent>
          </Card>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          A move is one letter: <code className="font-mono">U D L R</code> move the selected heroes, <code className="font-mono">C</code> selects the next
          hero group, <code className="font-mono">X</code> activates the magic mirrors. The model is not told whether a solution is known.
        </p>
      </Section>

      <Section title="Two tracks">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-sm">Reasoning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>No tools. The model ends its reply with its moves in a moves block.</p>
              <p>
                A wrong answer gets the checker's line back (which move failed and why, or that every move was valid but the level was not won) and the
                model may answer again: three answers in all.
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-sm">Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Tools that run the rules on the level, 40 calls in all, and one final answer:</p>
              <ul className="space-y-1">
                {TOOLS.map(([n, d]) => (
                  <li key={n}>
                    <code className="font-mono text-xs text-foreground">{n}</code>: {d}
                  </li>
                ))}
              </ul>
              <p>The budget rules out brute force, and the prompt asks for no search over moves. Every program the model ran is in its transcript.</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Running the models">
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Each run is a fresh Claude Code process in print mode, in an empty folder, with the eval's system prompt in place of Claude Code's, no
            built-in tools, no settings files, and in the tools track only the eval's tools (served over MCP). Effort is high. A run has a time limit (30
            minutes for the starter set, two hours for the open levels); a run that hits it ends with no answer.
          </p>
          <p>
            Claude Code returns the length of the model's thinking but not its text, so the transcripts show replies, tool calls and answers, and the
            thinking between them only as a token count.
          </p>
        </div>
      </Section>

      <Section title="Scoring">
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>
            <b className="text-foreground">Solved</b>: the final answer wins under the rules engine. Moves after the win are ignored.
          </li>
          <li>
            <b className="text-foreground">Right first time</b>: the first answer won. <b className="text-foreground">Wrong answers</b>: answers that did not.
          </li>
          <li>
            <b className="text-foreground">Test plays</b> (tools track): <code className="font-mono text-xs">play</code> and{" "}
            <code className="font-mono text-xs">check</code> calls, and how many tried moves that did not win.
          </li>
          <li>Time (wall clock and in the model), tokens, and Claude Code's cost estimate at list prices.</li>
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          Every winning answer on the open levels was also replayed by a second, independent implementation of the rules, which agreed.
        </p>
      </Section>
    </div>
  )
}
