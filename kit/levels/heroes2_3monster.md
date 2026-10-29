# heroes2_3monster

Size 16 x 13. Heroes: warrior. Mechanics: goblins, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1     
    0123456789012345
  0                 
  1               . 
  2                 
  3  ############## 
  4  #........##### 
  5  #........##### 
  6  #.g......#...# 
  7  #..W.g.*.%.@.# 
  8  #........#...# 
  9  #....*...##### 
 10  #g.......##### 
 11  ############## 
 12                 
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

Heroes:
  warrior #2 at (4,7), group 1
Objects:
  goblin #0 at (3,6), facing west
  goblin #1 at (2,10), facing east
  crystal #3 at (8,7)
  crystal #4 at (6,9)
  goblin #5 at (6,7), facing west
Gates:
  (10,7) flavor 2: closed, monster gate, closes toward down
Doors: (12,7)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
