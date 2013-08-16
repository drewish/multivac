---
layout: post
title: Building Hex Grids
created: 1294651680
categories: projects logo
---
I've been looking for a project to use to play with Ruby and OpenGL and decided I'd like to implement Settlers of Catan. The first hurdle I ran into was how to represent the board. There were some interesting articles on how to 

[talk about storage methods]

I eventually got so distracted by the problem of how you could programmatically draw a hex grid that I wasted several pages of graph paper trying out various methods. It reminded me of some of my very first programming, using <a href="http://el.media.mit.edu/logo-foundation/logo/index.html">Logo</a> on the Apple IIs in elementary school. Directing a turtle seemed like the best way to iteratively discover an algorithm. The <a href="http://www.sonic.net/~nbs/webturtle/">Web Turtle</a> was pretty cool and gave me a good start but eventually I switched over to <a href="http://www.alancsmith.co.uk/logo/"></a> 
<pre>
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
</pre>

<iframe src="http://player.vimeo.com/video/18616349" width="640" height="480" frameborder="0"></iframe><p><a href="http://vimeo.com/18616349">Drawing Hex Tiles with Logo</a> from <a href="http://vimeo.com/drewish">drewish</a> on <a href="http://vimeo.com">Vimeo</a>.</p>
