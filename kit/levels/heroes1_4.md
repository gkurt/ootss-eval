# heroes1_4

Size 11 x 10. Heroes: warrior. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1
    01234567890
  0            
  1  ######### 
  2  #.....#@# 
  3  #.W*..#%# 
  4  #.**....# 
  5  #...&...# 
  6  #&_._._.# 
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
  *  crystal
  &  tree

Heroes:
  warrior #4 at (3,3), group 1
Objects:
  tree #1 at (5,5)
  tree #2 at (2,6)
  crystal #3 at (4,3)
  crystal #8 at (4,4)
  crystal #9 at (3,4)
Gates:
  (8,3) flavor 0: closed, closes toward down
Pressure plates:
  (3,6) flavor 0
  (5,6) flavor 0
  (7,6) flavor 0
Doors: (8,2)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
