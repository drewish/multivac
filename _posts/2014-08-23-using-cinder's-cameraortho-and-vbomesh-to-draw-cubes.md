---
layout: post
title: Using Cinder's CameraOrtho and VBOMesh to draw cubes
---
I was browsing through [OTAKU GANGSTA](http://http://otakugangsta.com/) when I
came across [this image](http://otakugangsta.com/post/94570382165):

![grid of cubes](http://38.media.tumblr.com/tumblr_lol8chVdDH1qfo7dro1_500.png)

I thought it was beautiful and replicating it would make a great project.

I started by using `gl::drawCube()` to draw a few cubes. It uses triangles for
the faces, rather than quads, so the wire-frame rendering didn't look right.
But it made it easy to get the cubes into a grid so I could start figuring out
how the rotations should work:

![Cubes with one axis of rotation]({% asset_path SquarePerspectiveApp_step_1.png %})

The next step was figuring out how to use Cinder's `CameraOrtho` to remove the
perspective from the projection. Then I tried to  matching the number and size
of cubes:

![Everything looking good and triangular]({% asset_path SquarePerspectiveApp_step_2.png %})

At this point all that was left was to switch the cube drawing to use quads. I
used the somewhat broken `VBOMesh` example code from the [Guide to Meshes In
Cinder](http://www.creativeapplications.net/tutorials/guide-to-meshes-in-cinder-cinder-tutorials/)
by Joshua Noble as a starting point.

After a bit of tweaking the cube size and spacing I got a final result that I'm
really happy with:

![Final output]({% asset_path SquarePerspectiveAppOutput.png %})

The source code:

<script src="https://gist.github.com/drewish/77e8ec09ad45efa8a582.js"></script>
