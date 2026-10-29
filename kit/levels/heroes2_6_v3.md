# heroes2_6_v3

Size 17 x 15. Heroes: thief. Mechanics: dragons.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1      
    01234567890123456
  0                  
  1  ############### 
  2  ############### 
  3  #####T.######## 
  4  #####..#d...@## 
  5  ####...#.....## 
  6  ####.#.#..d#### 
  7  ####...#...#### 
  8  ####...#...#### 
  9  ####d..#...#### 
 10  ####.*.d...#### 
 11  ####...######## 
 12  ####...######## 
 13  ############### 
 14                  
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  T  thief
  *  crystal
  d  dragon

Heroes:
  thief #1 at (6,3), group 1
Objects:
  dragon #2 at (9,4), facing east
  crystal #3 at (6,10)
  dragon #4 at (11,6), facing west
  dragon #5 at (5,9), facing east
  dragon #6 at (8,10), facing west
Doors: (13,4)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
