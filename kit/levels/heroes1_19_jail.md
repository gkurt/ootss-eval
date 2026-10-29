# heroes1_19_jail

Size 9 x 9. Heroes: thief, warrior, wizard. Mechanics: walking and pushing only.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0        
    012345678
  0          
  1  ####### 
  2  ##*#*## 
  3  #..Z..# 
  4  #.@@@.# 
  5  #.....# 
  6  #T###W# 
  7  ####### 
  8          
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  W  warrior
  T  thief
  Z  wizard
  *  crystal

Heroes:
  thief #2 at (2,6), group 2
  wizard #3 at (4,3), group 1
  warrior #4 at (6,6), group 3
Objects:
  crystal #8 at (3,2)
  crystal #9 at (5,2)
Doors: (5,4), (4,4), (3,4)
Fences (block walking and pushing across that edge): (6,6) north edge, (2,6) north edge

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
