---
layout: post
title: Comparing the TriMesh and VBO in Cinder
---
I've been playing around with Cinder, trying to make a simple app for drawing
isometric images using triangles. Still learning my way around OpenGL and the
wrapper classes Cinder offers.

I kept running into a random segfault when trying to use the VBO so I went
looking for some stupid simple example code. The closest thing I found was
[this slightly broken example](https://forum.libcinder.org/topic/vbomesh-problem).
So I spent a little time cleaning it up then got it drawing equilateral
triangles.

![Screenshot]({% asset_path Triangles_in_Cinder.png %})

I started wondering if I should be using the TriMesh instead, so I
decided to convert it over and compare the code. It's a little cleaner, but
since I'm going to be changing the colors of the triangles having dynamic colors
will probably keep me using the VBO.

<script src="https://gist.github.com/drewish/cd582c6415bf8c0ba0a1.js"></script>
