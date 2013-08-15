---
layout: post
title: Using logrotate and drush for daily Drupal backups
created: 1267923506
categories: documentation logrotate drush drupal 6 drupal
---
If you've got <a href="http://drupal.org/project/drush">Drush</a> installed—and you really should—you can use the following recipe to setup a backup system that will maintain daily backups for the last two weeks. Most of the logrotate configuration is based on a <a href="http://en.wikibooks.org/wiki/MySQL/Administration#Daily_rotated_mysqldump_with_logrotate">Wikibooks book</a> that I found.
<!--break-->
<h3>Find the pieces</h3>
Make sure logrotate is installed:
<code>
whereis logrotate
</code>

Which should print something like:
<code>
logrotate: /usr/sbin/logrotate /etc/logrotate.conf /etc/logrotate.d /usr/share/man/man8/logrotate.8.gz
</code>

So for this site we'll use the full path <code>/usr/sbin/logrotate</code> to run the program.

If you don't know where drush is installed you'll probably want to repeat the process to determine its location. The site I'm working on right now is hosted by <a href="http://mayfirst.org/">May First, a very Drupal friendly ISP</a> (and an amazing progressive group), so they've installed drush at <code>/usr/bin/drush</code>.

drush needs to be able to find the correct settings.php file to connect to your database. Specify the root of your Drupal site using the <code>-r</code> switch. You can test that it's able to locate your settings using the following command:
<code>
/usr/bin/drush -r ~/dev.rudemechanicalorchestra.org/web sql conf
</code>

If it works you'll see an array with  your database connection information.

<h3>Hook 'em up</h3>
Create the state and configuration files:
<code>
touch ~/.logrotate.state ~/.logrotate.config
</code>

Edit <code>~/.logrotate.config</code> insert the following text:
<code>
~/backup/dev.sql.gz {
        rotate 7
        daily
        nocompress
        nocopytruncate
        postrotate
          /usr/bin/drush -r ~/dev.rudemechanicalorchestra.org/web/ sql dump | gzip > ~/backup/dev.sql.gz
        endscript
}
</code>

logrotate expects that the file will already exist so we need to use drush to create the first one:
<code>
/usr/bin/drush -r ~/dev.rudemechanicalorchestra.org/web/ sql dump | gzip > ~/backup/dev.sql.gz
</code>

Test that logrotate will work correctly:
<code>
/usr/sbin/logrotate --state=~/.logrotate.state ~/.logrotate.config --debug
</code>

If everything is working correctly you'll see something like:
<code>
reading config file /home/members/rmo/sites/dev.rudemechanicalorchestra.org/users/rmodev/.logrotate.config
reading config info for "/home/members/rmo/sites/dev.rudemechanicalorchestra.org/users/rmodev/backup/dev.sql.gz" 

Handling 1 logs

rotating pattern: "/home/members/rmo/sites/dev.rudemechanicalorchestra.org/users/rmodev/backup/dev.sql.gz"  after 1 days (7 rotations)
empty log files are rotated, old logs are removed
considering log /home/members/rmo/sites/dev.rudemechanicalorchestra.org/users/rmodev/backup/dev.sql.gz
  log does not need rotating
</code>

<h3>Schedule it</h3>
Edit your crontab:
<code>
crontab -e
</code>

And add the following line which will run logrotate at midnight:
<code>
0 0 * * *       /usr/sbin/logrotate --state=~/.logrotate.state ~/.logrotate.config
</code>

<h3>Sleep a little better</h3>
That's it, you should now have two weeks of daily backups. You'll want to check back on it tomorrow and make sure that the backups are actually occurring and that the old ones are being renamed to .sql.gz.1, .sql.gz.2, etc.
