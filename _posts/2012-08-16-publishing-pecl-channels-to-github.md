---
layout: post
title: Publishing pecl channels to GitHub
created: 1345156502
categories: documentation php pecl pirum pear
---
The process I used to build: http://drewish.github.com/phpredis/ to address this issue: https://github.com/nicolasff/phpredis/issues/42

Install prium:

<code>
pear channel-discover pear.pirum-project.org
pear install pirum/Pirum
</code>

Create a pages repo. I did this as a separate checkout in a sibling directory:

<code>
git clone git@github.com:drewish/phpredis.git phpredis-channel
cd phpredis-channel
git checkout --orphan gh-pages
git rm -rf .
</code>

Configure the pirum.xml file then build the channel:

<code>
pirum build .
</code>

Add your channel to pear/pecl (this also validates it and warns you of any
problems before you push it up to github):

<code>
pecl channel-add channel.xml 
</code>

If that looks good then add all files and push it:

<code>
git add -A
git commit -m "Created the channel."
git push origin gh-pages
</code>

Hop up a directory (since I've got them as siblings):

<code>
cd ..
</code>

Package up a release:

<code>
pecl package phpredis/package.xml
</code>

Switch into the pages repo:

<code>
cd phpredis-channel
</code>

Add the release to the channel:

<code>
pirum add . PhpRedis-2.2.1.tgz
</code>

If that doesn't have any errors then commit the changes and push them:

<code>
git add -A
git commit -m "Adding the PhpRedis-2.2.1 release."
git push origin gh-pages
</code>

<h3>Sources</h3>
http://blog.stuartherbert.com/php/2011/09/22/php-components-publishing-your-pear-channel-on-github/
http://blog.shupp.org/2010/12/24/github-pages-pirum-easy-pear-channel/
https://help.github.com/articles/creating-project-pages-manually
