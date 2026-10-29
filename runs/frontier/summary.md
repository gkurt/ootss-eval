# Eval run frontier

| Model | Track | Solved | Tier 6 | Moves / ref | Answers | Right first time | Wrong answers | Test plays (failed) | Tool calls | Time / run | Time to solve | Output tok | Input tok | Est. $ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| claude-haiku-5-5 | reasoning | 0/4 | 0/4 | — | 3 | 0/4 | 12 | — | 0 | 17m23s | — | 927,433 | 515,297 | 0.59 |
| claude-haiku-5-5 | coding | 1/4 | 1/4 | — | 1 | 1/4 | 3 | 13 (12) | 4.5 | 20m12s | 14m24s | 1,064,007 | 1,823,368 | 0.84 |
| claude-opus-5-5 | reasoning | 4/4 | 4/4 | — | 1 | 4/4 | 0 | — | 0 | 10m34s | 10m33s | 267,797 | 38,999 | 5.46 |
| claude-opus-5-5 | coding | 4/4 | 4/4 | — | 1 | 4/4 | 0 | 6 (2) | 1.8 | 9m04s | 9m03s | 224,409 | 1,204,615 | 6.82 |
| claude-sonnet-5-5 | reasoning | 3/4 | 3/4 | — | 1 | 3/4 | 1 | — | 0 | 38m24s | 11m11s | 586,357 | 57,506 | 5.96 |
| claude-sonnet-5-5 | coding | 3/4 | 3/4 | — | 1 | 3/4 | 1 | 10 (7) | 4.5 | 15m47s | 17m12s | 445,455 | 2,460,156 | 6.54 |

Per level (✓ k = won after k moves; ✗ refused/lost @k = move k failed; then the run's time):

| Level | Tier | Ref | claude-haiku-5-5 reasoning | claude-haiku-5-5 coding | claude-opus-5-5 reasoning | claude-opus-5-5 coding | claude-sonnet-5-5 reasoning | claude-sonnet-5-5 coding |
|---|---|---|---|---|---|---|---|---|
| mirror_21 | 6 | none known | ✗ not won · 2m55s | ✓ 73 · 14m25s | ✓ 73 · 8m24s | ✓ 71 · 6m24s | ✓ 73 · 4m36s | ✓ 73 · 5m11s |
| surrounded | 6 | none known | ✗ not won · 47m43s | ✗ no answer · 38m21s | ✓ 104 · 11m45s | ✓ 116 · 10m55s | ✓ 110 · 11m54s | ✓ 126 · 11m08s |
| walk_it_over | 6 | none known | ✗ not won · 2m12s | ✗ not won · 9m07s | ✓ 207 · 11m49s | ✓ 293 · 9m38s | ✓ 217 · 17m05s | ✗ not won · 11m33s |
| worlds_collide_heroes_and_mirrors_v3 | 6 | none known | ✗ not won · 16m41s | ✗ not won · 18m56s | ✓ 152 · 10m18s | ✓ 119 · 9m19s | ✗ no answer · 2.0h | ✓ 146 · 35m18s |

Moves / ref: winning moves over the reference solution's length (below 1 is shorter). Answers: answers given per run. Right first time: runs whose first answer won. Wrong answers: answers that did not win, over all runs (the coding track gives one). Test plays: play and check calls in the coding track, and in brackets how many of them did not win. Time to solve: from the start of a run to its winning answer, over the solved runs. Est. $: from list prices (Claude Code's estimate for --via cli).
