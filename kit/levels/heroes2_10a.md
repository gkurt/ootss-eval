# heroes2_10a

Size 15 x 9. Heroes: warrior. Mechanics: goblins, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1  ############# 
  2  #.......#...# 
  3  #.......#.@.# 
  4  #.W*.g..#...# 
  5  #....*..##%## 
  6  #g.........## 
  7  ############# 
  8                
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
  warrior #4 at (3,4), group 1
Objects:
  goblin #1 at (2,6), facing east
  crystal #2 at (6,5)
  goblin #5 at (6,4), facing west
  crystal #6 at (4,4)
Gates:
  (11,5) flavor 2: closed, monster gate, closes toward down
Doors: (11,3)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
