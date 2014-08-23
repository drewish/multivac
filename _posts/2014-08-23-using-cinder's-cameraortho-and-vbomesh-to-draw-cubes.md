---
layout: post
title: Using Cinder's CameraOrtho and VBOMesh to draw cubes
---
I was browsing through [OTAKU GANGSTA](http://http://otakugangsta.com/) when I
came across [this image](http://otakugangsta.com/post/94570382165):

![grid of cubes](http://38.media.tumblr.com/tumblr_lol8chVdDH1qfo7dro1_500.png)

I thought it was beautiful and replicating it would make a great project. So I
spent a little time figuring out how to use Cinder's `CameraOrtho` and mashed
that up with a `VBOMesh` cube based on some, somewhat broken, example code from
this older [Guide to Meshes In Cinder](http://www.creativeapplications.net/tutorials/guide-to-meshes-in-cinder-cinder-tutorials/)
by Joshua Noble.

I'm really happy with how the final result turned out:

![Screenshot]({% asset_path SquarePerspectiveApp.png %})

The source code:

<script src="https://gist.github.com/drewish/77e8ec09ad45efa8a582.js"></script>
