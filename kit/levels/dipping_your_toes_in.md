# dipping_your_toes_in

Size 11 x 19. Heroes: warrior. Mechanics: gates, water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1
    01234567890
  0 ~~~~~~~~~~~
  1 ~~~#####~~~
  2 ~~~#...#~~~
  3 ~~~#.*.#~~~
  4 ~~~#'''#~~~
  5 ~###%%%###~
  6 ~#........~
  7 ~#....*~.#~
  8 ~~_..~...#~
  9 ~~.W~....#~
 10 ~#.~~~.._~~
 11 ~#.~....~~~
 12 ~#......~#~
 13 ~###''~###~
 14 ~~~#%%~~~~~
 15 ~~~#.@.#~~~
 16 ~~~#...#~~~
 17 ~~~###.~~~~
 18 ~~~~~~~~~~~
```

Legend:
  .  floor
  #  wall
  ~  water
  @  door
  _  pressure plate
  %  closed gate
  '  open gate
  W  warrior
  *  crystal

Heroes:
  warrior #0 at (3,9), group 1
Objects:
  crystal #1 at (6,7)
  crystal #9 at (5,3)
Gates:
  (5,13) flavor 1: open, inverted, closes toward down
  (4,13) flavor 1: open, inverted, closes toward down
  (6,5) flavor 1: closed, closes toward down
  (5,5) flavor 1: closed, closes toward down
  (4,5) flavor 1: closed, closes toward down
  (4,4) flavor 2: open, inverted, closes toward down
  (5,4) flavor 2: open, inverted, closes toward down
  (6,4) flavor 2: open, inverted, closes toward down
  (5,14) flavor 2: closed, closes toward down
  (4,14) flavor 2: closed, closes toward down
Pressure plates:
  (8,10) flavor 1
  (2,8) flavor 2
Doors: (5,15)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
