# heroes2_9

Size 9 x 13. Heroes: thief, warrior, wizard. Mechanics: dragons.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0        
    012345678
  0          
  1  ####### 
  2  ##@*@## 
  3  ##.@.## 
  4  #d...## 
  5  ##...## 
  6  ##...## 
  7  ##...## 
  8  ##...d# 
  9  ##...## 
 10  ##WTZ## 
 11  ####### 
 12          
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  W  warrior
  T  thief
  Z  wizard
  *  crystal
  d  dragon

Heroes:
  warrior #6 at (3,10), group 1
  thief #7 at (4,10), group 2
  wizard #8 at (5,10), group 3
Objects:
  crystal #1 at (4,2)
  dragon #4 at (2,4), facing east
  dragon #5 at (6,8), facing west
Doors: (3,2), (5,2), (4,3)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
