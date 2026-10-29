# heroes2_5_no_crystal

Size 17 x 14. Heroes: thief. Mechanics: dragons.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1      
    01234567890123456
  0                  
  1    ############# 
  2   #####          
  3   #.T..########  
  4   #...........#  
  5   #.@.......d.#  
  6   #...........#  
  7   #..d........#  
  8   #...........#  
  9  ##.........d.#  
 10  #............#  
 11  #...#######..#  
 12  ############### 
 13                  
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  T  thief
  d  dragon

Heroes:
  thief #1 at (4,3), group 1
Objects:
  dragon #0 at (12,9), facing west
  dragon #2 at (12,5), facing west
  dragon #3 at (5,7), facing east
Doors: (4,5)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
