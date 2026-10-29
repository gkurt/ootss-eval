# heroes2_15

Size 14 x 9. Heroes: cleric, warrior. Mechanics: goblins.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1   
    01234567890123
  0               
  1  ############ 
  2  #W.C#.g#g### 
  3  #...#......# 
  4  ##.##.##g..# 
  5  #g....g#@.@# 
  6  #...#.##.g.# 
  7  ############ 
  8               
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  W  warrior
  C  cleric
  g  goblin

Heroes:
  warrior #2 at (2,2), group 1
  cleric #4 at (4,2), group 2
Objects:
  goblin #0 at (7,2), facing east
  goblin #1 at (9,2), facing west
  goblin #3 at (9,4), facing north
  goblin #5 at (7,5), facing west
  goblin #8 at (10,6), facing north
  goblin #9 at (2,5), facing east
Doors: (9,5), (11,5)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
