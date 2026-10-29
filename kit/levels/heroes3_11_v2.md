# heroes3_11_v2

Size 15 x 11. Heroes: druid, warrior. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1  ############# 
  2  ############# 
  3  #...&&..___## 
  4  #.D.&&.###### 
  5  #...&#&###### 
  6  #...&..#.@.## 
  7  #.W.&&.%...## 
  8  #...&..#.@.## 
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
  W  warrior
  D  druid
  &  tree

Heroes:
  druid #0 at (3,4), group 1
  warrior #4 at (3,7), group 2
Objects:
  tree #8 at (5,3)
  tree #9 at (6,3)
  tree #10 at (6,4)
  tree #11 at (5,4)
  tree #12 at (5,5)
  tree #13 at (7,5)
  tree #14 at (5,8)
  tree #15 at (5,7)
  tree #16 at (5,6)
  tree #17 at (6,7)
Gates:
  (8,7) flavor 0: closed, closes toward down
Pressure plates:
  (9,3) flavor 0
  (10,3) flavor 0
  (11,3) flavor 0
Doors: (10,6), (10,8)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
