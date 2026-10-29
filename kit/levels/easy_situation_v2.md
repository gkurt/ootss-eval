# easy_situation_v2

Size 10 x 10. Heroes: bard, warrior. Mechanics: water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         
    0123456789
  0 ~~~~~~~~~~
  1 ~~~~~~~~@~
  2 ~~*.....~~
  3 ~~......~~
  4 ~~...B..~~
  5 ~~......~~
  6 ~~......~~
  7 ~~.....*~~
  8 ~W~~~~~~~~
  9 ~~~~~~~~~~
```

Legend:
  .  floor
  ~  water
  @  door
  W  warrior
  B  bard
  *  crystal

Heroes:
  bard #2 at (5,4), group 2
  warrior #3 at (1,8), group 1
Objects:
  crystal #4 at (2,2)
  crystal #5 at (7,7)
Doors: (8,1), (1,8) occupied

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
