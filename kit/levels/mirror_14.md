# mirror_14

Size 33 x 22. Heroes: trader. Mechanics: mirrors, water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         2         3  
    012345678901234567890123456789012
  0                                  
  1  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  2  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  3  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  4  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  5  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  6  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
  7  ~~~~~~~~~.~~~~~...~~~~~~~~~~~~~ 
  8  ~~~~~~~~...~~~~.\..~~~~~~~~~~~~ 
  9  ~~~~~~~~.R..~~.......~~~~~~~~~~ 
 10  ~~~~~~~....~~~........~~~~~~~~~ 
 11  ~~~~~~~..R.~~.........~~~~~~~~~ 
 12  ~~~~~~~....~~....@....~~~~~~~~~ 
 13  ~~~~~~~~..~~~~........~~~~~~~~~ 
 14  ~~~~~~~~~~~~~~...\...~~~~~~~~~~ 
 15  ~~~~~~~~~~~~~~~......~~~~~~~~~~ 
 16  ~~~~~~~~~~~~~~~~...~~~~~~~~~~~~ 
 17  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 18  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 19  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 20  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
 21                                  
```

Legend:
  .  floor
  ~  water
  (space)  solid ground outside the level (impassable)
  @  door
  R  trader
  \  mirror, glass from top-left to bottom-right

Heroes:
  trader #1 at (10,9), group 1
  trader #2 at (10,11), group 1
Objects:
  magic mirror #0 at (17,8), facing east (reflects toward west and south)
  magic mirror #4 at (18,14), facing west (reflects toward east and north)
Doors: (18,12)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group; X activates the magic mirrors.
