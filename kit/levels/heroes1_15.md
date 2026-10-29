# heroes1_15

Size 13 x 5. Heroes: warrior, wizard. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1  
    0123456789012
  0              
  1  ...##W##.@# 
  2  ._.....%..* 
  3  ...##Z##.@# 
  4              
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  _  pressure plate
  %  closed gate
  W  warrior
  Z  wizard
  *  crystal

Heroes:
  warrior #2 at (6,1), group 1
  wizard #5 at (6,3), group 2
Objects:
  crystal #3 at (11,2)
Gates:
  (8,2) flavor 4: closed, closes toward south
Pressure plates:
  (2,2) flavor 4
Doors: (10,1), (10,3)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
