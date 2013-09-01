---
layout: post
title: Text mode Cover Flow
created: 1231545139
categories: projects ruby osx macports jp2a itunes imagemagic h19 applescript
image: http://www.flickr.com/photos/drewish/3270049605
---
My side project has been writing some code to display data from iTunes on my
Heathkit H19 terminal.

### Requirements

You'll need to use [MacPorts](http://www.macports.org/install.php) to install
[ImageMagick](http://www.imagemagick.org/script/index.php) and
[jp2a](http://csl.sublevel3.org/jp2a/):

```
sudo port install jp2a imagemagick
```

You need to use Ruby's gem to install ncurses and [appscript](http://appscript.sourceforge.net/):

```
sudo gem install ncurses rb-appscript
```

### The Code
As of 24 May 2009, I've move this code to [GitHub Repository](http://github.com/drewish/textFlow/tree/master). Now there's publicly accessible version control and people can fork and share changes.



