---
layout: post
title: Things I never remember when reinstalling FreeBSD
created: 1162861945
categories: projects freebsd kpsu
---
I totally whacked the KPSU archive machine today. It's one of those standard stories of being stupid and then being in a rush to compound it. So now I'm building a backup machine to stand in while try to rebuild the archive.

Learning from my mistakes:
<ul>
<li>sysinstall is a handy pistol. Use it to shoot yourself in the foot.</li>
<li>dd is your best friend, provided you've got extra disk space. You just make an image of drive you've sort of fucked up and then you can restore back to that image when your troubleshooting go wrong.</li>
<li>If you don't have extra disk space, don't fuck with anything. Go buy another disk, unplug your old drive, re-install FreeBSD, then make a back up image with dd. Seriously.</li>
<li>On a slow machine, don't bother with ports. Use the prebuild binary files. Your life will be much better.</li>
</ul>

A few misc configuration tips:
<ul>
<li>The following is handy in your /etc/rc.conf file:
<code>
ntpdate_enable="YES"
ntpdate_flags="north-america.pool.ntp.org"
allscreens_flags="80x50"
font8x14="NO"
font8x16="swiss-8x16"
font8x8="swiss-8x8"
</code>
</li>
<li>The following makes a nice set of defaults for your /etc/make.conf file:
<code>
WITH_APACHE2=   yes
WITH_PHP5=      yes
DEFAULT_PHP_VER=5

WITHOUT_IPV6=   yes
WITHOUT_X11=    yes
WITHOUT_LDAP=   yes
</code>
</li>
</ul>
