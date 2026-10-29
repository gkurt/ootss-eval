# heroes2_11_v2

Size 16 x 11. Heroes: warrior. Mechanics: goblins, dragons, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1     
    0123456789012345
  0                 
  1  ############## 
  2  #####........# 
  3  #####.*......# 
  4  #...#.....*..# 
  5  #.@.%..g.g...# 
  6  #...#...g....# 
  7  #####.......d# 
  8  #####...W....# 
  9  ############## 
 10                 
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  %  closed gate
  W  warrior
  *  crystal
  g  goblin
  d  dragon

Heroes:
  warrior #0 at (9,8), group 1
Objects:
  dragon #1 at (13,7), facing west
  crystal #2 at (7,3)
  goblin #3 at (8,5), facing east
  goblin #4 at (10,5), facing west
  crystal #5 at (11,4)
  goblin #8 at (9,6), facing north
Gates:
  (5,5) flavor 2: closed, monster gate, closes toward down
Doors: (3,5)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
