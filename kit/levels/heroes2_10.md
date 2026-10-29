# heroes2_10

Size 13 x 9. Heroes: thief. Mechanics: dragons, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1  
    0123456789012
  0              
  1  #######   # 
  2  #d...d##### 
  3  #.....#...# 
  4  #.....%.@.# 
  5  #.T.*.#...# 
  6  #.....##### 
  7  #######   # 
  8              
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  %  closed gate
  T  thief
  *  crystal
  d  dragon

Heroes:
  thief #4 at (3,5), group 1
Objects:
  dragon #0 at (2,2), facing west
  dragon #1 at (6,2), facing east
  crystal #5 at (5,5)
Gates:
  (7,4) flavor 2: closed, monster gate, closes toward down
Doors: (9,4)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
