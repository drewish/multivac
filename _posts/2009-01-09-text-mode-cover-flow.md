---
layout: post
title: Text mode Cover Flow
created: 1231545139
categories: projects ruby osx macports jp2a itunes imagemagic h19 applescript
---
My side project has been writing some code to display data from iTunes on my Heathkit H19 terminal. 

[flickr-photo:id=3270870468][flickr-photo:id=3270049605]

<h3>Requirements</h3>

You'll need to use <a href="http://www.macports.org/install.php">MacPorts</a> to install <a href="http://www.imagemagick.org/script/index.php">ImageMagick</a> and <a href="http://csl.sublevel3.org/jp2a/">jp2a</a>:

<code>
sudo port install jp2a imagemagick
</code>

You need to use Ruby's gem to install ncurses and <a href="http://appscript.sourceforge.net/">appscript</a>:
<code>
sudo gem install ncurses rb-appscript
</code>

<h3>The Code</h3>
As of 24 May 2009, I've move this code to <a href="http://github.com/drewish/textFlow/tree/master">GitHub Repository</a>. Now there's publicly accessible version control and people can fork and share changes.
<!--break-->
