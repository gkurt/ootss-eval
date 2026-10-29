# Order of the Sinking Star (demo): rules

The rules the level checker runs (in discrete turns). x = column, y = row, (0,0) top-left, y
grows south. Layer 0 is where heroes walk, -1 is sunk (below the water surface), 1 is on top of
a wall; level lists give the layer only when it is not 0.

## Section index

Always read **Goal and turns**, **Terrain** and **Objects**. Add the sections a level needs:

| In `levels.json` / the briefing | Read |
|---|---|
| feature `gates` | Plates and gates |
| feature `water` | Terrain (### Water) |
| feature `goblins` or `dragons` | Monsters; Plates and gates (monster gates) |
| feature `mirrors` | Mirrors |
| hero `warrior`, `thief`, `wizard`, `cleric`, `bard`, `druid` | the section with that name |
| hero `trader` or `queen` | Trader and queen |
| a "Fences" line in the briefing | Terrain (### Fences) |

## Goal and turns

- **Win:** after a move has fully settled, every hero stands on a door (`@`) at layer 0, and
  the number of heroes equals the number of doors. Copies made by mirrors count as heroes.
- **Lose:** any hero dies (goblin, dragon breath, drowning, crushed by a gate). The move that
  kills a hero loses the level; there is no undo.
- **Moves:** `U` north (y-1), `D` south (y+1), `L` west (x-1), `R` east (x+1), `C` select the
  next hero group, `X` activate the magic mirrors (mirror levels only).
- **Groups:** every hero is its own group, except mirror copies, which join the group of the
  hero they copy (a level may also start with two heroes in one group). The briefing numbers
  groups in selection order. Group 1 is selected at the start. `C` selects the next group
  (wrapping to group 1); it is free: no turn passes. With only one group it is refused.
- A direction moves **every hero of the selected group**, the one furthest ahead in that
  direction first. A hero may step into a cell another hero of the same move is leaving.
  Heroes that are blocked stay; the others still move.
- **Refused moves:** an input that would change nothing (every selected hero is blocked, or `X`
  has nothing valid to do) is refused: no turn passes and monsters do not act.
- **One input = one turn, resolved to rest.** After your heroes move (with their pushes, pulls,
  swaps, charms, transmutes), the game repeats a check after every change until nothing
  changes:
  1. gates whose plates changed open or close (and push or crush what is in them);
  2. goblins and dragons attack, all at once on the same board;
  3. monster gates update;
  4. anything not held up falls one layer; heroes and monsters that fall into water drown.
  Each is a change that triggers the check again (dragons: see Monsters). Then the win is checked.

## Terrain

- `.` **floor**: walkable at layer 0.
- `#` **wall**: blocks layer 0. A wall is one block high: something at layer 1 can stand and
  walk on top of it. Cells listed under "Walls two blocks high" also block layer 1.
- (space) **solid ground** outside the level: blocks every layer, like the grid edge. Walls,
  solid ground and the grid edge block walking, pushing and every beam.
- **Layers and support.** Everything happens on the layer of whatever moves: walking, pushing
  and beams only meet things on the same layer. A thing is held up when the cell below it is
  floor, wall or solid ground, or holds a living hero, monster, crystal or boulder, or a closed
  gate. A mirror below holds nothing up. Anything not held up falls one layer at a time until
  it is. Trees and signs never fall. Doors and plates are at layer 0: a hero at layer 1 is not
  on a door.
- The only way up to layer 1 is a gate that closes upward under you. From there you walk over
  one-high walls and things at layer 0; stepping over an empty floor cell drops you to layer 0.

### Water

- `~` **water**: the cell has no floor. Layer 0 above it is open air, layer -1 is the water.
- A hero never walks onto a water cell unless something there holds it up: a sunk crystal or
  boulder at layer -1, or a closed bridge gate. Otherwise the step is refused. ("Heroes may walk
  into water" only lets a hero at layer 1 or higher step out over water and fall.)
- Pushed, pulled, charmed, swapped and teleported things are **not** stopped by water: they
  land over the water and fall. A hero or monster that falls into water drowns.
- A crystal or boulder that falls into water sinks to layer -1 and stays there for good. The
  cell is then floor for walking. A second rock pushed onto it stays at layer 0, as on floor.
  A sunk mirror holds nothing up. The map shows `,` where the top thing in a cell is sunk.
- Nothing at layer 0 pushes, pulls, swaps with or sees sunk things. Only the bard moves them.

### Fences

A fence blocks one edge of its cell (for example "(6,6) north edge" is the edge between (6,6)
and (6,5)). It blocks walking, pushing, the thief's pull, the bard's charm and goblin attacks
across that edge, in both directions. It does not block wizard beams, dragon breath, mirror
beams or a closing gate's push, and it does not occupy the cell.

## Warrior

The warrior pushes. When it walks into a cell holding a movable thing (hero, monster, crystal,
boulder, mirror), it pushes that thing one cell, and everything in line behind it, any number.
The whole line moves together or not at all. The line is stopped by a wall, solid ground, a
tree, a sign, a closed gate, a fence edge or the grid edge; then the warrior does not move.

```
W * * . #   + R  ->  . W * * #       W * * #   + R  ->  refused
```

Pushing into water is allowed (the pushed thing falls; a hero drowns). Pushing a goblin directly
leaves the warrior next to it, which kills the warrior unless protected; `W * g` is safe.

## Trader and queen

The trader and the queen push like the warrior but only **one** thing: a single hero, monster,
crystal, boulder or mirror with nothing standing on it. Two in a row is refused.

```
R * . .   + R  ->  . R * .           R * * .   + R  ->  refused
```

## Thief

The thief cannot push: walking into a movable thing is refused. Whenever the thief actually
steps, it automatically pulls the one movable thing directly behind it (hero, monster, crystal,
boulder, mirror) into the cell it just left. If the thief cannot step, nothing is pulled; if
only the pull is impossible (a fence edge between them), the thief steps alone. A pulled goblin
ends next to the thief and kills it unless protected.

```
* T .   + R  ->  . * T               * T #   + R  ->  refused (nothing moves)
```

## Wizard

On a direction input the wizard first looks in that direction along its layer, any distance.
The beam passes floor, water, plates, doors, open gates and fences. It stops at walls, solid
ground, the grid edge, trees, signs and closed gates (a mirror bounces it, see Mirrors). If it
first reaches a cell holding a hero, monster, crystal or boulder, the wizard and that thing
**swap places**. Nothing is checked at either end: no fences, no water. If the beam reaches no
such thing, the wizard walks one step instead, and cannot push.

```
Z . ~ . *   + R  ->  * . ~ . Z       Z * .   + R  ->  * Z .
Z . . #     + R  ->  . Z . #         Z % *   + R  ->  refused (% closed gate, next to Z)
```

## Cleric

The cleric is always on, selected or not. Goblins and dragons cannot kill a living cleric or any
hero orthogonally next to one (or directly above or below it). Positions are judged at each
attack, so stepping next to a goblin and next to the cleric in the same move is safe. It does
not help against drowning or gates. A protected hero still stops breath, shielding what is behind.

## Bard

The bard charms only while it is the selected hero. Charmed: other heroes (not the bard's own
group), goblins, dragons and crystals within 2 cells of the bard in x and in y (a 5x5 square)
and within 2 layers up or down. Not charmed: boulders, mirrors, trees, signs.

When the bard moves and something is charmed, the bard and every charmed thing each try to step
one cell that way, lower layers first, then front-most first. A thing steps only if no wall,
closed gate or fence edge is in the way and its next cell is empty or being left in this same
move; nothing is pushed. A stopped thing stays while the rest move. **If the bard itself
cannot step, nothing moves** (refused). The bard will not walk onto water, but charmed things
do not check for water: a charmed hero or monster led over water drowns, a crystal sinks. If
nothing is charmed, the bard just walks (it cannot push).

```
. B . * . .   + R  ->  . . B . * .
B . * #       + R  ->  . B * #        (the crystal is stuck, the bard still steps)
B * #         + R  ->  refused        (the crystal cannot step, so neither can the bard)
```

Sunk crystals in range are charmed too: they slide along at layer -1 under the water, only
through water cells. This is how a bard carries a bridge; a hero standing on one that slides
away drowns. Charmed goblins still attack: one that gets stuck as the bard steps next to it
kills the bard.

## Druid

The druid cannot push. When its step is refused because something is in the way, it
transmutes the first thing in the next cell instead, and stays where it is:

- tree -> crystal (which remembers the tree);
- goblin or dragon -> crystal (which remembers the monster and its facing);
- hero -> crystal (which remembers the hero);
- a crystal that remembers something -> that thing again (a monster keeps its facing);
- a plain crystal -> tree.

Walls, boulders, mirrors and signs are never transmuted; nothing happens across a fence edge.
If there is nothing to transmute, the input is refused. A transmuted creature is an ordinary
crystal until changed back: it does not attack, does not count as a monster for monster gates
and, if it was a hero, cannot be selected and does not count as a hero for the win (so the
level cannot be won until it is changed back). The lists show what a crystal holds.

```
D & .   + R  ->  D * .       then R  ->  D & .
```

## Objects

- **Movable things:** heroes (any, selected or not), monsters, crystals `*`, boulders `o`,
  mirrors `/` `\`. They block walking, can be pushed and pulled, press plates and fall when not
  held up. All but mirrors can be swapped by the wizard.
- **Crystal `*` vs boulder `o`:** both stop dragon breath harmlessly and sink into water to
  become floor. Only crystals are reflected by mirrors (a boulder blocks a mirror's line of
  sight), charmed by the bard and transmuted by the druid.
- **Tree `&`:** a fixed blocker. It cannot be pushed, pulled or swapped, blocks walking, beams and
  breath, never falls, and presses a plate it stands on. The druid can transmute it.
- **Sign `!`:** like a tree, but it does not press plates and cannot be transmuted.
- **Mirror `/` `\`:** a movable object; it keeps its facing when pushed or pulled. It presses
  plates. It is not swapped by the wizard and not charmed or transmuted. It does not hold up
  anything above it, even when sunk. A closing gate can smash it.

## Plates and gates

- **Plate `_`** is pressed while any living hero, monster, crystal, boulder, mirror or tree is
  on it (not a sign). Plates and gates come in flavors (numbers in the lists).
- **Gate:** `%` closed, `'` open. A closed gate blocks walking, pushing and every beam at its
  layer. An open gate is like floor. A gate never moves.
- A gate is **open exactly when every plate of its flavor is pressed**; otherwise closed. An
  **inverted** gate is the reverse. A gate whose flavor has no plates never changes. Gates
  update in the same turn (stepping off a plate closes its gate before your next input).
- **Monster gate** (flavor ignored, no plates): open exactly when no living monster is left
  anywhere in the level; inverted: open while monsters live. Monsters turned into crystals do
  not count.
- **A gate closing on something** does not wait. It pushes the thing in its cell one cell along
  its closing direction, together with anything in line behind it (any number, fences ignored).
  If that push is impossible, the thing is destroyed: a hero dies (level lost), a monster dies,
  a crystal, boulder or mirror is smashed and removed.
  - Most gates close **down**: the push always fails, so whatever stands in the gate dies or is
    smashed. Never leave a hero in an open gate whose plates may be released.
  - Some close **upward**: the thing is lifted to layer 1 and stands on the closed gate.
  - Some close **sideways** (west, east or south): the thing is shoved one cell out of the gate,
    and destroyed only if it cannot move.
  - The map does not show the closing direction; the gate list gives it for every gate
    ("closes toward up", "down", "west", ...).
- **Bridge gates** sit in water at layer -1 (the map draws them like other gates; the gate
  list shows "layer -1"). Closed, one
  is floor you can walk on. Open, the cell is water again: a hero on it drowns, a rock on it
  sinks into the gate cell and is smashed when the gate closes.

## Monsters

Monsters never move on their own. Goblins `g` and dragons `d` act in the settle after every
move (not after `C`). All attacks of one check happen at once on the same board, so a goblin
that dies in a check still kills in it. They kill heroes and monsters alike; dead monsters vanish.

- **Goblin:** kills every living hero and every other monster orthogonally next to it (also
  directly above or below it), not diagonally, not across a fence edge. Its facing does not
  matter. Two goblins next to each other kill each other.
- **Dragon:** breathes in a straight line in its facing direction (listed with the dragon), at
  its layer, any distance. It never turns, even when moved. The breath passes floor, water,
  plates, doors and open gates, and stops at walls, solid ground, trees, signs, closed gates
  and the first cell holding a hero, monster, crystal or boulder. Heroes and monsters in that
  cell die (protected heroes survive and still stop the breath); a rock there stops it
  harmlessly. Two dragons facing each other with nothing between kill each other.
- **Dragon timing:** no breath at level start; the first comes after your first move. Dragons
  skip a check caused only by deaths, so a dragon kills only the first creature in its line per
  turn; the one behind dies on a later turn. After a move that changes a gate, the breath comes
  once the gate has moved: a gate closing in front of you shields you in time, a gate opening
  exposes you that same turn. Gate changes and falls in the settle bring new breaths.
- Monsters are movable things: pushed, pulled, swapped, charmed, transmuted; they press plates;
  pushed into water they drown (a goblin still attacks once from the water cell before it does).

## Mirrors

Mirror levels add the `X` input. Mirrors are objects (see Objects); a **magic** mirror also
makes reflections. A **plain** mirror makes none but bends beams like any mirror.

- **Faces.** Each mirror has two reflective faces, listed as "reflects toward A and B" (facing
  east: west and south; north: south and east; west: east and north; south: north and west).
  Its other two sides are its back.
- **Lines of sight.** From each face, a magic mirror looks in a straight line along its layer.
  The line passes floor, water, plates, doors and open gates. It stops at walls, solid ground,
  the grid edge, boulders, trees, signs, closed gates and the back of another mirror. It
  bounces off another mirror's face (arriving against face A it leaves along face B, and the
  reverse). The first hero, monster or crystal on the line is what that face sees, at distance
  k (cells counted along the line). Anything a mirror sees only after a bounce is ignored by it.
  Sunk things are not seen.
- **Choice.** A mirror reflects at most one thing: the nearer of what its two faces see. If both
  faces see different things at the same distance, the mirror is in **conflict**.
- **Reflection (mirage).** For a thing seen at distance k, its reflection is the cell reached by
  walking from the thing k cells to the mirror and k more cells out of the other face, bouncing
  off any mirror face on the way. With no other mirror on the path it is the mirror cell plus k
  cells along the other face. Reflections are previews: they never block or move anything.
- **Valid reflection:** the whole path of 2k cells meets no blocker and no hero, monster or
  crystal before its end, and the end cell is not a wall and holds no solid thing (hero,
  monster, rock, mirror, tree, sign, closed gate), even one that would itself teleport away.
  Floor, doors, plates, open gates and water are fine (over water, the thing then falls).
- **`X` is all-or-nothing.** It is refused if no mirror reflects anything, if any reflection is
  invalid, if any mirror is in conflict, or if two reflections of different things land on the
  same cell. Otherwise every reflected thing teleports to its reflection at once: the selected
  hero, other heroes, monsters and crystals alike. Then the settle runs as after any move.
- **Copies.** A thing reflected by several mirrors to different cells moves to one of them, and
  a copy appears at each other one. A hero's copy is a real hero in the same group: it moves on
  the same inputs, can push, can die, and needs its own door.
- **Merging.** Reflections that land on the same cell merge into one if they are the same thing,
  copies of one hero (same kind and group), or two crystals. Copies that meet by walking do not
  merge; they block each other.
- Wizard beams and dragon breath also bounce off mirror faces and stop at a mirror's back.

Example (mirror at (4,1) facing east, faces west and south; trader R at (4,4)):

```
    012345                012345
  0 ......              0 ......
  1 ....\.     + X  ->  1 .R..\.
  2 ......              2 ......
  3 ......              3 ......
  4 ....R.              4 ......
```

R is seen on the south face at k = 3, so it lands 3 cells west of the mirror; `X` again sends it
back. A crystal at (2,1) (west face, k = 2) would be reflected instead, to (4,3). A crystal at
(1,1) (k = 3, same as R) puts the mirror in conflict, and `X` is refused.
