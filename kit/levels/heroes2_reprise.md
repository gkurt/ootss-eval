# heroes2_reprise

Size 11 x 10. Heroes: cleric, warrior. Mechanics: goblins, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1
    01234567890
  0            
  1  ######### 
  2  #.W...#@# 
  3  #C...*#@# 
  4  #...g.#%# 
  5  #..g....# 
  6  #..___..# 
  7  #.......# 
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
  W  warrior
  C  cleric
  *  crystal
  g  goblin

Heroes:
  cleric #5 at (2,3), group 2
  warrior #6 at (3,2), group 1
Objects:
  goblin #7 at (5,4), facing south
  goblin #8 at (4,5), facing south
  crystal #10 at (6,3)
Gates:
  (8,4) flavor 0: closed, closes toward down
Pressure plates:
  (4,6) flavor 0
  (6,6) flavor 0
  (5,6) flavor 0
Doors: (8,2), (8,3)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
