# heroes1_8_v2

Size 15 x 11. Heroes: wizard. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1  ############# 
  2  #.......#...# 
  3  #Z*.#.......# 
  4  #.......#...# 
  5  ######.###.## 
  6  #...#...#...# 
  7  #.@.%.......# 
  8  #...#...#.._# 
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
  Z  wizard
  *  crystal

Heroes:
  wizard #4 at (2,3), group 1
Objects:
  crystal #2 at (3,3)
Gates:
  (5,7) flavor 0: closed, closes toward down
Pressure plates:
  (12,8) flavor 0
Doors: (3,7)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
