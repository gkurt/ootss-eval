# heroes2_12_v2

Size 22 x 15. Heroes: wizard. Mechanics: goblins, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         2 
    0123456789012345678901
  0                       
  1  #################### 
  2  #################### 
  3  #################### 
  4  #################### 
  5  #####.......######## 
  6  #####._...%.######## 
  7  #####...*...#...#### 
  8  #####..Z.g..%.@.#### 
  9  #####...*...#...#### 
 10  #####._..._.######## 
 11  #####.......######## 
 12  #################### 
 13  #################### 
 14                       
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  _  pressure plate
  %  closed gate
  Z  wizard
  *  crystal
  g  goblin

Heroes:
  wizard #2 at (8,8), group 1
Objects:
  goblin #3 at (10,8), facing west
  crystal #4 at (9,7)
  crystal #5 at (9,9)
Gates:
  (13,8) flavor 2: closed, monster gate, closes toward down
  (11,6) flavor 0: closed, closes toward down
Pressure plates:
  (11,10) flavor 0
  (7,6) flavor 0
  (7,10) flavor 0
Doors: (15,8)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
