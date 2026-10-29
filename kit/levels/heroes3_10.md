# heroes3_10

Size 16 x 12. Heroes: druid, thief. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1     
    0123456789012345
  0                 
  1     .           
  2                 
  3                 
  4  ############## 
  5  #.&&&&&&&&&&&# 
  6  #.%._.T.&.D.&# 
  7  #.&&&&&&&&&.&# 
  8  #....@.@..&.&# 
  9  ##########&&&# 
 10           ##### 
 11                 
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  _  pressure plate
  %  closed gate
  T  thief
  D  druid
  &  tree

Heroes:
  thief #7 at (7,6), group 1
  druid #9 at (11,6), group 2
Objects:
  tree #0 at (10,7)
  tree #1 at (9,7)
  tree #2 at (6,7)
  tree #3 at (11,5)
  tree #4 at (12,5)
  tree #8 at (9,6)
  tree #10 at (7,5)
  tree #11 at (13,6)
  tree #14 at (11,8)
  tree #15 at (5,5)
  tree #16 at (12,9)
  tree #17 at (8,5)
  tree #18 at (10,5)
  tree #19 at (3,7)
  tree #20 at (8,7)
  tree #21 at (6,5)
  tree #22 at (13,7)
  tree #23 at (11,7)
  tree #24 at (9,5)
  tree #25 at (4,5)
  tree #26 at (7,7)
  tree #27 at (13,5)
  tree #28 at (13,9)
  tree #29 at (3,5)
  tree #30 at (4,7)
  tree #31 at (11,9)
  tree #32 at (13,8)
  tree #33 at (5,7)
Gates:
  (3,6) flavor 0: closed, closes toward down
Pressure plates:
  (5,6) flavor 0
Doors: (6,8), (8,8)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
