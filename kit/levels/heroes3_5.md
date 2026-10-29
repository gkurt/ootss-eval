# heroes3_5

Size 19 x 7. Heroes: bard, warrior. Mechanics: goblins, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1        
    0123456789012345678
  0                    
  1       ############ 
  2  .    #.g..W...#@# 
  3       #........'.# 
  4       #.g..B...#@# 
  5       ############ 
  6                    
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  '  open gate
  W  warrior
  B  bard
  g  goblin

Heroes:
  warrior #1 at (11,2), group 1
  bard #6 at (11,4), group 2
Objects:
  goblin #3 at (8,2), facing south
  goblin #8 at (8,4), facing north
Gates:
  (15,3) flavor 0: open, closes toward down
Pressure plates:
  (11,2) flavor 0, pressed
  (11,4) flavor 0, pressed
Doors: (16,2), (16,4)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
