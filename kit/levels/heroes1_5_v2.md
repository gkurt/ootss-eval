# heroes1_5_v2

Size 15 x 11. Heroes: thief. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1  ############# 
  2  #...#*..#...# 
  3  #T..*...#.*.# 
  4  #...#..*....# 
  5  ##########.## 
  6  #..**...#...# 
  7  #.@.#...#._.# 
  8  #...#...%.*.# 
  9  ############# 
 10                
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  _  pressure plate
  %  closed gate
  T  thief
  *  crystal

Heroes:
  thief #4 at (2,3), group 1
Objects:
  crystal #0 at (8,4)
  crystal #1 at (11,8)
  crystal #2 at (5,3)
  crystal #3 at (5,6)
  crystal #5 at (6,2)
  crystal #8 at (4,6)
  crystal #9 at (11,3)
Gates:
  (9,8) flavor 0: closed, closes toward down
Pressure plates:
  (11,7) flavor 0
Doors: (3,7)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
