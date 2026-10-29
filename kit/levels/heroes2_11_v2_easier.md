# heroes2_11_v2_easier

Size 16 x 11. Heroes: warrior. Mechanics: goblins, dragons, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1     
    0123456789012345
  0                 
  1  ############## 
  2  #####........# 
  3  #####....*W..# 
  4  #...#..g.....# 
  5  #.@.%........# 
  6  #...#.......d# 
  7  #####.....*..# 
  8  #####........# 
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
  warrior #0 at (11,3), group 1
Objects:
  dragon #1 at (13,6), facing west
  crystal #2 at (10,3)
  goblin #3 at (8,4), facing east
  crystal #4 at (11,7)
Gates:
  (5,5) flavor 2: closed, monster gate, closes toward down
Doors: (3,5)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
