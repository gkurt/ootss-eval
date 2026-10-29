# heroes2_thief_goblin

Size 16 x 17. Heroes: thief. Mechanics: goblins, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1     
    0123456789012345
  0                 
  1  ############## 
  2  #.........#### 
  3  #.........#### 
  4  #.....g...#### 
  5  #.......*..### 
  6  #.......T..### 
  7  #..g.......### 
  8  #......g.....# 
  9  #..g.........# 
 10  #............# 
 11  #.........g..# 
 12  #g....g._....# 
 13  #.%..........# 
 14  #@..g........# 
 15  ############## 
 16                 
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
  g  goblin

Heroes:
  thief #0 at (9,6), group 1
Objects:
  crystal #1 at (9,5)
  goblin #2 at (7,4), facing east
  goblin #3 at (4,7), facing east
  goblin #4 at (4,9), facing east
  goblin #5 at (11,11), facing east
  goblin #6 at (8,8), facing east
  goblin #7 at (7,12), facing east
  goblin #11 at (2,12), facing east
  goblin #12 at (5,14), facing east
Gates:
  (3,13) flavor 2: closed, closes toward down
Pressure plates:
  (9,12) flavor 2
Doors: (2,14)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
