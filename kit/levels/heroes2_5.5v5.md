# heroes2_5.5v5

Size 20 x 14. Heroes: thief. Mechanics: dragons.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1         
    01234567890123456789
  0                     
  1  #                  
  2     ########.###### 
  3     #T.d#...#     # 
  4     #.*.....#     # 
  5     #...#d..#     # 
  6     ######..#     # 
  7     ##dd....#     # 
  8     #@......#     # 
  9     ##......#     # 
 10     #########     # 
 11     #             # 
 12     ############### 
 13                     
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  T  thief
  *  crystal
  d  dragon

Heroes:
  thief #0 at (5,3), group 1
Objects:
  dragon #2 at (7,3), facing south
  crystal #3 at (6,4)
  dragon #4 at (9,5), facing east
  dragon #5 at (6,7), facing south
  dragon #6 at (7,7), facing south
Doors: (5,8)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
