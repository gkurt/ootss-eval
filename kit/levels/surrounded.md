# surrounded

Size 24 x 21. Heroes: warrior. Mechanics: goblins, dragons, gates, water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         2   
    012345678901234567890123
  0 ~~~~~~~~~~~~~~~~~~~~~~~~
  1 ~~~~~~~.........~~~~~~~~
  2 ~~~~~~~.g..g..g.~~~~~~~~
  3 ~~~~~~~.........~~~~~~~~
  4 ~.~~~~~~~~~~~~~~~~~~~~~~
  5 ~..~~~~~~~~~~~~~~~~~~.~~
  6 ~....~~.........~~.....~
  7 ~....~~.....W...~~....~~
  8 ~..g.~~.........~~.g..~~
  9 ~....~~.......d.~~....~~
 10 ~..g.~~.d.......~~.g..~~
 11 ~....~~...d.....~~....~~
 12 ~..g.~~.........~~.g..~~
 13 ~....~~...d.....~~....~~
 14 ~..g.~~.........~~....~~
 15 ~~~~~~~~~~~'~~~~~~~~~~~~
 16 ~~~~~~~~~~~'~~~~~~~~~~~~
 17 ~~~~~~...........~~~~~~~
 18 ~~~~~~.g.g.@g.g..~~~~~~~
 19 ~~~~~~...........~~~~~~~
 20 ~~~~~~~~~~~~~~~~~~~~~~~~
```

Legend:
  .  floor
  ~  water
  @  door
  '  open gate
  W  warrior
  g  goblin
  d  dragon

Heroes:
  warrior #18 at (12,7), group 1
Objects:
  goblin #0 at (14,18), facing north
  dragon #1 at (8,10), facing south
  dragon #2 at (10,11), facing north
  goblin #3 at (12,18), facing north
  goblin #4 at (9,18), facing north
  goblin #5 at (19,12), facing west
  goblin #6 at (19,10), facing west
  goblin #7 at (19,8), facing west
  goblin #8 at (8,2), facing south
  goblin #9 at (3,10), facing east
  goblin #10 at (3,12), facing east
  goblin #11 at (3,14), facing east
  goblin #12 at (3,8), facing east
  goblin #13 at (14,2), facing south
  goblin #14 at (7,18), facing north
  dragon #19 at (14,9), facing west
  dragon #20 at (10,13), facing east
  goblin #21 at (11,2), facing south
Gates:
  (11,15, layer -1) flavor 3: open, inverted, monster gate, closes toward down
  (11,16, layer -1) flavor 3: open, inverted, monster gate, closes toward down
Doors: (11,18)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
