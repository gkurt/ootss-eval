# gully_alt

Size 17 x 19. Heroes: bard. Mechanics: water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1      
    01234567890123456
  0  ~~~~~~~~~~~~~~~~
  1  ###############~
  2  ####..#...#####~
  3  ####....#.#####~
  4  #####...#.#~~##~
  5  ####~~~~~~~~~##~
  6  ##.#~.###.#~~##~
  7  #..#~...~..~~##~
  8  ##..~.#*~..~~##~
  9  ##.~~B..~..~###~
 10  #..~##..~#.~~##~
 11  #..~.###~#.~~##~
 12  ###~....~..~~##~
 13  #..~...~~#.~~##~
 14  #..~~~~~##.~~##~
 15  #.....####.~@##~
 16  #....##########~
 17  ###############~
 18  ~~~~~~~~~~~~~~~~
```

Legend:
  .  floor
  #  wall
  ~  water
  (space)  solid ground outside the level (impassable)
  @  door
  B  bard
  *  crystal

Heroes:
  bard #1 at (6,9), group 1
Objects:
  crystal #2 at (8,8)
Doors: (13,15)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
