# mirror_13

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
  7  ~~~~~~~~~~~~~~~....~~~~~~~~~~~~~~~ 
  8  ~~~~~~~~~~~~~~........~~~~~~~~~~~~ 
  9  ~~~~~~~~~~~~~~...@..@..~~~~~~~~~~~ 
 10  ~~~~~~~~~~~~~~~~.......~~~~~~~~~~~ 
 11  ~~~~~~~~~~~..~~~~~~~~~~~~~~~~~~~~~ 
 12  ~~~~~~~~~~~.R.~~~~~.~~~~~~~~~~~~~~ 
 13  ~~~~~~~~~~..../.~~....~~~~~~~~~~~~ 
 14  ~~~~~~~~~~~.\....~..o..~~~~~~~~~~~ 
 15  ~~~~~~~~~~~......~~.~..~~~~~~~~~~~ 
 16  ~~~~~~~~~~~~....~~..~~~~~~~~~~~~~~ 
 17  ~~~~~~~~~~~~~~..~~...~~~~~~~~~~~~~ 
 18  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
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
  o  boulder
  /  mirror, glass from bottom-left to top-right
  \  mirror, glass from top-left to bottom-right

Heroes:
  trader #3 at (13,12), group 1
Objects:
  boulder #0 at (21,14)
  magic mirror #1 at (15,13), facing north (reflects toward south and east)
  magic mirror #2 at (13,14), facing east (reflects toward west and south)
Doors: (18,9), (21,9)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group; X activates the magic mirrors.
