---
layout: post
title: Creating a sprite from cocos2d's CCTMXTiledMap
created: 1326566192
categories: documentation ios cocos2d
---
I'm working on a [Pipe Mania/Dream](http://en.wikipedia.org/wiki/Pipe_Mania)
clone for iOS using [cocos2d](http://www.cocos2d-iphone.org/). I was able to
quickly implement the board using the `CCTMXTiledMap` component, but
then when I started trying to figure out how to setup a sprite preview the next
piece I got stuck. I'd intended to try to document all the false starts I took
before figuring this solution out, but I waited too long before doing the
writeup.

<img src="http://drewish.com/files/pipes_game_screenshot.png" alt="screen shot of the game">

My map gets setup like this and I store a variable to make it easy to get to
the board's layer where I'm placing the pieces:

``` objc
CCTMXTiledMap *map = [CCTMXTiledMap tiledMapWithTMXFile:@"Board.tmx"];
CCTMXLayer *playLayer = [map layerNamed:@"Play"];
[self addChild:map z:-1];
```

What I eventually figured out that I could just create my own texture from the layer's source image, then ask the layer which part of the texture the sprite should use:

``` objc
CCTexture2D *tex = [[CCTextureCache sharedTextureCache] addImage:playLayer.tileset.sourceImage];
// Since I'm doing an 8-bit style I want it crisp and pixel aligned.
[tex setAliasTexParameters];
// We don't know what the piece is yet so just use the first tile.
CGRect rect = [playLayer.tileset rectForGID:playLayer.tileset.firstGid];
CCSprite *nextPiece = [CCSprite spriteWithTexture:tex rect:rect];
nextPiece.anchorPoint = CGPointZero;
nextPiece.position = CGPointMake(400, 224);
[self addChild:nextPiece];
```

Then in my `pickNextPiece` method I can just adjust the rectangle:

``` objc
// Pick a random tile...
nextTileGid = (arc4random_uniform(7)) + 2;
// Then ask the layer where the texture is.
CGRect rect = [playLayer.tileset rectForGID:nextTileGid];
[nextPiece setTextureRectInPixels:rect rotated:NO untrimmedSize:rect.size];
```

As with most of these kind of problems it's pretty simple once you see it spelled out but it took me quite a bit of digging to get to that point.

I've got the code up up on github if you want to have a look: https://github.com/drewish/pipes
