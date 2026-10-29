# heroes1_10_inv_v4_b

Size 17 x 24. Heroes: wizard. Mechanics: gates.
Goal: every hero stands on a door at the same time (as many heroes as doors).

```
    0         1      
    01234567890123456
  0                  
  1  ############### 
  2  ############### 
  3  ############### 
  4  ############### 
  5  ############### 
  6  ############### 
  7  ############### 
  8  ############### 
  9  ##.......###### 
 10  ##._.*.*.###### 
 11  ##.......###### 
 12  ##.*.*.*.###### 
 13  ##.......###### 
 14  ##.*.*.*Z###### 
 15  ##.......###### 
 16  #######%####### 
 17  ######...###### 
 18  ######.@.###### 
 19  ######.*.###### 
 20  ############### 
 21  ############### 
 22  ############### 
 23                  
```

Legend:
  .  floor
  #  wall
  (space)  solid ground outside the level (impassable)
  @  door
  _  pressure plate
  %  closed gate
  Z  wizard
  *  crystal

Heroes:
  wizard #16 at (9,14), group 1
Objects:
  crystal #2 at (4,14)
  crystal #3 at (8,19)
  crystal #12 at (8,14)
  crystal #13 at (6,10)
  crystal #14 at (8,10)
  crystal #15 at (6,14)
  crystal #17 at (8,12)
  crystal #18 at (4,12)
  crystal #19 at (6,12)
Gates:
  (8,16) flavor 0: closed, closes toward down
Pressure plates:
  (6,12) flavor 0, pressed
  (6,14) flavor 0, pressed
  (4,14) flavor 0, pressed
  (4,10) flavor 0
  (4,12) flavor 0, pressed
  (6,10) flavor 0, pressed
  (8,10) flavor 0, pressed
  (8,12) flavor 0, pressed
  (8,14) flavor 0, pressed
Doors: (8,18)

Moves: U D L R move the selected hero group north, south, west, east; C selects the next group.
