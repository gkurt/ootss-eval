# heroes1_3

Size 15 x 7. Heroes: warrior. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1  ############# 
  2  #...#...#...# 
  3  #W_...*.#.@.# 
  4  #...#...%...# 
  5  ############# 
  6                
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  _  pressure plate
  %  closed gate
  W  warrior
  *  crystal

Heroes:
  warrior #0 at (2,3), group 1
Objects:
  crystal #1 at (7,3)
Gates:
  (9,4) flavor 0: closed, closes toward up
Pressure plates:
  (3,3) flavor 0
Doors: (11,3)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
