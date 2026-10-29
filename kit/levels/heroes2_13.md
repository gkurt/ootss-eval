# heroes2_13

Size 13 x 9. Heroes: cleric. Mechanics: goblins, dragons.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1  
    0123456789012
  0              
  1  ########### 
  2  #...#g#g#g# 
  3  #.C.......# 
  4  #*.*g#g#g.# 
  5  #.*@*###*.# 
  6  #d........# 
  7  ########### 
  8              
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  C  cleric
  *  crystal
  g  goblin
  d  dragon

Heroes:
  cleric #3 at (3,3), group 1
Objects:
  goblin #0 at (6,2), facing south
  goblin #1 at (8,2), facing south
  goblin #2 at (10,2), facing south
  goblin #4 at (7,4), facing north
  crystal #5 at (2,4)
  crystal #6 at (3,5)
  crystal #7 at (4,4)
  crystal #8 at (5,5)
  crystal #9 at (9,5)
  dragon #10 at (2,6), facing east
  goblin #12 at (5,4), facing north
  goblin #13 at (9,4), facing north
Doors: (4,5)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
