# dunk_tank_alt

Size 21 x 8. Heroes: thief, wizard. Mechanics: dragons, gates, water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         2
    012345678901234567890
  0 ~~~~~~~~~~~~~~~~~~~~~
  1 ~##~~~~~....~~~~~###~
  2 ~.....'.....~~~....#~
  3 ~Z...~~~....~~~..@.#~
  4 ~T...~~~....~~~..@.#~
  5 ~....~~~....d'.....#~
  6 ~~~~~~~~._..~~~~~~~~~
  7 ~~~~~~~~~~~~~~~~~~~~~
```

Legend:
  .  floor
  #  wall
  ~  water
  @  door
  _  pressure plate
  '  open gate
  T  thief
  Z  wizard
  d  dragon

Heroes:
  wizard #2 at (1,3), group 1
  thief #3 at (1,4), group 2
Objects:
  dragon #0 at (12,5), facing south
Gates:
  (6,2, layer -1) flavor 2: open, inverted, closes toward down
  (13,5, layer -1) flavor 3: open, inverted, monster gate, closes toward down
Pressure plates:
  (9,6) flavor 2
Doors: (17,4), (17,3)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
