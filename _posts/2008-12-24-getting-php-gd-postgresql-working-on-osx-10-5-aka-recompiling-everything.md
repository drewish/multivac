---
layout: post
title: Getting PHP + GD + PostgreSQL working on OSX 10.5 (aka recompiling everything)
created: 1230152777
categories: macports wget postgresql php pdo osx gd drupal documentation
---
Finding myself in need of a PostgreSQL server to test some patches for Drupal core, I've decided to do a follow up to <a href="/node/110">my guide to getting PHP + GD + MySQL installed on OS X</a>. 

Fortunately for me John VanDyk wrote up <a href="http://www.lullabot.com/articles/beginning-drupal-6-and-postgresql-os-x-105-leopard">Beginning with Drupal 6 and PostgreSQL on OS X 10.5 Leopard</a> which covers the nitty gritty of getting PostgreSQL server installed. He doesn't address recompiling PHP so I'll pick up the story there.

<em>Last Updated: June 1, 2009</em> 
<!--break-->

First, a couple of notes on the formatting of this guide. The blocks of shell command typically include the shell prompt (<code>sh-3.2#</code>) when you're copying-and-pasting the command make sure you don't grab that part. Since this is long enough I've omitted large blocks of the compiler output and used <code>[...]</code> to indicated the omission.

<h3>Switch to the root account</h3>
To follow these instructions you need to be running as the root user using the default <code>sh</code> shell. If you've got the correct administrator permissions you can switch users using the <code>sudo</code> command and providing your password.
<code>
amorton@minivac:~% sudo su
Password:
sh-3.2# 
</code>

<h3>Install MacPorts</h3>
Since you have already followed <a href="http://www.lullabot.com/articles/beginning-drupal-6-and-postgresql-os-x-105-leopard">John VanDyk's guide</a> you'll have Mac Ports installed and only need to install a couple of extra packages.

Use <code>port</code> to grab a copy of <code>wget</code> and the GD dependency, <code>jpeg</code>, as well as <code>freetype</code> and <code>t1lib</code> for rendering fonts. You'll might see some other sub-dependencies installed during the process:
<code>
sh-3.2# /opt/local/bin/port install wget +ssl freetype t1lib jpeg
--->  Fetching expat
--->  Attempting to fetch expat-2.0.1.tar.gz from http://downloads.sourceforge.net/expat

[...]

--->  Fetching jpeg
--->  Verifying checksum(s) for jpeg
--->  Extracting jpeg

--->  Applying patches to jpeg
--->  Configuring jpeg
--->  Building jpeg with target all
--->  Staging jpeg into destroot
--->  Installing jpeg 6b_2
--->  Activating jpeg 6b_2
--->  Cleaning jpeg
</code>

<h3>Recompile Apache</h3>
Rather than just installing Apache from MacPorts I want to rebuild in the native OS X locations so I can use the built-in support. I tried to skip over this step but after wasting a bunch of time finally <a href="http://discussions.apple.com/thread.jspa?messageID=5676677&tstart=0">realized it was important</a>. Grab the latest version of Apache 2.2:
<code>
sh-3.2# cd /tmp

sh-3.2# wget http://ftp.wayne.edu/apache/httpd/httpd-2.2.11.tar.bz2
--2008-12-15 18:04:55--  http://ftp.wayne.edu/apache/httpd/httpd-2.2.11.tar.bz2
Resolving ftp.wayne.edu... 141.217.1.55
Connecting to ftp.wayne.edu|141.217.1.55|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 5230130 (5.0M) [application/x-tar]
Saving to: `httpd-2.2.11.tar.bz2'

100%[======================================>] 5,230,130    453K/s   in 9.1s    

2008-12-15 18:05:04 (561 KB/s) - `httpd-2.2.11.tar.bz2' saved [5230130/5230130]
</code>

Extract it:
<code>
sh-3.2# bunzip2 httpd-2.2.11.tar.bz2 

sh-3.2# tar xf httpd-2.2.11.tar
</code>

Compile it:
<code>
sh-3.2# cd httpd-2.2.11

sh-3.2# ./configure --enable-layout=Darwin --enable-mods-shared=all

[...]

sh-3.2# make install
</code>

<h3>Recompile PHP</h3>
Download the latest PHP source:
<code>
sh-3.2# cd /tmp

sh-3.2# wget http://us3.php.net/get/php-5.2.9.tar.bz2/from/this/mirror
--2009-05-19 12:40:42--  http://us3.php.net/get/php-5.2.9.tar.bz2/from/this/mirror
Resolving us3.php.net... 209.41.74.194
Connecting to us3.php.net|209.41.74.194|:80... connected.
HTTP request sent, awaiting response... 302 Found
Location: http://us3.php.net/distributions/php-5.2.9.tar.bz2 [following]
--2009-05-19 12:40:43--  http://us3.php.net/distributions/php-5.2.9.tar.bz2
Connecting to us3.php.net|209.41.74.194|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 10203122 (9.7M) [application/octet-stream]
Saving to: `php-5.2.9.tar.bz2'

100%[======================================>] 10,203,122   308K/s   in 34s     

2009-05-19 12:41:16 (296 KB/s) - `php-5.2.9.tar.bz2' saved [10203122/10203122]
</code>

Extract it:
<code>
sh-3.2# bunzip2 php-5.2.9.tar.bz2

sh-3.2# tar xf php-5.2.9.tar
</code>

Compile it:
<code>
sh-3.2# cd php-5.2.9

sh-3.2# MACOSX_DEPLOYMENT_TARGET=10.5 CFLAGS="-arch ppc -arch ppc64 -arch i386 -arch x86_64 -g -Os -pipe -no-cpp-precomp" CCFLAGS="-arch ppc -arch ppc64 -arch i386 -arch x86_64 -g -Os -pipe" CXXFLAGS="-arch ppc -arch ppc64 -arch i386 -arch x86_64 -g -Os -pipe" LDFLAGS="-arch ppc -arch ppc64 -arch i386 -arch x86_64 -bind_at_load"

sh-3.2# ./configure --prefix=/usr --mandir=/usr/share/man --infodir=/usr/share/info --with-apxs2=/usr/sbin/apxs --with-config-file-path=/private/etc --sysconfdir=/private/etc --enable-cli --with-curl=/opt/local --enable-ftp --enable-mbstring --enable-mbregex --enable-sockets --with-ldap=/usr --with-ldap-sasl --with-kerberos=/usr --with-mime-magic=/etc/apache2/magic --with-zlib-dir=/usr --with-xmlrpc --with-xsl=/usr --without-iconv \
--with-gd --with-png-dir=/usr/X11R6 --with-xpm-dir=/usr/X11R6 --with-jpeg-dir=/opt/local --enable-exif \
--with-freetype-dir=/opt/local --with-t1lib=/opt/local \
--enable-pdo --with-pgsql=/opt/local/lib/postgresql83 --with-pdo-pgsql=/opt/local/lib/postgresql83

[...]

Thank you for using PHP.

sh-3.2# make install
</code>

Test that PHP has the GD and PostgreSQL modules installed:
<code>
sh-3.2# php -m |grep "gd\|pgsql"
gd
pdo_pgsql
pgsql
</code>

If you don't already have a <code>php.ini</code> file you'll need to create one by copying the default:
<code>
sh-3.2# if ( ! test -e /private/etc/php.ini ) ; then echo cp /private/etc/php.ini.default /private/etc/php.ini; fi
</code>

Restart Apache:
<code>
sh-3.2# apachectl restart
</code>

<h3>Clean up</h3>
Once you've got everything working correctly you can remove the source code:
<code>
sh-3.2# rm -r /tmp/php-5.2.* /tmp/httpd-2.2.*
</code>
This it actually pretty optional, when you reboot OS X cleans out the temp directory.
