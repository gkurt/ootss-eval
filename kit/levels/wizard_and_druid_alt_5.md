# wizard_and_druid_alt_5

Size 15 x 10. Heroes: druid, wizard. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1  ############# 
  2  #......###### 
  3  #_#.....D#.@# 
  4  #...#&#..%..# 
  5  #######.Z#.@# 
  6  #######%##### 
  7  ###&._..##### 
  8  ############# 
  9                
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  _  pressure plate
  %  closed gate
  Z  wizard
  D  druid
  &  tree

Heroes:
  druid #2 at (9,3), group 1
  wizard #3 at (9,5), group 2
Objects:
  tree #8 at (6,4)
  tree #9 at (4,7)
Gates:
  (10,4) flavor 4: closed, closes toward down
  (8,6) flavor 1: closed, closes toward down
Pressure plates:
  (6,7) flavor 4
  (2,3) flavor 1
Doors: (12,5), (12,3)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
