# heroes2_14

Size 13 x 9. Heroes: cleric, wizard. Mechanics: goblins.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1  
    0123456789012
  0              
  1  ########### 
  2  #Z#######@# 
  3  #.#g#g#g#.# 
  4  #.........# 
  5  #.##g#g##.# 
  6  #C#######@# 
  7  ########### 
  8              
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  Z  wizard
  C  cleric
  g  goblin

Heroes:
  wizard #0 at (2,2), group 1
  cleric #7 at (2,6), group 2
Objects:
  goblin #2 at (4,3), facing east
  goblin #3 at (6,3), facing west
  goblin #4 at (8,3), facing west
  goblin #5 at (5,5), facing east
  goblin #6 at (7,5), facing west
Doors: (10,2), (10,6)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
