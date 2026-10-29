# heroes2_2b

Size 15 x 9. Heroes: warrior. Mechanics: goblins.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1   ###########  
  2  ##.........g# 
  3  #...........# 
  4  #W....g..#.@# 
  5  #...........# 
  6  ##.........g# 
  7   ############ 
  8                
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  W  warrior
  g  goblin

Heroes:
  warrior #0 at (2,4), group 1
Objects:
  goblin #1 at (7,4), facing east
  goblin #2 at (12,2), facing south
  goblin #3 at (12,6), facing north
Doors: (12,4)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
