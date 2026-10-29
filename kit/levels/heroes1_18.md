# heroes1_18

Size 13 x 9. Heroes: thief, warrior, wizard. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1  
    0123456789012
  0              
  1  ...#T.Z#... 
  2  .*.#.W.#.@. 
  3  ...#...#... 
  4  #%#.#.#.#%# 
  5  ...#...#... 
  6  ._..._..._. 
  7  ...#...#... 
  8              
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
  warrior #3 at (6,2), group 3
  thief #4 at (5,1), group 1
  wizard #5 at (7,1), group 2
Objects:
  crystal #2 at (2,2)
Gates:
  (2,4) flavor 0: closed, closes toward east
  (10,4) flavor 0: closed, closes toward west
Pressure plates:
  (2,6) flavor 0
  (6,6) flavor 0
  (10,6) flavor 0
Doors: (5,1) occupied, (7,1) occupied, (10,2)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
