---
layout: post
title: Using Growl to tail a log file
created: 1214336864
categories: documentation php osx
---
Mikey_p from the <a href="http://groups.drupal.org/portland">Portland Drupal Group</a> pointed me towards a blog post he'd done on <a href="http://mikeyp.net/archives/2008/06/how_get_a_pop_notification_a_php_error.html">using Growl to watch for PHP errors</a>. Always looking to put my fingerprints on something I decided to do the same but using PHP rather than Python. 

The short version is <a href="http://growl.info/documentation/growlnotify.php">install growlnotify</a> then run the following from the terminal:
<code>
tail -n 0 -f ~/Sites/nm/logs/access_log | php -r 'while ($m = fgets(STDIN)) shell_exec("growlnotify -p 0 AlertTitle -m ". escapeshellarg($m));'
</code>Obviously you'll need to use the right filename and change AlertTitle to something more to your liking.

<strong>Update 2013-03-17:</strong> I received an email from Marcel Gleis suggesting the following improvement:

<code>
tail -n 0 -f php_error.log | php -r 'stream_set_blocking(STDIN, 0);while (true) { sleep(1);$s = "";  while (($line = fgets(STDIN)) !== false) { $s.=$line; } if ($s != "") shell_exec("echo ".escapeshellarg($s)."| growlnotify -p 0");}'
</code>

As he put it:

<blockquote>It aggregates multiple lines to one message. So you have less growl boxes on the screen if one page generates more than one error message.</blockquote>
