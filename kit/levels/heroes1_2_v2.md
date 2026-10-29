# heroes1_2_v2

Size 15 x 11. Heroes: warrior. Mechanics: walking and pushing only.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1  ############# 
  2  #...#...#...# 
  3  #W..**....**# 
  4  #...#...#...# 
  5  ##########*## 
  6  #...#...#...# 
  7  #.@*..****..# 
  8  #...#...#...# 
  9  ############# 
 10                
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  W  warrior
  *  crystal

Heroes:
  warrior #0 at (2,3), group 1
Objects:
  crystal #1 at (6,3)
  crystal #2 at (4,7)
  crystal #3 at (7,7)
  crystal #4 at (9,7)
  crystal #5 at (11,5)
  crystal #6 at (5,3)
  crystal #7 at (8,7)
  crystal #8 at (10,7)
  crystal #9 at (11,3)
  crystal #10 at (12,3)
Doors: (3,7)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
