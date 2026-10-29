# heroes2_10a_intro

Size 15 x 12. Heroes: warrior. Mechanics: goblins, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0                
  1  ############# 
  2  #.......##### 
  3  #.......#...# 
  4  #.......#.@.# 
  5  #..#....#...# 
  6  #..##...##%## 
  7  #W.#....g..!# 
  8  #..#.....**.# 
  9  #g.#........# 
 10  ############# 
 11                
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
  !  sign

Heroes:
  warrior #4 at (2,7), group 1
Objects:
  crystal #0 at (11,8)
  goblin #1 at (2,9), facing north
  goblin #2 at (9,7), facing west
  crystal #3 at (10,8)
  sign #7 at (12,7)
Gates:
  (11,6) flavor 2: closed, monster gate, closes toward down
Doors: (11,4)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
