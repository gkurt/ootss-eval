# heroes2_2

Size 15 x 13. Heroes: warrior. Mechanics: goblins.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1      .         
  2                
  3  ############# 
  4  #W.g.......g# 
  5  #...g.......# 
  6  #.......g...# 
  7  #g..........# 
  8  #....g......# 
  9  #g.......g..# 
 10  #.g.....g.@.# 
 11  ############# 
 12                
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
  goblin #1 at (4,4), facing west
  goblin #2 at (12,4), facing west
  goblin #3 at (5,5), facing west
  goblin #4 at (9,6), facing south
  goblin #5 at (2,7), facing south
  goblin #6 at (6,8), facing west
  goblin #7 at (2,9), facing east
  goblin #8 at (10,9), facing west
  goblin #9 at (3,10), facing east
  goblin #10 at (9,10), facing west
Doors: (11,10)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
