# heroes2_3_v2

Size 22 x 46. Heroes: wizard. Mechanics: goblins.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         2 
    0123456789012345678901
  0                       
  1  #################### 
  2  #################### 
  3  #################### 
  4  #################### 
  5  ####Z.#g###g######## 
  6  ####...*****...g#### 
  7  ####...*****....#### 
  8  #########g###g..#### 
  9  ########g##g##..#### 
 10  ####g..*****....#### 
 11  ####...**.**....#### 
 12  ####..g##g########## 
 13  ####..############## 
 14  ####....g.g....@#### 
 15  #####..g.g..g...#### 
 16  #################### 
 17                       
 18                       
 19                       
 20                       
 21                       
 22                       
 23                       
 24                       
 25                       
 26                       
 27                       
 28                       
 29                       
 30                       
 31                       
 32                       
 33                       
 34                       
 35                       
 36                       
 37                       
 38  ..                   
 39  ..                   
 40  ..                   
 41  ..                   
 42  ..                   
 43  ..                   
 44  ..                   
 45                       
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  Z  wizard
  *  crystal
  g  goblin

Heroes:
  wizard #31 at (5,5), group 1
Objects:
  goblin #0 at (13,15), facing west
  crystal #2 at (8,6)
  crystal #3 at (8,7)
  crystal #4 at (9,7)
  crystal #5 at (9,6)
  crystal #6 at (10,6)
  crystal #7 at (10,7)
  crystal #8 at (11,7)
  crystal #9 at (11,6)
  crystal #10 at (12,6)
  crystal #11 at (12,7)
  goblin #12 at (12,5), facing south
  goblin #13 at (8,5), facing south
  goblin #14 at (10,8), facing north
  crystal #15 at (8,10)
  crystal #16 at (9,10)
  crystal #17 at (10,10)
  crystal #18 at (11,11)
  crystal #19 at (11,10)
  crystal #20 at (12,10)
  crystal #21 at (12,11)
  crystal #22 at (9,11)
  crystal #23 at (8,11)
  goblin #24 at (10,12), facing north
  goblin #25 at (12,9), facing south
  goblin #26 at (9,9), facing south
  goblin #27 at (14,8), facing north
  goblin #28 at (16,6), facing west
  goblin #29 at (7,12), facing north
  goblin #30 at (5,10), facing east
  goblin #32 at (11,14), facing west
  goblin #33 at (10,15), facing west
  goblin #34 at (8,15), facing west
  goblin #35 at (9,14), facing west
Doors: (16,14)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
