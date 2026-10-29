# heroes1_16_v3

Size 13 x 9. Heroes: thief, warrior, wizard. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1  
    0123456789012
  0              
  1  ########### 
  2  #*..@@...*# 
  3  #.#######.# 
  4  #%#@.#..#%# 
  5  #.#._._.#*# 
  6  #T#Z.#.*#W# 
  7  ########### 
  8              
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
  wizard #0 at (4,6), group 1
  thief #2 at (2,6), group 3
  warrior #8 at (10,6), group 2
Objects:
  crystal #1 at (10,5)
  crystal #3 at (2,2)
  crystal #4 at (8,6)
  crystal #11 at (10,2)
Gates:
  (10,4) flavor 0: closed, closes toward west
  (2,4) flavor 0: closed, closes toward east
Pressure plates:
  (5,5) flavor 0
  (7,5) flavor 0
Doors: (4,4), (5,2), (6,2)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
