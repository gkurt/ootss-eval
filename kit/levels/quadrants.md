# quadrants

Size 9 x 9. Heroes: thief, wizard. Mechanics: gates, water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0        
    012345678
  0 ~~~~~~~~~
  1 ~T.Z~@.@~
  2 ~._.~...~
  3 ~...~...~
  4 ~'''~'''~
  5 ~...'...~
  6 ~._.'._.~
  7 ~*..'...~
  8 ~~~~~~~~~
```

Legend:
  .  floor
  ~  water
  @  door
  _  pressure plate
  '  open gate
  T  thief
  Z  wizard
  *  crystal

Heroes:
  wizard #0 at (3,1), group 2
  thief #7 at (1,1), group 1
Objects:
  crystal #1 at (1,7)
Gates:
  (4,7, layer -1) flavor 2: open, inverted, closes toward down
  (7,4, layer -1) flavor 1: open, inverted, closes toward down
  (1,4, layer -1) flavor 4: open, inverted, closes toward down
  (2,4, layer -1) flavor 4: open, inverted, closes toward down
  (3,4, layer -1) flavor 4: open, inverted, closes toward down
  (4,6, layer -1) flavor 2: open, inverted, closes toward down
  (4,5, layer -1) flavor 2: open, inverted, closes toward down
  (6,4, layer -1) flavor 1: open, inverted, closes toward down
  (5,4, layer -1) flavor 1: open, inverted, closes toward down
Pressure plates:
  (2,2) flavor 2
  (2,6) flavor 1
  (6,6) flavor 4
Doors: (7,1), (5,1)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
