# heroes2_20

Size 13 x 10. Heroes: cleric, thief, wizard. Mechanics: goblins.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1  
    0123456789012
  0              
  1  ########### 
  2  ##.C#####g# 
  3  #g....g.T.# 
  4  ##.Z#####.# 
  5  #####g###.# 
  6  #.@..*...g# 
  7  #@.@#g##### 
  8  ########### 
  9              
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  T  thief
  Z  wizard
  C  cleric
  *  crystal
  g  goblin

Heroes:
  thief #0 at (9,3), group 2
  wizard #2 at (4,4), group 3
  cleric #4 at (4,2), group 1
Objects:
  goblin #1 at (10,2), facing south
  goblin #3 at (7,3), facing east
  goblin #5 at (2,3), facing east
  goblin #6 at (6,5), facing south
  crystal #8 at (6,6)
  goblin #9 at (10,6), facing north
  goblin #12 at (6,7), facing north
Doors: (3,6), (2,7), (4,7)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
