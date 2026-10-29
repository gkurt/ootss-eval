# one_fire_v2

Size 9 x 14. Heroes: thief, warrior. Mechanics: goblins, dragons, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).
In this level a hero standing above layer 0 (for example on a wall) may step out over water. From layer 0, heroes still refuse to step into water.

```
    0        
    012345678
  0          
  1  ####### 
  2  ###.d.# 
  3  #*..#.# 
  4  #..W..# 
  5  #..T..# 
  6  #_....# 
  7  #####.# 
  8  #.%.'.# 
  9  #.###g# 
 10  #@###.# 
 11  #@###g# 
 12  ####### 
 13          
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  _  pressure plate
  %  closed gate
  '  open gate
  W  warrior
  T  thief
  *  crystal
  g  goblin
  d  dragon

Heroes:
  thief #4 at (4,5), group 2
  warrior #5 at (4,4), group 1
Objects:
  dragon #0 at (5,2), facing south
  crystal #1 at (2,3)
  goblin #8 at (6,11), facing north
  goblin #9 at (6,9), facing north
Gates:
  (3,8) flavor 1: closed, closes toward down
  (5,8) flavor 4: open, closes toward down
Pressure plates:
  (2,6) flavor 1
  (6,11) flavor 4, pressed
Doors: (2,11), (2,10)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
