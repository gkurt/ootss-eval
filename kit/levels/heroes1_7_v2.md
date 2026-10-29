# heroes1_7_v2

Size 22 x 16. Heroes: thief. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         2 
    0123456789012345678901
  0                       
  1  #################### 
  2  ##########*..####### 
  3  #...#........%...### 
  4  #...#....#...#.@.### 
  5  ##..#....#####...### 
  6  ##..####.#..####%### 
  7  ##.......#..T_....## 
  8  ##..##...#...##...## 
  9  ######...##.######## 
 10  ######.###..##...### 
 11  ####.............### 
 12  ####...############# 
 13  #################### 
 14  #################### 
 15                       
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
  thief #1 at (13,7), group 1
Objects:
  crystal #0 at (11,2)
Gates:
  (17,6) flavor 0: closed, closes toward down
  (14,3) flavor 0: closed, closes toward down
Pressure plates:
  (14,7) flavor 0
Doors: (16,4)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
