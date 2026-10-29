# heroes2_17_intro

Size 12 x 12. Heroes: cleric, wizard. Mechanics: goblins, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1 
    012345678901
  0             
  1     .       
  2             
  3             
  4  #########  
  5  #g...g#### 
  6  #.....#.@# 
  7  #.Z.C.%..# 
  8  #.....#.@# 
  9  #g...g#### 
 10  #########  
 11             
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  %  closed gate
  Z  wizard
  C  cleric
  g  goblin

Heroes:
  wizard #0 at (3,7), group 1
  cleric #3 at (5,7), group 2
Objects:
  goblin #1 at (6,5), facing south
  goblin #6 at (2,9), facing north
  goblin #7 at (6,9), facing north
  goblin #8 at (2,5), facing south
Gates:
  (7,7) flavor 2: closed, monster gate, closes toward down
Doors: (9,6), (9,8)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
