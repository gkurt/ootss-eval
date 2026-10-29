# detonator

Size 23 x 15. Heroes: thief, warrior. Mechanics: dragons, gates, water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         2  
    01234567890123456789012
  0 ~~~~~~~~~~~~~~~~~~~~~~~
  1 ~.....~~~.....~~~~~~~~~
  2 ~.....~~~.*...~~~~~~~~~
  3 ~.._..'''.....~~~~~~~~~
  4 ~.....~~~....W~~~~~~~~~
  5 ~..T..~~~.....~~~~~~~~~
  6 ~~~~~~~~~~~'~~~~~~~~~~~
  7 ~~~~~~~~~~~'~~~~~~~~~~~
  8 ~~~~~~~~~~~'~~~~~~~~~~~
  9 ~~~~~~~~~.....~~~.....~
 10 ~~~~~~~~~.....~~~.....~
 11 ~~~~~~~~~..d..%%%.@.@.~
 12 ~~~~~~~~~.....~~~.....~
 13 ~~~~~~~~~.....~~~..d..~
 14 ~~~~~~~~~~~~~~~~~~~~~~~
```

Legend:
  .  floor
  ~  water
  @  door
  _  pressure plate
  %  closed gate
  '  open gate
  W  warrior
  T  thief
  *  crystal
  d  dragon

Heroes:
  warrior #16 at (13,4), group 1
  thief #17 at (3,5), group 2
Objects:
  crystal #0 at (10,2)
  dragon #14 at (11,11), facing west
  dragon #15 at (19,13), facing south
Gates:
  (6,3, layer -1) flavor 1: open, closes toward down
  (7,3, layer -1) flavor 1: open, closes toward down
  (8,3, layer -1) flavor 1: open, closes toward down
  (11,6, layer -1) flavor 0: open, inverted, closes toward down
  (11,7, layer -1) flavor 0: open, inverted, closes toward down
  (11,8, layer -1) flavor 0: open, inverted, closes toward down
  (16,11, layer -1) flavor 0: closed, closes toward down
  (15,11, layer -1) flavor 0: closed, closes toward down
  (14,11, layer -1) flavor 0: closed, closes toward down
Pressure plates:
  (3,3) flavor 0
  (11,11) flavor 1, pressed
Doors: (18,11), (20,11)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
