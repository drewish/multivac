---
layout: post
title: Drupal performance tuning on MediaTemple
created: 1251757618
categories: documentation apc
---
First off make sure you've got the root account enabled and the developer tools enabled.

### Install APC
Ideally you'd use PECL to install APC but it won't compile on MT's servers.

I was trying to use [these instructions](http://www.timlinden.com/blog/server/installing-apc-cache-on-media-temple/) for installing APC but found that they no longer worked.

Download the source and extract it:

```sh
cd /usr/local/src
wget http://pecl.php.net/get/APC-3.0.19.tgz
tar xvzf APC-3.0.19.tgz
cd APC-3.0.19
```

Compile and install the extension:

```sh
phpize
./configure --enable-apc --enable-apc-mmap --with-apxs2=/usr/sbin/apxs --with-php-config=/usr/bin/php-config
make install
```

Tell PHP to load the extension and restart the webserver:

```sh
echo "extension=apc.so" > /etc/php.d/apc.ini
/etc/init.d/httpd restart
```

### Tweak your Apache config
Disable ETags by adding:

```
FileETag none
```

to Drupal's `.htaccess` file.

