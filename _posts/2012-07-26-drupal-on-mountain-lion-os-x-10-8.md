---
layout: post
title: Drupal on Mountain Lion (OS X 10.8)
created: 1343318550
categories: documentation php pear osx mysql macports drupal
---
The instructions still need some work. I'd did some updating but haven't tried using it with a clean install yet. After reading [this](http://coolestguyplanettech.com/downtown/install-and-configure-apache-mysql-php-and-phpmyadmin-osx-108-mountain-lion) it sounds like there's some bigger changes. I've also been trying to switch from macports to  homebrew so that'll also mean some changes to this.

### Install XCode
[Install XCode from the App Store](http://itunes.apple.com/us/app/xcode/id448457090?mt=12). Run Xcode and open its Preferences (&#8984;+,) select the Downloads tab and then the Components sub-tab. Click the Install button on the Command Line Tools component.

### Install MacPorts
Follow the directions to [install Mac Ports](http://www.macports.org/install.php).

### Become root
To follow these instructions you need to be running as the root user using the default `sh` shell. If you've got administrator permissions you can open up a Terminal window and switch users using the `sudo` command then provide your password.


``` sh
amorton@minivac:~% sudo su
Password:
sh-3.2#
```


### Install MySQL
Use `port` to install MySQL:

```sh
/opt/local/bin/port install mysql55-server
```


You'll need to create the databases:

```sh
sudo -u _mysql /opt/local/lib/mysql55/bin/mysql_install_db
```


Let launchd know it should start MySQL at startup.

```sh
/opt/local/bin/port load mysql55-server
```


Secure the server and set a new admin password:

```sh
/opt/local/lib/mysql55/bin/mysql_secure_installation
```


Create a configuration file:

```sh
cp /opt/local/share/mysql55/support-files/my-large.cnf /etc/my.cnf
```


Edit `/etc/my.cnf` using your editor of choice and make the following changes to the `[mysqld]`:


- Change the maximum packet size to 16M:

```
max_allowed_packet = 16M
```

- Enable network access by ensuring the first line is commented out but add the second to limit access to the localhost with the second line:

```
#skip-networking
bind-address = 127.0.0.1
```


Restart MySQL to have the settings changes take effect:

```sh
port unload mysql55-server
port load mysql55-server
```


A last, optional, step is to create some symlinks for the executables so they're in the path:

```sh
ln -s /opt/local/lib/mysql55/bin/mysql /opt/local/bin/mysql
ln -s /opt/local/lib/mysql55/bin/mysqldump /opt/local/bin/mysqldump
ln -s /opt/local/lib/mysql55/bin/mysqlimport /opt/local/bin/mysqlimport
```


### PHP
You need to create a `php.ini` file:

```sh
if ( ! test -e /private/etc/php.ini ) ; then cp /private/etc/php.ini.default /private/etc/php.ini; fi
```


Now open `/private/etc/php.ini` and set the correct location for MySQL's socket by finding:

```
mysqli.default_socket = /var/mysql/mysql.sock
```


And changing it to:

```
mysqli.default_socket = /opt/local/var/run/mysql5/mysqld.sock
```


Repeat for both `mysql.default_socket` and `pdo_mysql.default_socket`.


While you're editing `php.ini` you might as well set the timezone to avoid warnings. Locate the `date.timezone` setting uncomment it (by removing the semi-colon at the beginning of the line) and fill in the [appropriate timezone](http://php.net/manual/en/timezones.php):

```
date.timezone = America/New_York
```


Enable PHP by opening `/private/etc/apache2/httpd.conf` in the editor of your choice and making the following changes.


- Uncomment this line:
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

```sh
apachectl graceful
```


### Install PEAR / PECL
I scratched my head for a while on this one before finding [this setup guide](http://akrabat.com/php/setting-up-php-mysql-on-os-x-10-7-lion/).


```sh
php /usr/lib/php/install-pear-nozlib.phar
```

Then add this line to your `php.ini`:

```
include_path = ".:/usr/lib/php/pear"
```

Now you can update the channels and upgrade the packages:

```sh
pear channel-update pear.php.net
pecl channel-update pecl.php.net
pear upgrade-all
```


### Drush
If you're doing anything with Drupal you'll find [Drush](http://drupal.org/project/drush) to be indispensable.


```sh
pear channel-discover pear.drush.org
pear install drush/drush
```


### Memcache
You don't need this to run Drupal but I use it on production servers and I want to try to match the setup.

Use `port` to install and start `memcached`:


```sh
/opt/local/bin/port install memcached
/opt/local/bin/port load memcached
```


Since `pecl` won't let us pass `--with-libmemcached-dir=/opt/local` to the configure script, a simple work around is to just add some symlinks:


```sh
ln -s /opt/local/include/libmemcached /usr/include/
ln -s /opt/local/include/libmemcached-1.0 /usr/include/
ln -s /opt/local/include/libhashkit /usr/include/
ln -s /opt/local/include/libhashkit-1.0 /usr/include/
ln -s /opt/local/lib/libmemcached.dylib /usr/lib/
ln -s /opt/local/lib/libhashkit.dylib /usr/lib/
```

Then we can install the module:

```sh
pecl install memcached
```

You'll need to edit your `/etc/php.ini` and add the following line:

```sh
extension=memcached.so
```

If you want to clean up the symlinks (which will prevent `pecl upgrade` from being able to upgrade the module) here's how you do it:

```sh
unlink /usr/include/libmemcached
unlink /usr/include/libmemcached-1.0
unlink /usr/include/libhashkit
unlink /usr/include/libhashkit-1.0
unlink /usr/lib/libmemcached.dylib
unlink /usr/lib/libhashkit.dylib
```


### XDebug
This is also optional, but I find it's very hand to use with [MacGDBp](http://www.bluestatic.org/software/macgdbp/) to debug those tricky issues. It's also nice to use with webgrind for profiling.

Use `pecl` to install XDebug:

```sh
pecl install xdebug
```


You'll need to edit your `/etc/php.ini` uncomment the following line:

```sh
zend_extension="/usr/lib/php/extensions/no-debug-non-zts-20090626/xdebug.so"
```


Then add this one:

```
xdebug.profiler_enable_trigger = 1
```

Which lets you enable the profiler by appending `XDEBUG_PROFILE=1` in the query of a URL.

### My VirtualHost Setup
I like being able to have multiple Drupal sites a few keystrokes away so I create virtual hosts for d5, d6 and d7 using the following procedure.

Edit `/etc/apache2/users/amorton.conf` and add a VirtualHost to the Apache config:

```xml
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
```


Obviously you'd want to replace `amorton` with your username.

Add an entries to the `/private/etc/hosts` file:

```
127.0.0.1       d7
127.0.0.1       d8
```

Now you can view your sites at http://d7/ and http://d8/
