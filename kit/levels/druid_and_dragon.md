# druid_and_dragon

Size 14 x 11. Heroes: druid, warrior. Mechanics: goblins, dragons, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1   
    01234567890123
  0               
  1  ############ 
  2  #.........## 
  3  #..d.......# 
  4  #...&#.....# 
  5  #.W.g##..D.# 
  6  #...##.....# 
  7  ##%###.....# 
  8  #@.@##.g..## 
  9  ############ 
 10               
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  %  closed gate
  W  warrior
  D  druid
  g  goblin
  d  dragon
  &  tree

Heroes:
  druid #4 at (10,5), group 2
  warrior #5 at (3,5), group 1
Objects:
  tree #0 at (5,4)
  dragon #1 at (4,3), facing east
  goblin #6 at (5,5), facing west
  goblin #8 at (8,8), facing west
Gates:
  (3,7) flavor 3: closed, monster gate, closes toward down
Doors: (2,8), (4,8)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
