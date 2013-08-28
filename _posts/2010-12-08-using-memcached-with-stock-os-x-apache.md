---
layout: post
title: Using memcached with stock OS X Apache
created: 1291863914
categories: macports osx memcache documentation
---
I wanted to use memcached but didn't want to [compile all the dependencies by hand](http://www.glenscott.co.uk/blog/2009/08/30/install-memcached-php-extension-on-os-x-snow-leopard/) and wanted to use the stock version of Apache that ships with OS X so I cobbled together the following instructions.

<ol>
- [Install MacPorts](http://www.macports.org/install.php)
- Use MacPorts to install memcached:

```
sudo port install memcached
```


- Use <code>pecl</code> to download the latest version of <code>memcached</code> and uncompress it:

```
cd /tmp
pecl download memcached
tar xvzf memcached-*.tgz
```


- Build the extension using MacPort's version of <code>libmemcached</code> (which was installed as a dependency of <code>memcached</code>):

```
cd memcached-*/
phpize
./configure --with-libmemcached-dir=/opt/local/
sudo make install
```


- Enable it by editing <code>php.ini</code> and adding the following line:

```
extension=memcached.so
```


- Restart Apache:

```
sudo apachectl graceful
```


</ol>

References:


- [Install memcached PHP Extension on OS X Snow Leopard](http://www.glenscott.co.uk/blog/2009/08/30/install-memcached-php-extension-on-os-x-snow-leopard/)


