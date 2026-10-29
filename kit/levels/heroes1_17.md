# heroes1_17

Size 9 x 10. Heroes: thief, warrior, wizard. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0        
    012345678
  0          
  1  *...... 
  2  ######. 
  3  WTZ.%#. 
  4  ..##@#. 
  5  ..#@@#. 
  6  #.####. 
  7  ....... 
  8  #_####. 
  9          
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  _  pressure plate
  %  closed gate
  W  warrior
  T  thief
  Z  wizard
  *  crystal

Heroes:
  warrior #1 at (1,3), group 1
  thief #2 at (2,3), group 2
  wizard #3 at (3,3), group 3
Objects:
  crystal #0 at (1,1)
Gates:
  (5,3) flavor 1: closed, closes toward down
Pressure plates:
  (2,8) flavor 1
Doors: (5,4), (4,5), (5,5)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
