# heroes2_10.5

Size 19 x 12. Heroes: wizard. Mechanics: goblins, dragons, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1        
    0123456789012345678
  0                    
  1  ###########       
  2  #.g.......#       
  3  #...g.....#       
  4  #.........#       
  5  #g........####### 
  6  #........g.g.g'd# 
  7  #''''#....####### 
  8  #....#....#       
  9  #..@.#.Z..#       
 10  ###########       
 11                    
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  '  open gate
  Z  wizard
  g  goblin
  d  dragon

Heroes:
  wizard #12 at (8,9), group 1
Objects:
  dragon #1 at (16,6), facing west
  goblin #2 at (5,3), facing west
  goblin #3 at (12,6), facing east
  goblin #4 at (14,6), facing east
  goblin #11 at (3,2), facing south
  goblin #13 at (2,5), facing east
  goblin #14 at (10,6), facing east
Gates:
  (15,6) flavor 2: open, closes toward up
  (4,7) flavor 2: open, closes toward up
  (5,7) flavor 2: open, closes toward up
  (2,7) flavor 2: open, closes toward up
  (3,7) flavor 2: open, closes toward up
Pressure plates:
  (3,2) flavor 2, pressed
Doors: (4,9)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
