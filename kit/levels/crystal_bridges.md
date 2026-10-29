# crystal_bridges

Size 15 x 20. Heroes: warrior. Mechanics: water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1    
    012345678901234
  0 ~~~~~~~~~~~~~~~
  1 ~~~~~~~#####~~~
  2 ~#####~....#~~~
  3 ~#....~..W.#~~~
  4 ~#....~*...#~~~
  5 ~#....~....#~~~
  6 ~#.**.~~~~~~~~~
  7 ~~~~~~~~~~~~~~~
  8 ~~~~~~~~....#~~
  9 ~~~....~....#~~
 10 ~~~...*~....#~~
 11 ~~~....~..*.#~~
 12 ~~~....~~~~~~~~
 13 ~~~~~~~~~~~~~~~
 14 ~#....~~~....#~
 15 ~#...*~~~.@..#~
 16 ~#...*~~~....#~
 17 ~#....~~~....#~
 18 ~#####~~~#####~
 19 ~~~~~~~~~~~~~~~
```

Legend:
  .  floor
  #  wall
  ~  water
  @  door
  W  warrior
  *  crystal

Heroes:
  warrior #1 at (9,3), group 1
Objects:
  crystal #2 at (7,4)
  crystal #3 at (6,10)
  crystal #4 at (10,11)
  crystal #5 at (5,16)
  crystal #6 at (5,15)
  crystal #7 at (3,6)
  crystal #8 at (4,6)
Doors: (10,15)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
