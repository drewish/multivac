---
layout: post
title: Getting PHP + GD + PostgreSQL working on OSX 10.5 (aka recompiling everything)
created: 1230152777
categories: macports wget postgresql php pdo osx gd drupal documentation
---
Finding myself in need of a PostgreSQL server to test some patches for Drupal
core, I've decided to do a follow up to [my guide to getting PHP + GD + MySQL
installed on OS X](/node/110).

Fortunately for me John VanDyk wrote up [Beginning with Drupal 6 and PostgreSQL
on OS X 10.5 Leopard](http://www.lullabot.com/articles/beginning-drupal-6-and-postgresql-os-x-105-leopard)
which covers the nitty gritty of getting PostgreSQL server installed. He
doesn't address recompiling PHP so I'll pick up the story there.

*Last Updated: June 1, 2009*


First, a couple of notes on the formatting of this guide. The blocks of shell
command typically include the shell prompt (`sh-3.2#`) when you're
copying-and-pasting the command make sure you don't grab that part. Since this
is long enough I've omitted large blocks of the compiler output and used `[...]`
to indicated the omission.

### Switch to the root account
To follow these instructions you need to be running as the root user using the
default `sh` shell. If you've got the correct administrator permissions you can
switch users using the `sudo` command and providing your password.

```sh
amorton@minivac:~% sudo su
Password:
sh-3.2#
```


### Install MacPorts
Since you have already followed [John VanDyk's guide](http://www.lullabot.com/articles/beginning-drupal-6-and-postgresql-os-x-105-leopard)
you'll have Mac Ports installed and only need to install a couple of extra
packages.

Use `port` to grab a copy of `wget` and the GD dependency, `jpeg`, as well as
`freetype` and `t1lib` for rendering fonts. You'll might see some other
sub-dependencies installed during the process:

```sh
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
```


### Recompile Apache
Rather than just installing Apache from MacPorts I want to rebuild in the
native OS X locations so I can use the built-in support. I tried to skip over
this step but after wasting a bunch of time finally [realized it was important](http://discussions.apple.com/thread.jspa?messageID=5676677&tstart=0).
Grab the latest version of Apache 2.2:

```sh
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
```


Extract it:

```sh
sh-3.2# bunzip2 httpd-2.2.11.tar.bz2

sh-3.2# tar xf httpd-2.2.11.tar
```


Compile it:

```sh
sh-3.2# cd httpd-2.2.11

sh-3.2# ./configure --enable-layout=Darwin --enable-mods-shared=all

[...]

sh-3.2# make install
```


### Recompile PHP
Download the latest PHP source:

```sh
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
```


Extract it:

```sh
sh-3.2# bunzip2 php-5.2.9.tar.bz2

sh-3.2# tar xf php-5.2.9.tar
```


Compile it:

```sh
sh-3.2# cd php-5.2.9

sh-3.2# MACOSX_DEPLOYMENT_TARGET=10.5 CFLAGS="-arch ppc -arch ppc64 -arch i386 -arch x86_64 -g -Os -pipe -no-cpp-precomp" CCFLAGS="-arch ppc -arch ppc64 -arch i386 -arch x86_64 -g -Os -pipe" CXXFLAGS="-arch ppc -arch ppc64 -arch i386 -arch x86_64 -g -Os -pipe" LDFLAGS="-arch ppc -arch ppc64 -arch i386 -arch x86_64 -bind_at_load"

sh-3.2# ./configure --prefix=/usr --mandir=/usr/share/man --infodir=/usr/share/info --with-apxs2=/usr/sbin/apxs --with-config-file-path=/private/etc --sysconfdir=/private/etc --enable-cli --with-curl=/opt/local --enable-ftp --enable-mbstring --enable-mbregex --enable-sockets --with-ldap=/usr --with-ldap-sasl --with-kerberos=/usr --with-mime-magic=/etc/apache2/magic --with-zlib-dir=/usr --with-xmlrpc --with-xsl=/usr --without-iconv \
--with-gd --with-png-dir=/usr/X11R6 --with-xpm-dir=/usr/X11R6 --with-jpeg-dir=/opt/local --enable-exif \
--with-freetype-dir=/opt/local --with-t1lib=/opt/local \
--enable-pdo --with-pgsql=/opt/local/lib/postgresql83 --with-pdo-pgsql=/opt/local/lib/postgresql83

[...]

Thank you for using PHP.

sh-3.2# make install
```


Test that PHP has the GD and PostgreSQL modules installed:

```sh
sh-3.2# php -m |grep "gd\|pgsql"
gd
pdo_pgsql
pgsql
```


If you don't already have a `php.ini` file you'll need to create one by copying the default:

```sh
sh-3.2# if ( ! test -e /private/etc/php.ini ) ; then echo cp /private/etc/php.ini.default /private/etc/php.ini; fi
```


Restart Apache:

```sh
sh-3.2# apachectl restart
```


### Clean up
Once you've got everything working correctly you can remove the source code:

```sh
sh-3.2# rm -r /tmp/php-5.2.* /tmp/httpd-2.2.*
```

This it actually pretty optional, when you reboot OS X cleans out the temp directory.
