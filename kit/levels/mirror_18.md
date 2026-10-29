# mirror_18

Size 36 x 23. Heroes: trader. Mechanics: mirrors, water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         2         3     
    012345678901234567890123456789012345
  0                                     
  1  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  2  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  3  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  4  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  5  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  6  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  7  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  8  ~~~~~~~~~~~~~~~~~~...~~~~~~~~~~~~~ 
  9  ~~~~~~~~~~~~~~~~~...*.~~~~~~~~~~~~ 
 10  ~~~~~~~~~~~~~~~~~.*....~~~~~~~~~~~ 
 11  ~~~~~~~~~~~~~.~.~......~~~~~~~~~~~ 
 12  ~~~~~~~~~~~..R~~~...~~.~~~~~~~~~~~ 
 13  ~~~~~~~~~~..*..~~~~~~~~~~~~~~~~~~~ 
 14  ~~~~~~~~~~./...~~~~~~~~~~~~~~~~~~~ 
 15  ~~~~~~~~~~...~~~~~~~~~~~~~~~~~~~~~ 
 16  ~~~~~~~~~~~.~~~~~...~~~~~~~~~~~~~~ 
 17  ~~~~~~~~~~~~~~~~..@..~~~~~~~~~~~~~ 
 18  ~~~~~~~~~~~~~~~~....~~~~~~~~~~~~~~ 
 19  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 20  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 21  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 22                                     
```

Legend:
  .  floor
  ~  water
  (space)  solid ground outside the level (impassable)
  @  door
  R  trader
  *  crystal
  /  mirror, glass from bottom-left to top-right

Heroes:
  trader #1 at (14,12), group 1
Objects:
  magic mirror #0 at (12,14), facing north (reflects toward south and east)
  crystal #3 at (13,13)
  crystal #4 at (19,10)
  crystal #5 at (21,9)
Doors: (19,17)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group; X activates the magic mirrors.
