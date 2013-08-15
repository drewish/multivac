---
layout: post
title: Using memcached with stock OS X Apache
created: 1291863914
categories: macports osx memcache documentation
---
I wanted to use memcached but didn't want to <a href="http://www.glenscott.co.uk/blog/2009/08/30/install-memcached-php-extension-on-os-x-snow-leopard/">compile all the dependencies by hand</a> and wanted to use the stock version of Apache that ships with OS X so I cobbled together the following instructions.

<ol>
<li><a href="http://www.macports.org/install.php">Install MacPorts</a></li>
<li>Use MacPorts to install memcached:
<code>
sudo port install memcached
</code>
</li>
<li>Use <code>pecl</code> to download the latest version of <code>memcached</code> and uncompress it:
<code>
cd /tmp
pecl download memcached
tar xvzf memcached-*.tgz
</code>
</li>
<li>Build the extension using MacPort's version of <code>libmemcached</code> (which was installed as a dependency of <code>memcached</code>):
<code>
cd memcached-*/
phpize
./configure --with-libmemcached-dir=/opt/local/
sudo make install
</code>
</li>
<li>Enable it by editing <code>php.ini</code> and adding the following line:
<code>
extension=memcached.so
</code>
</li>
<li>Restart Apache:
<code>
sudo apachectl graceful
</code>
</li>
</ol>

References:
<ul>
<li><a href="http://www.glenscott.co.uk/blog/2009/08/30/install-memcached-php-extension-on-os-x-snow-leopard/">Install memcached PHP Extension on OS X Snow Leopard</a></li>
</ul>
