# heroes2_17

Size 11 x 9. Heroes: cleric, wizard. Mechanics: goblins, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1
    01234567890
  0            
  1  ######### 
  2  #Z...g### 
  3  #.....#.@ 
  4  #..C..%.. 
  5  #.....#.@ 
  6  #g...g### 
  7  ######### 
  8            
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
  wizard #0 at (2,2), group 1
  cleric #3 at (4,4), group 2
Objects:
  goblin #1 at (6,2), facing west
  goblin #6 at (2,6), facing north
  goblin #7 at (6,6), facing north
Gates:
  (7,4) flavor 2: closed, monster gate, closes toward down
Doors: (9,3), (9,5)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
