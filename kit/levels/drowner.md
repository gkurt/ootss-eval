# drowner

Size 17 x 19. Heroes: warrior. Mechanics: goblins, gates, water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1      
    01234567890123456
  0 ~~~~~~~~~~~~~~~~~
  1 ~~~~~~~##~~~~~~~~
  2 ~~~~~~~#@~~~~~~~~
  3 ~~~~~~~#%~~~~~~~~
  4 ~~~~~~~#W#~~~~~~~
  5 ~~~~~~~#*#~~~~~~~
  6 ~~~~####.####~~~~
  7 ~~~~#...g...#~~~~
  8 ~~~~#.......#~~~~
  9 ~####...~...####~
 10 ~#~..g*...*g*.~#~
 11 ~####.......####~
 12 ~~~~#...*...#~~~~
 13 ~~~~#...g...#~~~~
 14 ~~~~####.####~~~~
 15 ~~~~~~~#.#~~~~~~~
 16 ~~~~~~~#~~~~~~~~~
 17 ~~~~~~~###~~~~~~~
 18 ~~~~~~~~~~~~~~~~~
```

Legend:
  .  floor
  #  wall
  ~  water
  @  door
  %  closed gate
  W  warrior
  *  crystal
  g  goblin

Heroes:
  warrior #0 at (8,4), group 1
Objects:
  crystal #1 at (8,5)
  crystal #3 at (12,10)
  goblin #4 at (8,7), facing east
  goblin #5 at (11,10), facing east
  goblin #6 at (8,13), facing east
  goblin #7 at (5,10), facing east
  crystal #8 at (8,12)
  crystal #9 at (10,10)
  crystal #10 at (6,10)
Gates:
  (8,3) flavor 3: closed, monster gate, closes toward down
Doors: (8,2)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
