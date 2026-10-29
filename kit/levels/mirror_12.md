# mirror_12

Size 35 x 26. Heroes: trader. Mechanics: mirrors, water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         2         3    
    01234567890123456789012345678901234
  0                                    
  1  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  2  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  3  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  4  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  5  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  6  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  7  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  8  ~~~~~~~~~~~..~~~~~~~~~~~~~~~~~~~~ 
  9  ~~~~~~~~~~../....~~~~~~~~~~~~~~~~ 
 10  ~~~~~~~~~~.....R.....~~~~~~~~~~~~ 
 11  ~~~~~~~~~~~........\..~~~~~~~~~~~ 
 12  ~~~~~~~~~~~~~~~~~~....~~~~~~~~~~~ 
 13  ~~~~~~~~~~~~~~~~~~~..~~~~~~~~~~~~ 
 14  ~~~~~~~~~~~~~~....~~~~~~~~~~~~~~~ 
 15  ~~~~~~~~~~~~..........~~~~~~~~~~~ 
 16  ~~~~~~~~~~~~..@.@.@...~~~~~~~~~~~ 
 17  ~~~~~~~~~~~~~........~~~~~~~~~~~~ 
 18  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 19  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 20  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 21  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 22  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 23  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 24  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
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
  trader #3 at (16,10), group 1
Objects:
  magic mirror #0 at (20,11), facing east (reflects toward west and south)
  magic mirror #5 at (13,9), facing north (reflects toward south and east)
Doors: (15,16), (17,16), (19,16)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group; X activates the magic mirrors.
