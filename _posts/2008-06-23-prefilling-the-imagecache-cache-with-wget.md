---
layout: post
title: Prefilling the ImageCache cache with wget
created: 1214263867
categories: drupal documentation wget imagecache
---
Today I needed to get Drupal's [ImageCache module](http://drupal.org/project/imagecache) to regenerate a bunch of resized images. ImageCache doesn't create the images until a browser requests them and at that point the new image is saved to the disk for future use.

One way to generate the images would have been to just click my way through every page on the site but I'm way to lazy for that. So I used [wget](http://www.gnu.org/software/wget/):

``` sh
wget -r -nd --delete-after http://example.com
```

By using the recursive (`-r`) and `--delete-after` switches I was able to have
it crawl the site and get all the images generated.

Bonus points for running in on the server so that the connections were via the
loopback interface so the transfer didn't count against the monthly bandwidth
limit.
