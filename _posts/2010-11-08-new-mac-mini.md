---
layout: post
title: New Mac Mini
created: 1289278652
categories: documentation osx
---
I just picked up a <a href="http://www.apple.com/macmini/">new Mac mini servers</a> to replace the one that's been my desktop machine for over <a href="http://drewish.com/content/2008/08/mac_mini_ram_upgrades">2 years</a>. The new server version has two 500GB hard drives (as opposed to the single 120GB drive I've been working with) but no optical drive. That seemed like a bit of an inconvenience since I just bought a MacBook Air and it doesn't have an optical drive either so I picked up a <a href="http://store.apple.com/us/product/MB397G/A">SuperDrive</a> that I can use with either.
 
I ran through the initial install process only to realize that I couldn't setup the drives as a RAID mirror. I found a message board thread that describes <a href="http://discussions.apple.com/message.jspa?messageID=10503244">how to setup the RAID mirror involving the system disk</a>. The short version is boot off the install DVD and use the Disk Utility to create the mirror (which will wipe the disk) then install onto that. 

The install and subsequent updates is starting to approach Windows XP levels. It took three rounds of running Software Update before it finished.

The next big step was running through and updated my <a href="http://drewish.com/content/2009/09/drupal_6_on_snow_leopard">guide to setting up Apache, PHP and MySQL on OS X</a>. The only change I found was that the new Java update means you need to <a href="https://trac.macports.org/ticket/26934">install an additional developer package before you can really use MacPorts</a>.

Other bits:
<ul>
<li>Enable verbose boot mode:
<code>sudo nvram boot-args="-v"</code></li>
<li>Show hidden files in Finder:
<code>defaults write com.apple.finder AppleShowAllFiles TRUE</code></li>
</ul>
