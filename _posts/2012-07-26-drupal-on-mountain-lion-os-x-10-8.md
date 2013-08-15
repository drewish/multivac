---
layout: post
title: Drupal on Mountain Lion (OS X 10.8)
created: 1343318550
categories: documentation php pear osx mysql macports drupal
---
The instructions still need some work. I'd did some updating but haven't tried using it with a clean install yet. After reading <a href="http://coolestguyplanettech.com/downtown/install-and-configure-apache-mysql-php-and-phpmyadmin-osx-108-mountain-lion">this</a> it sounds like there's some bigger changes. I've also been trying to switch from macports to  homebrew so that'll also mean some changes to this.

<h3>Install XCode</h3>
<a href="http://itunes.apple.com/us/app/xcode/id448457090?mt=12">Install XCode from the App Store</a>. Run Xcode and open its Preferences (&#8984;+,) select the Downloads tab and then the Components sub-tab. Click the Install button on the Command Line Tools component. 

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
/opt/local/bin/port install mysql55-server
</code>

You'll need to create the databases:
<code>
sudo -u _mysql /opt/local/lib/mysql55/bin/mysql_install_db
</code>

Let launchd know it should start MySQL at startup.
<code>
/opt/local/bin/port load mysql55-server
</code>

Secure the server and set a new admin password:
<code>
/opt/local/lib/mysql55/bin/mysql_secure_installation
</code>

Create a configuration file:
<code>
cp /opt/local/share/mysql55/support-files/my-large.cnf /etc/my.cnf 
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
port unload mysql55-server
port load mysql55-server
</code>

A last, optional, step is to create some symlinks for the executables so they're in the path:
<code>
ln -s /opt/local/lib/mysql55/bin/mysql /opt/local/bin/mysql
ln -s /opt/local/lib/mysql55/bin/mysqldump /opt/local/bin/mysqldump
ln -s /opt/local/lib/mysql55/bin/mysqlimport /opt/local/bin/mysqlimport
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

<h3>Drush</h3>
If you're doing anything with Drupal you'll find <a href="http://drupal.org/project/drush">Drush</a> to be indispensable. 

<code>
pear channel-discover pear.drush.org
pear install drush/drush
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
This is also optional, but I find it's very hand to use with <a href="http://www.bluestatic.org/software/macgdbp/">MacGDBp</a> to debug those tricky issues. It's also nice to use with webgrind for profiling.

Use <code>pecl</code> to install XDebug:
<code>
pecl install xdebug
</code>

You'll need to edit your <code>/etc/php.ini</code> uncomment the following line:
<code>
zend_extension="/usr/lib/php/extensions/no-debug-non-zts-20090626/xdebug.so"
</code>

Then add this one:
<code>
xdebug.profiler_enable_trigger = 1
</code>
Which lets you enable the profiler by appending <code>XDEBUG_PROFILE=1</code> in the query of a URL.

<h3>My VirtualHost Setup</h3>
I like being able to have multiple Drupal sites a few keystrokes away so I create virtual hosts for d5, d6 and d7 using the following procedure.

Edit <code>/etc/apache2/users/amorton.conf</code> and add a VirtualHost to the Apache config:
<code>
# This should really be in httpd.conf but i'm keeping it simple by doing it here:
NameVirtualHost *:80

<VirtualHost *:80>
    ServerName d7
    DocumentRoot /Users/amorton/Sites/d7
    <Directory /Users/amorton/Sites/d7>
        AllowOverride All
        Allow from all
    </Directory>
</VirtualHost>

<VirtualHost *:80>
    ServerName d8
    DocumentRoot /Users/amorton/Sites/d8
    <Directory /Users/amorton/Sites/d8>
        AllowOverride All
        Allow from all
    </Directory>
</VirtualHost>
</code>

Obviously you'd want to replace <code>amorton</code> with your username.

Add an entries to the <code>/private/etc/hosts</code> file:
<code>
127.0.0.1       d7
127.0.0.1       d8
</code>

Now you can view your sites at http://d7/ and http://d8/
