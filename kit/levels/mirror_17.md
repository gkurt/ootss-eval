# mirror_17

Size 32 x 22. Heroes: trader. Mechanics: mirrors, water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         2         3 
    01234567890123456789012345678901
  0                                 
  1  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  2  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  3  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  4  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  5  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  6  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  7  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  8  ~~~~~~~....~~~~~~~~~~~~~~~~~~~ 
  9  ~~~~~~..........~~~..~~~~~~~~~ 
 10  ~~~~~~.*./.#....~.....~~~~~~~~ 
 11  ~~~~~~.........~~~..@.~~~~~~~~ 
 12  ~~~~~~~~...~~~~~~~~...~~~~~~~~ 
 13  ~~~~~~~.R..~~~~~~~~~~.~~~~~~~~ 
 14  ~~~~~~~...~~~~~~~~~~~~~~~~~~~~ 
 15  ~~~~~~~~..~~~~~~~~~~~~~~~~~~~~ 
 16  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 17  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 18  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 19  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 20  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 21                                 
```

Legend:
  .  floor
  #  wall
  ~  water
  (space)  solid ground outside the level (impassable)
  @  door
  R  trader
  *  crystal
  /  mirror, glass from bottom-left to top-right

Heroes:
  trader #2 at (9,13), group 1
Objects:
  magic mirror #0 at (10,10), facing north (reflects toward south and east)
  crystal #3 at (8,10)
Doors: (21,11)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group; X activates the magic mirrors.
