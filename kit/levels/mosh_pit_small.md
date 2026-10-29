# mosh_pit_small

Size 9 x 9. Heroes: cleric, wizard. Mechanics: goblins, dragons, gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0        
    012345678
  0          
  1  ####### 
  2  #C***d# 
  3  #*****# 
  4  #****Z# 
  5  #g***%# 
  6  #****%# 
  7  ####### 
  8          
```

Legend:
  #  wall
  (space)  solid ground outside the level (impassable)
  %  closed gate
  Z  wizard
  C  cleric
  *  crystal
  g  goblin
  d  dragon

Heroes:
  cleric #13 at (2,2), group 2
  wizard #17 at (6,4), group 1
Objects:
  crystal #4 at (5,4)
  crystal #5 at (6,3)
  dragon #6 at (6,2), facing west
  crystal #7 at (4,2)
  crystal #8 at (2,3)
  crystal #9 at (2,4)
  crystal #10 at (4,3)
  crystal #11 at (5,6)
  crystal #12 at (2,6)
  crystal #14 at (3,2)
  crystal #15 at (3,6)
  goblin #16 at (2,5), facing east
  crystal #18 at (3,5)
  crystal #19 at (4,5)
  crystal #20 at (4,6)
  crystal #21 at (5,5)
  crystal #22 at (5,2)
  crystal #23 at (5,3)
  crystal #24 at (4,4)
  crystal #25 at (3,3)
  crystal #26 at (3,4)
Gates:
  (6,5) flavor 3: closed, monster gate, closes toward down
  (6,6) flavor 3: closed, monster gate, closes toward down
Doors: (6,5), (6,6)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
