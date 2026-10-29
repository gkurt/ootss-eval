# heroes3_1_v3

Size 20 x 14. Heroes: bard. Mechanics: goblins.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         
    01234567890123456789
  0                     
  1  ################## 
  2  ################## 
  3  #...############## 
  4  #.@...........#### 
  5  #g..#########.#### 
  6  #####......##.#### 
  7  ###....#.#.##.#### 
  8  ####.......##g#### 
  9  ###....###.##.#### 
 10  ###..B.###.##.#### 
 11  ###....###....#### 
 12  ################## 
 13                     
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  B  bard
  g  goblin

Heroes:
  bard #1 at (6,10), group 1
Objects:
  goblin #2 at (14,8), facing south
  goblin #3 at (2,5), facing east
Doors: (3,4)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
