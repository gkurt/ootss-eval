# Eval run sonnet55-starter

| Model | Track | Solved | Tier 1 | Tier 2 | Tier 3 | Tier 4 | Tier 5 | Moves / ref | Answers | Right first time | Wrong answers | Test plays (failed) | Tool calls | Time / run | Time to solve | Output tok | Input tok | Est. $ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| claude-sonnet-5-5 | reasoning | 10/12 | 2/2 | 3/3 | 2/3 | 2/2 | 1/2 | 1.01 | 1.08 | 10/12 | 3 | — | 0 | 5m54s | 3m49s | 329,261 | 138,621 | 3.44 |
| claude-sonnet-5-5 | coding | 11/12 | 2/2 | 3/3 | 2/3 | 2/2 | 2/2 | 1.02 | 0.92 | 11/12 | 0 | 21 (10) | 2.2 | 6m19s | 4m09s | 375,845 | 2,003,151 | 5.54 |

Per level (✓ k = won after k moves; ✗ refused/lost @k = move k failed; then the run's time):

| Level | Tier | Ref | claude-sonnet-5-5 reasoning | claude-sonnet-5-5 coding |
|---|---|---|---|---|
| heroes1_11_v2 | 1 | 27 | ✓ 26 · 39s | ✓ 26 · 36s |
| heroes2_13 | 1 | 17 | ✓ 17 · 12s | ✓ 17 · 13s |
| heroes1_16_v3 | 2 | 80 | ✓ 78 · 2m52s | ✓ 78 · 2m13s |
| mirror_2 | 2 | 27 | ✓ 32 · 1m02s | ✓ 34 · 1m06s |
| mosh_pit_small | 2 | 45 | ✓ 56 · 12m01s | ✓ 55 · 8m02s |
| mirror_7 | 3 | 36 | ✓ 41 · 1m41s | ✓ 41 · 1m29s |
| one_fire_v2 | 3 | 79 | ✓ 85 · 5m47s | ✓ 83 · 3m06s |
| one_vs_three | 3 | 90 | ✗ no answer · 30m00s | ✗ no answer · 30m00s |
| heroes1_18 | 4 | 86 | ✓ 92 · 4m12s | ✓ 87 · 2m25s |
| mirror_3 | 4 | 96 | ✓ 104 · 3m00s | ✓ 102 · 3m34s |
| heroes2_22_v2 | 5 | 120 | ✗ not won · 2m24s | ✓ 144 · 17m43s |
| mirror_factory_v2 | 5 | 281 | ✓ 97 · 6m54s | ✓ 106 · 5m23s |

Moves / ref: winning moves over the reference solution's length (below 1 is shorter). Answers: answers given per run. Right first time: runs whose first answer won. Wrong answers: answers that did not win, over all runs (the coding track gives one). Test plays: play and check calls in the coding track, and in brackets how many of them did not win. Time to solve: from the start of a run to its winning answer, over the solved runs. Est. $: from list prices (Claude Code's estimate for --via cli).
