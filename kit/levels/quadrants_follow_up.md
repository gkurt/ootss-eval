# quadrants_follow_up

Size 20 x 8. Heroes: thief. Mechanics: gates, water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         
    01234567890123456789
  0 ~~~~~~~~~~~~~~~~~~~~
  1 ~#####~#####~~#####~
  2 ~.....~.._..~~.....~
  3 ~..T..'.....''..@.*~
  4 ~_....'....*''.....~
  5 ~..T..'.....''..@.*~
  6 ~.....~.....~~.....~
  7 ~~~~~~~~~~~~~~~~~~~~
```

Legend:
  .  floor
  #  wall
  ~  water
  @  door
  _  pressure plate
  '  open gate
  T  thief
  *  crystal

Heroes:
  thief #14 at (3,5), group 2
  thief #16 at (3,3), group 1
Objects:
  crystal #11 at (11,4)
  crystal #12 at (18,5)
  crystal #13 at (18,3)
Gates:
  (6,4, layer -1) flavor 2: open, inverted, closes toward down
  (12,4, layer -1) flavor 1: open, inverted, closes toward down
  (13,4, layer -1) flavor 1: open, inverted, closes toward down
  (6,5, layer -1) flavor 2: open, inverted, closes toward down
  (6,3, layer -1) flavor 2: open, inverted, closes toward down
  (12,5, layer -1) flavor 1: open, inverted, closes toward down
  (13,5, layer -1) flavor 1: open, inverted, closes toward down
  (12,3, layer -1) flavor 1: open, inverted, closes toward down
  (13,3, layer -1) flavor 1: open, inverted, closes toward down
Pressure plates:
  (1,4) flavor 2
  (9,2) flavor 1
Doors: (16,3), (16,5)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
