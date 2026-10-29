# heroes2_21b

Size 11 x 10. Heroes: cleric, thief, wizard. Mechanics: goblins, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1
    01234567890
  0            
  1  ######### 
  2  ##g#g#g## 
  3  #T%.%.%.# 
  4  ##_#_#_.# 
  5  #.......# 
  6  #.Z.*.C.# 
  7  #.@.@.@.# 
  8  ######### 
  9            
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  _  pressure plate
  %  closed gate
  T  thief
  Z  wizard
  C  cleric
  *  crystal
  g  goblin

Heroes:
  thief #3 at (2,3), group 1
  wizard #10 at (3,6), group 2
  cleric #15 at (7,6), group 3
Objects:
  goblin #0 at (3,2), facing south
  goblin #1 at (5,2), facing south
  goblin #2 at (7,2), facing south
  crystal #12 at (5,6)
Gates:
  (3,3) flavor 0: closed, closes toward down
  (5,3) flavor 0: closed, closes toward down
  (7,3) flavor 0: closed, closes toward down
Pressure plates:
  (3,4) flavor 0
  (5,4) flavor 0
  (7,4) flavor 0
Doors: (3,7), (5,7), (7,7)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
