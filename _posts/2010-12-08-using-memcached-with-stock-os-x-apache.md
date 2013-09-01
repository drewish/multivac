---
layout: post
title: Using memcached with stock OS X Apache
created: 1291863914
categories: macports osx memcache documentation
---
I wanted to use memcached but didn't want to compile all the dependencies by
hand and wanted to use the stock version of Apache that ships with OS X so I
cobbled together the following instructions.

[Install MacPorts](http://www.macports.org/install.php)

Use MacPorts to install memcached:

```sh
sudo port install memcached
```

Use `pecl` to download the latest version of `memcached` and uncompress it:

```sh
cd /tmp
pecl download memcached
tar xvzf memcached-*.tgz
```

Build the extension using MacPort's version of `libmemcached` (which was
installed as a dependency of `memcached`):

```sh
cd memcached-*/
phpize
./configure --with-libmemcached-dir=/opt/local/
sudo make install
```

Enable it by editing `php.ini` and adding the following line:

```
extension=memcached.so
```

Restart Apache:

```sh
sudo apachectl graceful
```

### References

- [Install memcached PHP Extension on OS X Snow Leopard](http://www.glenscott.co.uk/blog/2009/08/30/install-memcached-php-extension-on-os-x-snow-leopard/)


