# heroes2_18

Size 13 x 13. Heroes: cleric, thief. Mechanics: goblins.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1  
    0123456789012
  0              
  1  ########### 
  2  #.T.##g#g## 
  3  #.........# 
  4  #.C.#g#g..# 
  5  ########.## 
  6  #@..####.g# 
  7  #@#.g###.## 
  8  ###.###g..# 
  9  #g..g#....# 
 10  ##.......g# 
 11  ########### 
 12              
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  T  thief
  C  cleric
  g  goblin

Heroes:
  thief #0 at (3,2), group 1
  cleric #3 at (3,4), group 2
Objects:
  goblin #1 at (7,2), facing west
  goblin #2 at (9,2), facing south
  goblin #4 at (6,4), facing east
  goblin #5 at (8,4), facing west
  goblin #7 at (10,6), facing west
  goblin #9 at (5,7), facing south
  goblin #10 at (8,8), facing east
  goblin #11 at (2,9), facing east
  goblin #12 at (5,9), facing west
  goblin #13 at (10,10), facing north
Doors: (2,6), (2,7)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
