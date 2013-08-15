---
layout: post
title: Drupal performance tuning on MediaTemple
created: 1251757618
categories: documentation apc
---
First off make sure you've got the root account enabled and the developer tools enabled.

<h3>Install APC</h3>
Ideally you'd use PECL to install APC but it won't compile on MT's servers.

I was trying to use <a href="http://www.timlinden.com/blog/server/installing-apc-cache-on-media-temple/">these instructions</a> for installing APC but found that they no longer worked. 

Download the source and extract it:
<code>
cd /usr/local/src
wget http://pecl.php.net/get/APC-3.0.19.tgz
tar xvzf APC-3.0.19.tgz 
cd APC-3.0.19
</code>

Compile and install the extension:
<code>
phpize
./configure --enable-apc --enable-apc-mmap --with-apxs2=/usr/sbin/apxs --with-php-config=/usr/bin/php-config
make install
</code>

Tell PHP to load the extension and restart the webserver:
<code>
echo "extension=apc.so" > /etc/php.d/apc.ini
/etc/init.d/httpd restart
</code>

<h3>Tweak your Apache config</h3>
Disable ETags by adding:
<code>FileETag none</code>
to Drupal's .htaccess file.

