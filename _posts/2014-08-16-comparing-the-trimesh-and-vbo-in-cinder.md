---
layout: post
title: Comparing the TriMesh and VBO in Cinder
---
I've been playing around with Cinder, trying to make a simple app for drawing
isometric images using triangles. Still learning my way around OpenGL and the
wrapper classes Cinder offers.

I kept running into a random segfault when trying to use the VBO so I went
looking for some stupid simple example code and [this slightly broken example](https://forum.libcinder.org/topic/vbomesh-problem)
was the closest thing I found. So I spent a little time cleaning it up then got
it drawing equilateral triangles:

![Screenshot]({% asset_path Triangles_in_Cinder.png %})

The `t` key toggles the drawing back and forth between the TriMesh and VBO.

<script src="https://gist.github.com/drewish/cd582c6415bf8c0ba0a1.js"></script>
