# heroes1_13_v2

Size 14 x 11. Heroes: thief, warrior. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1   
    01234567890123
  0               
  1  ############ 
  2  #...###@..## 
  3  #.W.*.###%## 
  4  #...#.#._..# 
  5  #####..*...# 
  6  #...#.#._..# 
  7  #.T...###%## 
  8  #...###@..## 
  9  ############ 
 10               
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
  *  crystal

Heroes:
  thief #8 at (3,7), group 2
  warrior #9 at (3,3), group 1
Objects:
  crystal #1 at (8,5)
  crystal #6 at (5,3)
Gates:
  (10,7) flavor 0: closed, closes toward west
  (10,3) flavor 0: closed, closes toward west
Pressure plates:
  (9,6) flavor 0
  (9,4) flavor 0
Doors: (8,2), (8,8)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
