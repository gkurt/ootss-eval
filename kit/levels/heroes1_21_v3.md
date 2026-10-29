# heroes1_21_v3

Size 17 x 15. Heroes: thief, warrior, wizard. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1      
    01234567890123456
  0                  
  1  ############### 
  2  #W.._#*T_#._.Z# 
  3  #..*.#_..#.*..# 
  4  #_...#...#..._# 
  5  ###%###%###%### 
  6    #.........#   
  7    #...@@@...#   
  8    #........*#   
  9    ####..#####   
 10    ####.**####   
 11    ###########   
 12    ###########   
 13    ###########   
 14                  
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  _  pressure plate
  %  closed gate
  W  warrior
  T  thief
  Z  wizard
  *  crystal

Heroes:
  warrior #0 at (2,2), group 1
  wizard #1 at (14,2), group 3
  thief #2 at (8,2), group 2
Objects:
  crystal #3 at (4,3)
  crystal #13 at (12,3)
  crystal #14 at (12,8)
  crystal #15 at (9,10)
  crystal #16 at (8,10)
  crystal #17 at (7,2)
Gates:
  (8,5) flavor 4: closed, closes toward down
  (4,5) flavor 4: closed, closes toward down
  (12,5) flavor 4: closed, closes toward down
Pressure plates:
  (7,3) flavor 4
  (9,2) flavor 4
  (5,2) flavor 4
  (2,4) flavor 4
  (12,2) flavor 4
  (14,4) flavor 4
Doors: (8,7), (9,7), (7,7)
Walls two blocks high: (13,9), (13,10), (13,11), (14,11), (15,11), (16,11)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
