# heroes3_4

Size 15 x 9. Heroes: bard. Mechanics: goblins, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1  #########     
  2  #g..B..g##### 
  3  #.......#...# 
  4  #...#...%.@.# 
  5  #.......#...# 
  6  #.......##### 
  7  ###########   
  8                
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  %  closed gate
  B  bard
  g  goblin

Heroes:
  bard #1 at (5,2), group 1
Objects:
  goblin #0 at (2,2), facing east
  goblin #2 at (8,2), facing west
Gates:
  (9,4) flavor 2: closed, monster gate, closes toward down
Doors: (11,4)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
