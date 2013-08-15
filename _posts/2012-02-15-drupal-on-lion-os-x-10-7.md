---
layout: post
title: Drupal on Lion (OS X 10.7)
created: 1329324362
categories: documentation php pear osx mysql macports drupal
---
I was half way done adding some info how to setup pecl/pear to my <a href="/content/2009/09/drupal_6_on_snow_leopard">guide to running Drupal 6 on OS X 10.6</a> before I realized I'd been running Lion for almost nine months. So it seemed like a good excuse to update it for Lion. These might be a little wonky since I did an upgrade rather than a clean install so if you notice anything please drop me a line.

<strong>Note:</strong>I'll save you the trouble of commenting, I am familiar with <a href="http://www.mamp.info/en/index.html">MAMP</a> but would rather punch myself myself in the face than use it. If you'd like to, go right, but I'm going to continue to compile my own so I know where everything ends up.
<!--break-->
<h3>Install XCode</h3>
<a href="http://itunes.apple.com/us/app/xcode/id448457090?mt=12">Install XCode from the App Store</a>.

<h3>Install MacPorts</h3>
Follow the directions to <a href="http://www.macports.org/install.php">install Mac Ports</a>.

<h3>Become root</h3>
To follow these instructions you need to be running as the root user using the default <code>sh</code> shell. If you've got administrator permissions you can open up a Terminal window and switch users using the <code>sudo</code> command then provide your password.

<code>
amorton@minivac:~% sudo su
Password:
sh-3.2# 
</code>

<h3>Install MySQL</h3>
Use <code>port</code> to install MySQL:
<code>
/opt/local/bin/port install mysql5-server
</code>

You'll need to create the databases:
<code>
/opt/local/bin/mysql_install_db5 --user=mysql
</code>

Let launchd know it should start MySQL at startup.
<code>
/opt/local/bin/port load mysql5-server
</code>

Secure the server and set a new admin password:
<code>
/opt/local/bin/mysql_secure_installation5
</code>

Create a configuration file:
<code>
cp /opt/local/share/mysql5/mysql/my-large.cnf /etc/my.cnf 
</code>

Edit <code>/etc/my.cnf</code> using your editor of choice and make the following changes to the <code>[mysqld]</code>:
<ul>
<li>Change the maximum packet size to 16M:
<code>
max_allowed_packet = 16M
</code></li>
<li>Enable network access by ensuring the first line is commented out but add the second to limit access to the localhost with the second line:
<code>
#skip-networking
bind-address = 127.0.0.1
</code>
</li>
</ul>

Restart MySQL to have the settings changes take effect:
<code>
/opt/local/etc/LaunchDaemons/org.macports.mysql5/mysql5.wrapper restart
</code>

A last, optional, step is to create a symlink for the <code>mysql5</code> executable so can be invoked as <code>mysql</code> and <code>mysqldump5</code> as <code>mysqldump</code>:
<code>
ln -s /opt/local/bin/mysql5 /opt/local/bin/mysql
ln -s /opt/local/bin/mysqldump5 /opt/local/bin/mysqldump
</code>

<h3>PHP</h3>
You need to create a <code>php.ini</code> file:
<code>
if ( ! test -e /private/etc/php.ini ) ; then cp /private/etc/php.ini.default /private/etc/php.ini; fi
</code>

Now open <code>/private/etc/php.ini</code> and set the correct location for MySQL's socket by finding:
<code>
mysqli.default_socket = /var/mysql/mysql.sock
</code>

And changing it to:
<code>
mysqli.default_socket = /opt/local/var/run/mysql5/mysqld.sock 
</code>

Repeat for both <code>mysql.default_socket</code> and <code>pdo_mysql.default_socket</code>.
</li>

While you're editing <code>php.ini</code> you might as well set the timezone to avoid warnings. Locate the <code>date.timezone</code> setting uncomment it (by removing the semi-colon at the beginning of the line) and fill in the <a href="http://php.net/manual/en/timezones.php">appropriate timezone</a>:
<code>
date.timezone = America/New_York
</code>

Enable PHP by opening <code>/private/etc/apache2/httpd.conf</code> in the editor of your choice and making the following changes.
<ul>
<li>
Uncomment this line:
<code>
#LoadModule php5_module        libexec/apache2/libphp5.so
</code>
</li>
<li>Find and change this one:
<code>
    DirectoryIndex index.html
</code>

To this:
<code>
    DirectoryIndex index.php index.html
</code>
</li>
</ul>

Then restart Apache:
<code>
apachectl graceful
</code>

<h3>Install PEAR / PECL</h3>
I scratched my head for a while on this one before finding <a href="http://akrabat.com/php/setting-up-php-mysql-on-os-x-10-7-lion/">this setup guide</a>.

<code>
php /usr/lib/php/install-pear-nozlib.phar
</code>

Then add this line to your <code>php.ini</code>:

<code>
include_path = ".:/usr/lib/php/pear"
</code>

Now you can update the channels and upgrade the packages:

<code>
pear channel-update pear.php.net
pecl channel-update pecl.php.net
pear upgrade-all
</code>

<h3>Memcache</h3>
You don't need this to run Drupal but I use it on production servers and I want to try to match the setup. 

Use <code>port</code> to install and start <code>memcached</code>:

<code>
/opt/local/bin/port install memcached
/opt/local/bin/port load memcached
</code>

Since <code>pecl</code> won't let us pass <code>--with-libmemcached-dir=/opt/local</code> to the configure script, a simple work around is to just add some symlinks:

<code>
ln -s /opt/local/include/libmemcached /usr/include/
ln -s /opt/local/include/libmemcached-1.0 /usr/include/
ln -s /opt/local/include/libhashkit /usr/include/
ln -s /opt/local/include/libhashkit-1.0 /usr/include/
ln -s /opt/local/lib/libmemcached.dylib /usr/lib/
ln -s /opt/local/lib/libhashkit.dylib /usr/lib/
</code>

Then we can install the module:

<code>
pecl install memcached
</code>

You'll need to edit your <code>/etc/php.ini</code> and add the following line:
<code>
extension=memcached.so
</code>

If you want to clean up the symlinks (which will prevent <code>pecl upgrade</code> from being able to upgrade the module) here's how you do it:

<code>
unlink /usr/include/libmemcached
unlink /usr/include/libmemcached-1.0
unlink /usr/include/libhashkit
unlink /usr/include/libhashkit-1.0
unlink /usr/lib/libmemcached.dylib
unlink /usr/lib/libhashkit.dylib
</code>

<h3>XDebug</h3>
This is also optional, but I find it's very hand to use with <a href="http://www.bluestatic.org/software/macgdbp/">MacGDBp</a> to debug those tricky issues.

Use <code>pecl</code> to install XDebug:
<code>
pecl install xdebug
</code>

You'll need to edit your <code>/etc/php.ini</code> and add the following lines:
<code>
zend_extension="/usr/lib/php/extensions/no-debug-non-zts-20090626/xdebug.so"
xdebug.profiler_enable_trigger = 1
</code>

<h3>My VirtualHost Setup</h3>
I like being able to have multiple Drupal sites a few keystrokes away so I create virtual hosts for d5, d6 and d7 using the following procedure.

Edit <code>/etc/apache2/users/amorton.conf</code> and add a VirtualHost to the Apache config:
<code>
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
</code>

Obviously you'd want to replace <code>amorton</code> with your username.

Add an entries to the <code>/private/etc/hosts</code> file:
<code>
127.0.0.1       d6
127.0.0.1       d7
</code>

Now you can view your sites at http://d6/ and http://d7/
