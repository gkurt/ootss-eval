# heroes1_11_v2

Size 11 x 11. Heroes: warrior, wizard. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1
    01234567890
  0            
  1  ######### 
  2  #...#...# 
  3  #*#..._.# 
  4  #@#W#...# 
  5  ######%## 
  6  #*#Z#...# 
  7  #@#..._.# 
  8  #...#...# 
  9  ######### 
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
  Z  wizard
  *  crystal

Heroes:
  wizard #3 at (4,6), group 2
  warrior #5 at (4,4), group 1
Objects:
  crystal #6 at (2,3)
  crystal #7 at (2,6)
Gates:
  (7,5) flavor 0: closed, closes toward down
Pressure plates:
  (7,3) flavor 0
  (7,7) flavor 0
Doors: (2,7), (2,4)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
