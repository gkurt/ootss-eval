# mirror_11

Size 34 x 26. Heroes: trader. Mechanics: mirrors, water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         2         3   
    0123456789012345678901234567890123
  0                                   
  1  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  2  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  3  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  4  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  5  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  6  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  7  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  8  ~~~~~~~~~~~~..~~...~~~~~~~~~~~~~ 
  9  ~~~~~~~~~~~....../...~~~~~~~~~~~ 
 10  ~~~~~~~~~~~.........R.~~~~~~~~~~ 
 11  ~~~~~~~~~~~...~~~..\.~~~~~~~~~~~ 
 12  ~~~~~~~~~~~~~~~~~~...~~~~~~~~~~~ 
 13  ~~~~~~~~~~~~.~~~~~~~~~~~~~~~~~~~ 
 14  ~~~~~~~~~~....~~..~~~~~~~~~~~~~~ 
 15  ~~~~~~~~~~..@.~~....~~~~~~~~~~~~ 
 16  ~~~~~~~~~~~...~~..@..~~~~~~~~~~~ 
 17  ~~~~~~~~~~~~~~~~~...~~~~~~~~~~~~ 
 18  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 19  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 20  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 21  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 22  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 23  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 24  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 25                                   
```

Legend:
  .  floor
  ~  water
  (space)  solid ground outside the level (impassable)
  @  door
  R  trader
  /  mirror, glass from bottom-left to top-right
  \  mirror, glass from top-left to bottom-right

Heroes:
  trader #1 at (21,10), group 1
Objects:
  magic mirror #0 at (18,9), facing north (reflects toward south and east)
  magic mirror #2 at (20,11), facing east (reflects toward west and south)
Doors: (13,15), (19,16)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group; X activates the magic mirrors.
