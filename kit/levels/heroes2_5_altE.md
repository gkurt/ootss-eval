# heroes2_5_altE

Size 15 x 12. Heroes: warrior. Mechanics: goblins, dragons.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1  ############# 
  2  ##@.........# 
  3  ##..........# 
  4  #d..........# 
  5  ##.....#....# 
  6  ##.....#....# 
  7  ##.....##g### 
  8  ##.....#.*..# 
  9  ####d###...W# 
 10  ############# 
 11                
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  W  warrior
  *  crystal
  g  goblin
  d  dragon

Heroes:
  warrior #2 at (12,9), group 1
Objects:
  dragon #0 at (5,9), facing north
  crystal #1 at (10,8)
  dragon #3 at (2,4), facing east
  goblin #5 at (10,7), facing south
Doors: (3,2)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
