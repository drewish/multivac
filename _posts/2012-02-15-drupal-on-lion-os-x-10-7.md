---
layout: post
title: Drupal on Lion (OS X 10.7)
created: 1329324362
categories: documentation php pear osx mysql macports drupal
---
I was half way done adding some info how to setup pecl/pear to my [guide to running Drupal 6 on OS X 10.6](/content/2009/09/drupal_6_on_snow_leopard) before I realized I'd been running Lion for almost nine months. So it seemed like a good excuse to update it for Lion. These might be a little wonky since I did an upgrade rather than a clean install so if you notice anything please drop me a line.

**Note:**I'll save you the trouble of commenting, I am familiar with [MAMP](http://www.mamp.info/en/index.html) but would rather punch myself myself in the face than use it. If you'd like to, go right, but I'm going to continue to compile my own so I know where everything ends up.



<h3>Install XCode</h3>
[Install XCode from the App Store](http://itunes.apple.com/us/app/xcode/id448457090?mt=12).

<h3>Install MacPorts</h3>
Follow the directions to [install Mac Ports](http://www.macports.org/install.php).

<h3>Become root</h3>
To follow these instructions you need to be running as the root user using the default <code>sh</code> shell. If you've got administrator permissions you can open up a Terminal window and switch users using the <code>sudo</code> command then provide your password.


```
amorton@minivac:~% sudo su
Password:
sh-3.2# 
```


<h3>Install MySQL</h3>
Use <code>port</code> to install MySQL:

```
/opt/local/bin/port install mysql5-server
```


You'll need to create the databases:

```
/opt/local/bin/mysql_install_db5 --user=mysql
```


Let launchd know it should start MySQL at startup.

```
/opt/local/bin/port load mysql5-server
```


Secure the server and set a new admin password:

```
/opt/local/bin/mysql_secure_installation5
```


Create a configuration file:

```
cp /opt/local/share/mysql5/mysql/my-large.cnf /etc/my.cnf 
```


Edit <code>/etc/my.cnf</code> using your editor of choice and make the following changes to the <code>[mysqld]</code>:


- Change the maximum packet size to 16M:

```
max_allowed_packet = 16M
</code>
- Enable network access by ensuring the first line is commented out but add the second to limit access to the localhost with the second line:

```
#skip-networking
bind-address = 127.0.0.1
```





Restart MySQL to have the settings changes take effect:

```
/opt/local/etc/LaunchDaemons/org.macports.mysql5/mysql5.wrapper restart
```


A last, optional, step is to create a symlink for the <code>mysql5</code> executable so can be invoked as <code>mysql</code> and <code>mysqldump5</code> as <code>mysqldump</code>:

```
ln -s /opt/local/bin/mysql5 /opt/local/bin/mysql
ln -s /opt/local/bin/mysqldump5 /opt/local/bin/mysqldump
```


<h3>PHP</h3>
You need to create a <code>php.ini</code> file:

```
if ( ! test -e /private/etc/php.ini ) ; then cp /private/etc/php.ini.default /private/etc/php.ini; fi
```


Now open <code>/private/etc/php.ini</code> and set the correct location for MySQL's socket by finding:

```
mysqli.default_socket = /var/mysql/mysql.sock
```


And changing it to:

```
mysqli.default_socket = /opt/local/var/run/mysql5/mysqld.sock 
```


Repeat for both <code>mysql.default_socket</code> and <code>pdo_mysql.default_socket</code>.


While you're editing <code>php.ini</code> you might as well set the timezone to avoid warnings. Locate the <code>date.timezone</code> setting uncomment it (by removing the semi-colon at the beginning of the line) and fill in the [appropriate timezone](http://php.net/manual/en/timezones.php):

```
date.timezone = America/New_York
```


Enable PHP by opening <code>/private/etc/apache2/httpd.conf</code> in the editor of your choice and making the following changes.


- 
Uncomment this line:

```
#LoadModule php5_module        libexec/apache2/libphp5.so
```


- Find and change this one:

```
    DirectoryIndex index.html
```


To this:

```
    DirectoryIndex index.php index.html
```





Then restart Apache:

```
apachectl graceful
```


<h3>Install PEAR / PECL</h3>
I scratched my head for a while on this one before finding [this setup guide](http://akrabat.com/php/setting-up-php-mysql-on-os-x-10-7-lion/).


```
php /usr/lib/php/install-pear-nozlib.phar
```


Then add this line to your <code>php.ini</code>:


```
include_path = ".:/usr/lib/php/pear"
```


Now you can update the channels and upgrade the packages:


```
pear channel-update pear.php.net
pecl channel-update pecl.php.net
pear upgrade-all
```


<h3>Memcache</h3>
You don't need this to run Drupal but I use it on production servers and I want to try to match the setup. 

Use <code>port</code> to install and start <code>memcached</code>:


```
/opt/local/bin/port install memcached
/opt/local/bin/port load memcached
```


Since <code>pecl</code> won't let us pass <code>--with-libmemcached-dir=/opt/local</code> to the configure script, a simple work around is to just add some symlinks:


```
ln -s /opt/local/include/libmemcached /usr/include/
ln -s /opt/local/include/libmemcached-1.0 /usr/include/
ln -s /opt/local/include/libhashkit /usr/include/
ln -s /opt/local/include/libhashkit-1.0 /usr/include/
ln -s /opt/local/lib/libmemcached.dylib /usr/lib/
ln -s /opt/local/lib/libhashkit.dylib /usr/lib/
```


Then we can install the module:


```
pecl install memcached
```


You'll need to edit your <code>/etc/php.ini</code> and add the following line:

```
extension=memcached.so
```


If you want to clean up the symlinks (which will prevent <code>pecl upgrade</code> from being able to upgrade the module) here's how you do it:


```
unlink /usr/include/libmemcached
unlink /usr/include/libmemcached-1.0
unlink /usr/include/libhashkit
unlink /usr/include/libhashkit-1.0
unlink /usr/lib/libmemcached.dylib
unlink /usr/lib/libhashkit.dylib
```


<h3>XDebug</h3>
This is also optional, but I find it's very hand to use with [MacGDBp](http://www.bluestatic.org/software/macgdbp/) to debug those tricky issues.

Use <code>pecl</code> to install XDebug:

```
pecl install xdebug
```


You'll need to edit your <code>/etc/php.ini</code> and add the following lines:

```
zend_extension="/usr/lib/php/extensions/no-debug-non-zts-20090626/xdebug.so"
xdebug.profiler_enable_trigger = 1
```


<h3>My VirtualHost Setup</h3>
I like being able to have multiple Drupal sites a few keystrokes away so I create virtual hosts for d5, d6 and d7 using the following procedure.

Edit <code>/etc/apache2/users/amorton.conf</code> and add a VirtualHost to the Apache config:

```
# This should really be in httpd.conf but i'm keeping it simple by doing it here:
NameVirtualHost *:80

<VirtualHost *:80>
    ServerName d6
    DocumentRoot /Users/amorton/Sites/d6
    <Directory /Users/amorton/Sites/d6>
        AllowOverride All
    </Directory>
</VirtualHost>

<VirtualHost *:80>
    ServerName d7
    DocumentRoot /Users/amorton/Sites/d7
    <Directory /Users/amorton/Sites/d7>
        AllowOverride All
    </Directory>
</VirtualHost>
```


Obviously you'd want to replace <code>amorton</code> with your username.

Add an entries to the <code>/private/etc/hosts</code> file:

```
127.0.0.1       d6
127.0.0.1       d7
```


Now you can view your sites at http://d6/ and http://d7/
