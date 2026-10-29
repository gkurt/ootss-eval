# heroes3_3_v2

Size 16 x 12. Heroes: bard. Mechanics: walking and pushing only.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1     
    0123456789012345
  0                 
  1  #############  
  2  #############  
  3  #..##########  
  4  #B.....*..#### 
  5  #..######.#### 
  6  #########.#### 
  7  #@#######.#### 
  8  #...**.......# 
  9  ###########..# 
 10  ############## 
 11                 
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  B  bard
  *  crystal

Heroes:
  bard #1 at (2,4), group 1
Objects:
  crystal #2 at (8,4)
  crystal #3 at (5,8)
  crystal #4 at (6,8)
Doors: (2,7)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
