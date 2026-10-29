# one_vs_three

Size 22 x 17. Heroes: bard, wizard. Mechanics: water.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         2 
    0123456789012345678901
  0 ~~~~~~~~~~~~~~~~~~~~~~
  1 ~~~~~~~*~~~~~~~~~~~~~~
  2 ~~~~~~~.~~~~~~~~~~~~~~
  3 ~~~~~~~.~~##~~~~~~~~~~
  4 ~~~~~~...~##~~~~~~~~~~
  5 ~~~~~.....~~~~~~~~~~~~
  6 ~~~~~.....~~~~~~~~~~~~
  7 ~#~~....Z.~~~~~~~~~~~~
  8 ~#~~.....~~~~~~~~..~~~
  9 ~#~@...~~~~~~~~~...~@~
 10 ~#~~..~~~~~~~~~....~~~
 11 ~###~~~~~~~~~......~~~
 12 ~~##~~~~~~~~.......~~~
 13 ~~~~~~~~~~~~.......~~~
 14 ~~~~~~~~~~~..B...~~~~~
 15 ~~~~~~~~~~~.....~~~~~~
 16 ~~~~~~~~~~~~~~~~~~~~~~
```

Legend:
  .  floor
  #  wall
  ~  water
  @  door
  Z  wizard
  B  bard
  *  crystal

Heroes:
  bard #1 at (13,14), group 1
  wizard #3 at (8,7), group 2
Objects:
  crystal #4 at (7,1)
Doors: (3,9), (20,9)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
