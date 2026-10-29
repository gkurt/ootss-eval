# heroes1_12_v2_alt

Size 15 x 11. Heroes: thief, wizard. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1  ############# 
  2  #####Z...*### 
  3  #######.##### 
  4  #@.#........# 
  5  #..%T_....#_# 
  6  #@.#........# 
  7  ######..##### 
  8  #######.*#### 
  9  ############# 
 10                
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  _  pressure plate
  %  closed gate
  T  thief
  Z  wizard
  *  crystal

Heroes:
  thief #1 at (5,5), group 2
  wizard #2 at (6,2), group 1
Objects:
  crystal #0 at (10,2)
  crystal #3 at (9,8)
Gates:
  (4,5) flavor 4: closed, closes toward down
Pressure plates:
  (6,5) flavor 4
  (12,5) flavor 4
Doors: (2,4), (2,6)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
