---
layout: post
title: Building Hex Grids
created: 1294651680
categories: projects logo
---
I've been looking for a project to use to play with Ruby and OpenGL and decided I'd like to implement Settlers of Catan. The first hurdle I ran into was how to represent the board. There were some interesting articles on how to 

[talk about storage methods]

I eventually got so distracted by the problem of how you could programmatically draw a hex grid that I wasted several pages of graph paper trying out various methods. It reminded me of some of my very first programming, using [Logo](http://el.media.mit.edu/logo-foundation/logo/index.html) on the Apple IIs in elementary school. Directing a turtle seemed like the best way to iteratively discover an algorithm. The [Web Turtle](http://www.sonic.net/~nbs/webturtle/) was pretty cool and gave me a good start but eventually I switched over to [](http://www.alancsmith.co.uk/logo/) 

```
Make "radius 7 // Configure the number of bands to draw.
Make "count 0
CS
Repeat :radius [
  Make "segs :count
  Repeat 6 [
  SetPenColour :count + 1
    Repeat :segs [
      Repeat 2 [ Forward 20 Right 60 ]
      Forward 20 
      PenUp Back 20 PenDown
      Left 120
    ]
    Forward 20 Right 60
  ]
  // Move out to the next band.
  PenUp Left 120 Repeat 2 [ Forward 20 Right 60 ] PenDown
  Make "count :count + 1
]
```

<iframe src="http://player.vimeo.com/video/18616349" width="640" height="480" frameborder="0"></iframe>
[Drawing Hex Tiles with Logo](http://vimeo.com/18616349) from [drewish](http://vimeo.com/drewish) on [Vimeo](http://vimeo.com).

