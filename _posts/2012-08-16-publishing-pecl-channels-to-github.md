---
layout: post
title: Publishing pecl channels to GitHub
created: 1345156502
categories: documentation php pecl pirum pear
---
This is the process I used to publish a pecl channel for phpredis to GitHub
pages. You can read the full background on [the issue](https://github.com/nicolasff/phpredis/issues/42).


Install prium:

```sh
$ pear channel-discover pear.pirum-project.org
$ pear install pirum/Pirum
```

Create a pages repo. I did this as a separate checkout in a sibling directory:

```sh
$ git clone git@github.com:drewish/phpredis.git phpredis-channel
$ cd phpredis-channel
$ git checkout --orphan gh-pages
$ git rm -rf .
```

Configure the pirum.xml file then build the channel:

```sh
$ pirum build .
```

Add your channel to pear/pecl (this also validates it and warns you of any
problems before you push it up to github):

```sh
$ pecl channel-add channel.xml
```

If that looks good then add all files and push it:

```sh
$ git add -A
$ git commit -m "Created the channel."
$ git push origin gh-pages
```

Hop up a directory (since I've got them as siblings):

```sh
$ cd ..
```

Package up a release:

```sh
$ pecl package phpredis/package.xml
```

Switch into the pages repo:

```sh
$ cd phpredis-channel
```

Add the release to the channel:

```sh
$ pirum add . PhpRedis-2.2.1.tgz
```

If that doesn't have any errors then commit the changes and push them:

```sh
$ git add -A
$ git commit -m "Adding the PhpRedis-2.2.1 release."
$ git push origin gh-pages
```

### Sources

- http://blog.stuartherbert.com/php/2011/09/22/php-components-publishing-your-pear-channel-on-github/
- http://blog.shupp.org/2010/12/24/github-pages-pirum-easy-pear-channel/
- https://help.github.com/articles/creating-project-pages-manually
