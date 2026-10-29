# dont_push_the_button

Size 21 x 12. Heroes: warrior. Mechanics: dragons, gates, water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         2
    012345678901234567890
  0 ~~~~~~~~~~~~~~~~~~~~~
  1 ~#####~~~~~~~#######~
  2 ~#..~~~~~~~~~~~..###~
  3 ~#.*~~.......~~..~.#~
  4 ~#..~~.~...~..''.~@#~
  5 ~~......___~..''.~.#~
  6 ~#..~W..~..._.''.~.#~
  7 ~#..~~....~...''.~.#~
  8 ~#.*~~.......~~..~.#~
  9 ~#..~~~~~~~~~~~d.###~
 10 ~###~~~###~~~~~~~~~~~
 11 ~~~~~~~~~~~~~~~~~~~~~
```

Legend:
  .  floor
  #  wall
  ~  water
  @  door
  _  pressure plate
  '  open gate
  W  warrior
  *  crystal
  d  dragon

Heroes:
  warrior #5 at (5,6), group 1
Objects:
  crystal #7 at (3,3)
  crystal #8 at (3,8)
  dragon #9 at (15,9), facing west
Gates:
  (15,4) flavor 1: open, inverted, closes toward down
  (15,6) flavor 4: open, inverted, closes toward down
  (15,5) flavor 2: open, inverted, closes toward down
  (15,7) flavor 0: open, inverted, closes toward down
  (14,5, layer -1) flavor 2: open, inverted, closes toward east
  (14,4, layer -1) flavor 1: open, inverted, closes toward east
  (14,6, layer -1) flavor 4: open, inverted, closes toward east
  (14,7, layer -1) flavor 0: open, inverted, closes toward east
Pressure plates:
  (8,5) flavor 2
  (10,5) flavor 4
  (9,5) flavor 1
  (12,6) flavor 0
Doors: (18,4)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
