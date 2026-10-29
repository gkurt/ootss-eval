# push_and_pull_zach

Size 10 x 14. Heroes: thief, warrior. Mechanics: water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         
    0123456789
  0 ~~~~~~~~~~
  1 ~~~~~~~~#~
  2 ~~@~~~~~~~
  3 ~~~~~~~~~~
  4 ~~.~..~~~~
  5 ~~.~~.~~~~
  6 ~~..#.~~~~
  7 ~~~#.....~
  8 ~~@#T..*.~
  9 ~~~#...*.~
 10 ~~~~W..*.~
 11 ~~~~...*.~
 12 ~#~~...*.~
 13 ~~~~~~~~~~
```

Legend:
  .  floor
  #  wall
  ~  water
  @  door
  W  warrior
  T  thief
  *  crystal

Heroes:
  warrior #0 at (4,10), group 2
  thief #2 at (4,8), group 1
Objects:
  crystal #4 at (7,10)
  crystal #5 at (7,11)
  crystal #6 at (7,12)
  crystal #7 at (7,8)
  crystal #8 at (7,9)
Doors: (2,8), (2,2)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
