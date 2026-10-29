# a_wiz_out_of_water

Size 19 x 15. Heroes: wizard. Mechanics: gates, water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1        
    0123456789012345678
  0 ~~~~~~~~~~~~~~~~~~~
  1 ~~~~~~~~~~~~~#####~
  2 ~~~~~~~~~~~~~...*#~
  3 ~~~~~~~~~~~~~....#~
  4 ~~~~~~~~~~~~~....#~
  5 ~~~~~~~..........#~
  6 ~~....~....~~~~~~~~
  7 ~#....~..Z.~~~~~~~~
  8 ~#....~.....~~~~~~~
  9 ~#..._..~~~.~~~~~~~
 10 ~~~~~~~~~~....~~~~~
 11 ~~~~~~~~~~....~~~~~
 12 ~~~~~~~~~~%%%%~~~~~
 13 ~~~~~~~~~~..@.~~~~~
 14 ~~~~~~~~~~~~~~~~~~~
```

Legend:
  .  floor
  #  wall
  ~  water
  @  door
  _  pressure plate
  %  closed gate
  Z  wizard
  *  crystal

Heroes:
  wizard #0 at (9,7), group 1
Objects:
  crystal #1 at (16,2)
Gates:
  (12,12) flavor 2: closed, closes toward down
  (13,12) flavor 2: closed, closes toward down
  (11,12) flavor 2: closed, closes toward down
  (10,12) flavor 2: closed, closes toward down
Pressure plates:
  (5,9) flavor 2
Doors: (12,13)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
