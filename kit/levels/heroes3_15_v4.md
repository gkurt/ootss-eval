# heroes3_15_v4

Size 12 x 11. Heroes: druid, wizard. Mechanics: walking and pushing only.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1 
    012345678901
  0             
  1  ########## 
  2  ##.####### 
  3  #&&####### 
  4  #&&####### 
  5  #&&####### 
  6  #&&##&&@@# 
  7  #&&&&&&### 
  8  #&&D&Z#### 
  9  ########## 
 10             
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  Z  wizard
  D  druid
  &  tree

Heroes:
  wizard #11 at (6,8), group 2
  druid #12 at (4,8), group 1
Objects:
  tree #0 at (2,3)
  tree #1 at (3,3)
  tree #2 at (2,8)
  tree #3 at (2,7)
  tree #4 at (3,7)
  tree #5 at (3,6)
  tree #6 at (2,6)
  tree #7 at (2,5)
  tree #8 at (3,5)
  tree #9 at (3,4)
  tree #10 at (2,4)
  tree #15 at (4,7)
  tree #16 at (5,7)
  tree #17 at (6,7)
  tree #18 at (5,8)
  tree #19 at (6,6)
  tree #20 at (3,8)
  tree #21 at (7,6)
  tree #22 at (7,7)
Doors: (8,6), (9,6)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
