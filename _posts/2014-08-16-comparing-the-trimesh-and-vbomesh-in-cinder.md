---
layout: post
title: Comparing the TriMesh and VboMesh in Cinder
---
I've been playing around with [Cinder](http://libcinder.org/) trying to make a
simple app for drawing isometric images with triangles. I'm still learning my
way around OpenGL and the wrapper classes Cinder offers but I like what I've
seen so far. It's been a lot of fun doing C++ again after a long time with Ruby
and JavaScript.

I kept running into a random segfault when trying to draw anything using the
[`VboMesh`](http://libcinder.org/docs/v0.8.6/classcinder_1_1gl_1_1_vbo.html) so I
went looking for some super basic sample code. The closest thing I found was
[this slightly broken example](https://forum.libcinder.org/topic/vbomesh-problem).
So I spent a little time cleaning it up, then got it drawing equilateral
triangles:

![Screenshot]({% asset_path Triangles_in_Cinder.png %})

I started wondering if I should be using the [`TriMesh`](http://libcinder.org/docs/v0.8.6/classcinder_1_1_tri_mesh.html)
instead, so I decided to try implementing the drawing that way so I could
compare the code. It ended up a little cleaner, but since my goal is to have
colors change when you touch a triangle, I'll probably stick with the `VboMesh`
so I can use dynamic colors.

Here's the code in case it's helpful for anyone else:

<script src="https://gist.github.com/drewish/cd582c6415bf8c0ba0a1.js"></script>
