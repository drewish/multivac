---
layout: post
title: Using logrotate and drush for daily Drupal backups
created: 1267923506
categories: documentation logrotate drush drupal 6 drupal
---
If you've got [Drush](http://drupal.org/project/drush) installed—and you really
should—you can use the following recipe to setup a backup system that will
maintain daily backups for the last two weeks. Most of the logrotate
configuration is based on a [Wikibooks book](http://en.wikibooks.org/wiki/MySQL/Administration#Daily_rotated_mysqldump_with_logrotate)
that I found.


### Find the pieces
Make sure logrotate is installed:

``` sh
$ whereis logrotate
```

Which should print something like:

```
logrotate: /usr/sbin/logrotate /etc/logrotate.conf /etc/logrotate.d /usr/share/man/man8/logrotate.8.gz
```

So for this site we'll use the full path `/usr/sbin/logrotate` to run the program.

If you don't know where drush is installed you'll probably want to repeat the
process to determine its location. The site I'm working on right now is hosted
by [May First, a very Drupal friendly ISP](http://mayfirst.org/) (and an
amazing progressive group), so they've installed drush at `/usr/bin/drush`.

drush needs to be able to find the correct settings.php file to connect to your
database. Specify the root of your Drupal site using the `-r` switch. You can
test that it's able to locate your settings using the following command:

``` sh
$ /usr/bin/drush -r ~/dev.rudemechanicalorchestra.org/web sql conf
```

If it works you'll see an array with  your database connection information.

### Hook 'em up
Create the state and configuration files:

``` sh
$ touch ~/.logrotate.state ~/.logrotate.config
```

Edit `~/.logrotate.config` insert the following text:

```
~/backup/dev.sql.gz {
        rotate 7
        daily
        nocompress
        nocopytruncate
        postrotate
          /usr/bin/drush -r ~/dev.rudemechanicalorchestra.org/web/ sql dump | gzip > ~/backup/dev.sql.gz
        endscript
}
```

logrotate expects that the file will already exist so we need to use drush to
create the first one:

``` sh
$ /usr/bin/drush -r ~/dev.rudemechanicalorchestra.org/web/ sql dump | gzip > ~/backup/dev.sql.gz
```

Test that logrotate will work correctly:

``` sh
$ /usr/sbin/logrotate --state=~/.logrotate.state ~/.logrotate.config --debug
```

If everything is working correctly you'll see something like:

```
reading config file /home/members/rmo/sites/dev.rudemechanicalorchestra.org/users/rmodev/.logrotate.config
reading config info for "/home/members/rmo/sites/dev.rudemechanicalorchestra.org/users/rmodev/backup/dev.sql.gz"

Handling 1 logs

rotating pattern: "/home/members/rmo/sites/dev.rudemechanicalorchestra.org/users/rmodev/backup/dev.sql.gz"  after 1 days (7 rotations)
empty log files are rotated, old logs are removed
considering log /home/members/rmo/sites/dev.rudemechanicalorchestra.org/users/rmodev/backup/dev.sql.gz
  log does not need rotating
```


### Schedule it
Edit your crontab:

``` sh
$ crontab -e
```

And add the following line which will run logrotate at midnight:

```
0 0 * * *       /usr/sbin/logrotate --state=~/.logrotate.state ~/.logrotate.config
```


### Sleep a little better
That's it, you should now have two weeks of daily backups. You'll want to check
back on it tomorrow and make sure that the backups are actually occurring and
that the old ones are being renamed to .sql.gz.1, .sql.gz.2, etc.
