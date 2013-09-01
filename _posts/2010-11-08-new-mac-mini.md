---
layout: post
title: New Mac Mini
created: 1289278652
categories: documentation osx
---
I just picked up a [new Mac mini servers](http://www.apple.com/macmini/) to
replace the one that's been my desktop machine for over [2 years](http://drewish.com/content/2008/08/mac_mini_ram_upgrades).
The new server version has two 500GB hard drives (as opposed to the single
120GB drive I've been working with) but no optical drive. That seemed like a
bit of an inconvenience since I just bought a MacBook Air and it doesn't have
an optical drive either so I picked up a [SuperDrive](http://store.apple.com/us/product/MB397G/A)
that I can use with either.

I ran through the initial install process only to realize that I couldn't setup
the drives as a RAID mirror. I found a message board thread that describes
[how to setup the RAID mirror involving the system disk](http://discussions.apple.com/message.jspa?messageID=10503244).
The short version is boot off the install DVD and use the Disk Utility to
create the mirror (which will wipe the disk) then install onto that.

The install and subsequent updates is starting to approach Windows XP levels.
It took three rounds of running Software Update before it finished.

The next big step was running through and updated my [guide to setting up
Apache, PHP and MySQL on OS X](http://drewish.com/content/2009/09/drupal_6_on_snow_leopard).
The only change I found was that the new Java update means you need to
[install an additional developer package before you can really use MacPorts](https://trac.macports.org/ticket/26934).

Other bits:

- Enable verbose boot mode:
```sudo nvram boot-args="-v"```
- Show hidden files in Finder:
```defaults write com.apple.finder AppleShowAllFiles TRUE```



