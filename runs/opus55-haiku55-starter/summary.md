# Eval run opus55-haiku55-starter

| Model | Track | Solved | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Tier 5 | Moves / ref | Answers | Right first time | Wrong answers | Test plays (failed) | Tool calls | Time / run | Time to solve | Output tok | Input tok | Est. $ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| claude-haiku-5-5 | reasoning | 7/12 | 2/2 | 2/3 | 1/3 | 1/2 | 1/2 | 0.97 | 2 | 5/12 | 17 | — | 0 | 9m20s | 6m30s | 1,544,160 | 1,288,937 | 1.27 |
| claude-haiku-5-5 | coding | 10/12 | 2/2 | 3/3 | 2/3 | 2/2 | 1/2 | 1.06 | 0.92 | 10/12 | 1 | 15 (5) | 3.3 | 7m52s | 5m43s | 872,596 | 3,616,059 | 1.18 |
| claude-opus-5-5 | reasoning | 12/12 | 2/2 | 3/3 | 3/3 | 2/2 | 2/2 | 1.03 | 1.08 | 11/12 | 1 | — | 0 | 4m32s | 4m31s | 349,829 | 122,924 | 7.28 |
| claude-opus-5-5 | coding | 12/12 | 2/2 | 3/3 | 3/3 | 2/2 | 2/2 | 1.08 | 1 | 12/12 | 0 | 18 (6) | 1.7 | 4m51s | 4m50s | 358,219 | 1,012,668 | 10.36 |

Per level (✓ k = won after k moves; ✗ refused/lost @k = move k failed; then the run's time):

| Level | Tier | Ref | claude-haiku-5-5 reasoning | claude-haiku-5-5 coding | claude-opus-5-5 reasoning | claude-opus-5-5 coding |
|---|---|---|---|---|---|---|
| heroes1_11_v2 | 1 | 27 | ✓ 26 · 3m16s | ✓ 27 · 42s | ✓ 27 · 56s | ✓ 26 · 1m10s |
| heroes2_13 | 1 | 17 | ✓ 17 · 22s | ✓ 17 · 28s | ✓ 17 · 14s | ✓ 17 · 15s |
| heroes1_16_v3 | 2 | 80 | ✓ 81 · 7m39s | ✓ 83 · 4m13s | ✓ 81 (answer 2) · 2m53s | ✓ 86 · 1m25s |
| mirror_2 | 2 | 27 | ✓ 30 (answer 2) · 3m07s | ✓ 32 · 2m39s | ✓ 30 · 58s | ✓ 28 · 1m23s |
| mosh_pit_small | 2 | 45 | ✗ refused @57 · 18m12s | ✓ 59 · 8m10s | ✓ 58 · 6m14s | ✓ 64 · 6m19s |
| mirror_7 | 3 | 36 | ✓ 44 · 6m33s | ✓ 48 · 11m17s | ✓ 38 · 1m16s | ✓ 54 · 1m57s |
| one_fire_v2 | 3 | 79 | ✗ not won · 9m57s | ✓ 86 · 8m05s | ✓ 85 · 3m57s | ✓ 82 · 4m05s |
| one_vs_three | 3 | 90 | ✗ not won · 4m40s | ✗ not won · 7m03s | ✓ 96 · 10m32s | ✓ 102 · 18m56s |
| heroes1_18 | 4 | 86 | ✓ 93 (answer 2) · 6m42s | ✓ 103 · 7m34s | ✓ 89 · 3m02s | ✓ 108 · 3m04s |
| mirror_3 | 4 | 96 | ✗ refused @62 · 15m20s | ✓ 102 · 4m33s | ✓ 102 · 2m40s | ✓ 104 · 2m19s |
| heroes2_22_v2 | 5 | 120 | ✗ not won · 18m19s | ✗ no answer · 30m00s | ✓ 148 · 15m57s | ✓ 130 · 12m34s |
| mirror_factory_v2 | 5 | 281 | ✓ 108 · 17m54s | ✓ 103 · 9m35s | ✓ 104 · 5m45s | ✓ 108 · 4m40s |

Moves / ref: winning moves over the reference solution's length (below 1 is shorter). Answers: answers given per run. Right first time: runs whose first answer won. Wrong answers: answers that did not win, over all runs (the coding track gives one). Test plays: play and check calls in the coding track, and in brackets how many of them did not win. Time to solve: from the start of a run to its winning answer, over the solved runs. Est. $: from list prices (Claude Code's estimate for --via cli).
