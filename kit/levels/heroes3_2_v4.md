# heroes3_2_v4

Size 14 x 14. Heroes: bard. Mechanics: goblins, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1   
    01234567890123
  0               
  1  ############ 
  2  #..........# 
  3  #..........# 
  4  #..........# 
  5  ####.####..# 
  6  #..#.#.B#..# 
  7  #..#.#.##..# 
  8  #..#...#@'g# 
  9  #..######..# 
 10  #..........# 
 11  #..........# 
 12  ############ 
 13               
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  '  open gate
  B  bard
  g  goblin

Heroes:
  bard #0 at (8,6), group 1
Objects:
  goblin #4 at (11,8), facing east
Gates:
  (10,8) flavor 4: open, closes toward down
Pressure plates:
  (8,6) flavor 4, pressed
Doors: (9,8)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
