# heroes2_22_v2

Size 15 x 15. Heroes: cleric, thief, warrior, wizard. Mechanics: dragons, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1  ############# 
  2  #...#...#...# 
  3  #.W.#@.@#.T.# 
  4  #...#...#...# 
  5  ##.###%###.## 
  6  #d*d.....d*d# 
  7  #.#.......#.# 
  8  #d*d.....d*d# 
  9  ##.###%###.## 
 10  #...#...#...# 
 11  #.Z.#@.@#.C.# 
 12  #...#...#...# 
 13  ############# 
 14                
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  %  closed gate
  W  warrior
  T  thief
  Z  wizard
  C  cleric
  *  crystal
  d  dragon

Heroes:
  warrior #0 at (3,3), group 1
  thief #3 at (11,3), group 2
  wizard #17 at (3,11), group 3
  cleric #20 at (11,11), group 4
Objects:
  dragon #4 at (2,6), facing east
  crystal #5 at (3,6)
  dragon #6 at (4,6), facing west
  dragon #7 at (10,6), facing east
  crystal #8 at (11,6)
  dragon #9 at (12,6), facing west
  dragon #10 at (2,8), facing east
  crystal #11 at (3,8)
  dragon #12 at (4,8), facing west
  dragon #13 at (10,8), facing east
  crystal #14 at (11,8)
  dragon #15 at (12,8), facing west
Gates:
  (7,9) flavor 2: closed, monster gate, closes toward down
  (7,5) flavor 2: closed, monster gate, closes toward down
Doors: (6,3), (8,3), (6,11), (8,11)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
