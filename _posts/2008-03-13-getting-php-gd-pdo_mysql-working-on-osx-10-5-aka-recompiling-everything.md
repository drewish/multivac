---
layout: post
title: Getting PHP + GD + pdo_mysql working on OSX 10.5 (aka recompiling everything)
created: 1205397905
categories: documentation wget php pdo osx mysql macports gd drupal
---
This guide walks through the steps necessary to setup PHP on Leopard in order to run the HEAD version of Drupal. The basic steps are installing several prerequisites then recompiling Apache and PHP from source. It could totally bork your system, I'm just writing it down so the next time I need to do this I can remember what I did. I wish I could give credit to all the places I stole bits from but I didn't do a good job of keeping notes early on.

Every time Apple releases a security update it seems to end up overwriting PHP or Apache and I end up revisiting these instructions. Since it's my personal guide I'm continually modifying it to match my current needs. For example, the last big change was adding in old `mysql` extension and the new `PDO-mysql` extension. The upside for you, kind reader, is that this keeps the instructions up-to-date. The down side is that when you come back in two months and try to repeat one part of this it may not work because I've changed some of the earlier steps.

*Last Updated: August 26, 2009*

First, a couple of notes on the formatting of this guide. The blocks of shell command typically include the shell prompt `sh-3.2`) when you're copying-and-pasting the command make sure you don't grab that part. Since this is long enough I've omitted large blocks of the compiler output and used ` to indicated the omission.

<h3>Switch to the root account</h3>
To follow these instructions you need to be running as the root user using the default `sh` shell. If you've got the correct administrator permissions you can switch users using the `sudo` command and providing your password.

```
amorton@minivac:~% sudo su
Password:
sh-3.2#
```


<h3>Install MacPorts</h3>
Follow the directions to [install Mac Ports](http://www.macports.org/install.php).

Then use `port` to grab a copy of `wget` and the GD dependency, `jpeg`, as well as `freetype` and `t1lib` for rendering fonts. You'll probably be in for a half our wait while a bunch of dependencies installed if this is the first time you've installed anything with `port`:

```
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


<h3>Recompile Apache</h3>
Rather than just installing Apache from MacPorts I want to rebuild in the native OS X locations so I can use the built-in support. I tried to skip over this step but after wasting a bunch of time finally [realized it was important](http://discussions.apple.com/thread.jspa?messageID=5676677&tstart=0). Grab the latest version of Apache 2.2:

```
sh-3.2# cd /tmp

sh-3.2# wget http://www.ibiblio.org/pub/mirrors/apache/httpd/httpd-2.2.13.tar.bz2
--2009-08-26 23:44:12--  http://www.ibiblio.org/pub/mirrors/apache/httpd/httpd-2.2.13.tar.bz2
Resolving www.ibiblio.org... 152.46.7.80
Connecting to www.ibiblio.org|152.46.7.80|:80... connected.
HTTP request sent, awaiting response... 301 Moved Permanently
Location: http://mirrors.ibiblio.org/pub/mirrors/apache/httpd/httpd-2.2.13.tar.bz2 [following]
--2009-08-26 23:44:12--  http://mirrors.ibiblio.org/pub/mirrors/apache/httpd/httpd-2.2.13.tar.bz2
Resolving mirrors.ibiblio.org... 152.46.7.65
Connecting to mirrors.ibiblio.org|152.46.7.65|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 5300199 (5.1M) [application/x-bzip2]
Saving to: `httpd-2.2.13.tar.bz2'

100%[======================================>] 5,300,199    301K/s   in 19s

2009-08-26 23:44:31 (276 KB/s) - `httpd-2.2.13.tar.bz2' saved [5300199/5300199]

```


Extract it:

```
sh-3.2# bunzip2 httpd-2.2.13.tar.bz2

sh-3.2# tar xf httpd-2.2.13.tar
```


Compile it:

```
sh-3.2# cd httpd-2.2.13

sh-3.2# ./configure --enable-layout=Darwin --enable-mods-shared=all

[...]

sh-3.2# make install
```


<h3>Install MySQL</h3>
You only need to follow this step once. If you're re-installing PHP due to an OS X update you safely skip down to the Recompile PHP section.

Use port to install MySQL:

```
sh-3.2# port install mysql5 +server
--->  Fetching mysql5
--->  Verifying checksum(s) for mysql5
--->  Extracting mysql5
--->  Configuring mysql5
--->  Building mysql5 with target all
--->  Staging mysql5 into destroot
--->  Creating launchd control script
###########################################################
# A startup item has been generated that will aid in
# starting mysql5 with launchd. It is disabled
# by default. Execute the following command to start it,
# and to cause it to launch at startup:
#
# sudo launchctl load -w /Library/LaunchDaemons/org.macports.mysql5.plist
###########################################################
--->  Installing mysql5 5.0.51_0+server
******************************************************
* In order to setup the database, you might want to run
* sudo -u mysql mysql_install_db5
* if this is a new install
******************************************************
--->  Activating mysql5 5.0.51_0+server
--->  Cleaning mysql5
```

You'll need to create the databases:

```
sh-3.2# /opt/local/lib/mysql5/bin/mysql_install_db --user=mysql
Installing MySQL system tables...
080618  0:14:33 [Warning] Setting lower_case_table_names=2 because file system for /opt/local/var/db/mysql5/ is case insensitive
OK
Filling help tables...
080618  0:14:34 [Warning] Setting lower_case_table_names=2 because file system for /opt/local/var/db/mysql5/ is case insensitive
OK

[...]
```

Let launchd know it should start MySQL at startup.

```
sh-3.2# launchctl load -w /Library/LaunchDaemons/org.macports.mysql5.plist
```

Create a symlink for the `mysql5` executable so it can be invoked as `mysql` (the way that the `mysql_secure_installation` script expects it to be named):

```
sh-3.2# ln -s /opt/local/bin/mysql5 /opt/local/bin/mysql
```

Secure the server and set a new admin password:

```
sh-3.2# /opt/local/lib/mysql5/bin/mysql_secure_installation
```

Create a configuration file:

```
sh-3.2# cp /opt/local/share/mysql5/mysql/my-large.cnf /etc/my.cnf
```

Finally create some symlinks so that PHP can find the insanely installed MySQL headers and libraries:

```
sh-3.2# ln -s /opt/local/lib/mysql5/mysql /opt/local/lib/mysql

sh-3.2# ln -s /opt/local/include/mysql5/mysql /opt/local/include/mysql
```


<h3>Recompile PHP</h3>
Download the latest PHP source:

```
sh-3.2# cd /tmp

sh-3.2# wget http://us3.php.net/get/php-5.2.10.tar.bz2/from/this/mirror
--2009-08-26 12:17:55--  http://us3.php.net/get/php-5.2.10.tar.bz2/from/this/mirror
Resolving us3.php.net... 209.41.74.194
Connecting to us3.php.net|209.41.74.194|:80... connected.
HTTP request sent, awaiting response... 302 Found
Location: http://us3.php.net/distributions/php-5.2.10.tar.bz2 [following]
--2009-08-26 12:17:56--  http://us3.php.net/distributions/php-5.2.10.tar.bz2
Connecting to us3.php.net|209.41.74.194|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 8808759 (8.4M) [application/octet-stream]
Saving to: `php-5.2.10.tar.bz2'

100%[======================================>] 8,808,759   54.4K/s   in 1m 56s

2009-08-26 12:19:54 (74.0 KB/s) - `php-5.2.10.tar.bz2' saved [8808759/8808759]
```

Extract it:

```
sh-3.2# bunzip2 php-5.2.10.tar.bz2

sh-3.2# tar xf php-5.2.10.tar
```

Compile it:

```
sh-3.2# cd php-5.2.10

sh-3.2# MACOSX_DEPLOYMENT_TARGET=10.5 CFLAGS="-arch ppc -arch ppc64 -arch i386 -arch x86_64 -g -Os -pipe -no-cpp-precomp" CCFLAGS="-arch ppc -arch ppc64 -arch i386 -arch x86_64 -g -Os -pipe" CXXFLAGS="-arch ppc -arch ppc64 -arch i386 -arch x86_64 -g -Os -pipe" LDFLAGS="-arch ppc -arch ppc64 -arch i386 -arch x86_64 -bind_at_load"

sh-3.2# ./configure --prefix=/usr --mandir=/usr/share/man --infodir=/usr/share/info --with-apxs2=/usr/sbin/apxs --with-config-file-path=/private/etc --sysconfdir=/private/etc --enable-cli --with-curl=/opt/local --enable-ftp --enable-mbstring --enable-mbregex --enable-sockets --with-ldap=/usr --with-ldap-sasl --with-kerberos=/usr --with-mime-magic=/etc/apache2/magic --with-zlib-dir=/usr --with-xmlrpc --with-xsl=/usr --without-iconv \
--with-gd --with-png-dir=/usr/X11R6 --with-xpm-dir=/usr/X11R6 --with-jpeg-dir=/opt/local --enable-exif \
--with-freetype-dir=/opt/local --with-t1lib=/opt/local \
--enable-pdo --with-mysqli=/opt/local/bin/mysql_config5 --with-pdo-mysql=/opt/local/bin/mysql_config5 --with-mysql=/opt/local --with-mysql-sock=/opt/local/var/run/mysql5/mysqld.sock

[...]

Thank you for using PHP.

sh-3.2# make install
```

Test that PHP has the GD and MySQL modules installed:

```
sh-3.2#  php -m |grep "gd\|mysql"
gd
mysql
mysqli
pdo_mysql
```

If you don't already have a `php.ini` file you'll need to create one by copying the default:

```
sh-3.2# if ( ! test -e /private/etc/php.ini ) ; then cp /private/etc/php.ini.default /private/etc/php.ini; fi
```

Restart Apache:

```
sh-3.2# apachectl restart
```


<h3>Clean up</h3>
Once you've got everything working correctly you can remove the source code:

```
sh-3.2# rm -r /tmp/php-5.2.* /tmp/httpd-2.2.*
```

This it actually pretty optional, when you reboot OS X cleans out the temp directory.
