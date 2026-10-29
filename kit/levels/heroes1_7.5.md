# heroes1_7.5

Size 13 x 5. Heroes: wizard. Mechanics: walking and pushing only.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1  
    0123456789012
  0              
  1  ...#...*... 
  2  .Z.#...#.@. 
  3  ...*...#... 
  4              
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  Z  wizard
  *  crystal

Heroes:
  wizard #3 at (2,2), group 1
Objects:
  crystal #1 at (4,3)
  crystal #2 at (8,1)
Doors: (10,2)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
