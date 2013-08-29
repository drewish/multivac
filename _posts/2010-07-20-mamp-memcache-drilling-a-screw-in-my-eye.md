---
layout: post
title: MAMP + memcache = drilling a screw in my eye
created: 1279659538
categories: documentation memcache mamp
---
Here's yet another blog post to document something so stupid that I hope to
never do it again, but know I will. I spent the better part of the afternoon
trying to get the [PECL memcache](http://pecl.php.net/package/memcache)
extension working with the PHP 5.2 part of a MAMP installation and finally
managed to get it working.

Install XCode

Open up a terminal and become the root user:

``` sh
$ sudo su
```

Make all the MAMP PHP binaries executable:

``` sh
$ chmod u+x /Applications/MAMP/bin/php5.2/bin/p*
```

Now get the memcache source, compile it and copy the library into PHP's
extensions directory:

``` sh
$ cd /tmp

$ wget http://pecl.php.net/get/memcache-2.2.5.tgz

$ tar -zxvf memcache-2.2.5.tgz

$ cd memcached-2.2.5

$ /Applications/MAMP/bin/php5.2/bin/phpize

$ MACOSX_DEPLOYMENT_TARGET=10.6 CFLAGS='-O3 -fno-common -arch i386 -arch x86_64' LDFLAGS='-O3 -arch i386 -arch x86_64' CXXFLAGS='-O3 -fno-common -arch i386 -arch x86_64' ./configure

$ make

$ cp modules/memcache.so /Applications/MAMP/bin/php5.2/lib/php/extensions/no-debug-non-zts-20060613/
```

Tell PHP to load the memcache extension:

``` sh
$ echo 'extension=memcache.so' > /Applications/MAMP/conf/php5.2/php.ini
```


### Sources

- http://www.php.net/manual/en/memcache.installation.php#95063
- http://blog.m-schmidt.eu/2010/03/30/develop-memcached-web-apps-with-xampp-under-mac-os-x/
