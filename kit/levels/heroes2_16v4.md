# heroes2_16v4

Size 14 x 9. Heroes: cleric, thief. Mechanics: dragons, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1   
    01234567890123
  0               
  1  # ########## 
  2  ###..T..#C## 
  3  ###.*._...d# 
  4  #.%.......d# 
  5  #@#.*._...d# 
  6  ###.....#@## 
  7    ########## 
  8               
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  _  pressure plate
  %  closed gate
  T  thief
  C  cleric
  *  crystal
  d  dragon

Heroes:
  thief #0 at (6,2), group 1
  cleric #1 at (10,2), group 2
Objects:
  crystal #3 at (5,3)
  dragon #4 at (11,3), facing west
  crystal #7 at (5,5)
  dragon #9 at (11,5), facing west
  dragon #11 at (11,4), facing west
Gates:
  (3,4) flavor 0: closed, closes toward down
Pressure plates:
  (7,3) flavor 0
  (7,5) flavor 0
Doors: (2,5), (10,6)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
