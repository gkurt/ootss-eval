# heroes1_1

Size 15 x 7. Heroes: warrior. Mechanics: walking and pushing only.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1   ###########  
  2  #...#...*...# 
  3  #.W.#...#.@.# 
  4  #...*...#...# 
  5   ###########  
  6                
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  W  warrior
  *  crystal

Heroes:
  warrior #3 at (3,3), group 1
Objects:
  crystal #1 at (5,4)
  crystal #2 at (9,2)
Doors: (11,3)
Walls two blocks high: (5,2), (5,3)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
