# mirror_sink

Size 34 x 21. Heroes: trader. Mechanics: mirrors, water.
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
  7  ~~~~~~~~~~~~~~~~~~...~~~~~~~~~~~ 
  8  ~~~~~~~~~~~~~~~~...@..~~~~~~~~~~ 
  9  ~~~~~~~~~~~~~.~.......~~~~~~~~~~ 
 10  ~~~~~~~~~~~...~#...~~~~~~~~~~~~~ 
 11  ~~~~~~~~~~..*.~~#~~~~~~~~~~~~~~~ 
 12  ~~~~~~~~~~...R~~~~~~~~~~~~~~~~~~ 
 13  ~~~~~~~~~~.\...~~~~~~~~~~~~~~~~~ 
 14  ~~~~~~~~~~~.........~~~~~~~~~~~~ 
 15  ~~~~~~~~~~~~~......~~~~~~~~~~~~~ 
 16  ~~~~~~~~~~~~~~~~..~~~~~~~~~~~~~~ 
 17  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 18  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 19  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 20                                   
```

Legend:
  .  floor
  #  wall
  ~  water
  (space)  solid ground outside the level (impassable)
  @  door
  R  trader
  *  crystal
  \  mirror, glass from top-left to bottom-right

Heroes:
  trader #1 at (14,12), group 1
Objects:
  magic mirror #2 at (12,13), facing west (reflects toward east and north)
  crystal #3 at (13,11)
Doors: (20,8)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group; X activates the magic mirrors.
