---
layout: post
title: Using Growl to tail a log file
created: 1214336864
categories: documentation php osx
---
Mikey_p from the [Portland Drupal Group](http://groups.drupal.org/portland) pointed me towards a blog post he'd done on [using Growl to watch for PHP errors](http://mikeyp.net/archives/2008/06/how_get_a_pop_notification_a_php_error.html). Always looking to put my fingerprints on something I decided to do the same but using PHP rather than Python.

The short version is [install growlnotify](http://growl.info/documentation/growlnotify.php) then run the following from the terminal:

```
tail -n 0 -f ~/Sites/nm/logs/access_log | php -r 'while ($m = fgets(STDIN)) shell_exec("growlnotify -p 0 AlertTitle -m ". escapeshellarg($m));'
```

Obviously you'll need to use the right filename and change AlertTitle to something more to your liking.

**Update 2013-03-17:** I received an email from Marcel Gleis suggesting the following improvement:


```
tail -n 0 -f php_error.log | php -r 'stream_set_blocking(STDIN, 0);while (true) { sleep(1);$s = "";  while (($line = fgets(STDIN)) !== false) { $s.=$line; } if ($s != "") shell_exec("echo ".escapeshellarg($s)."| growlnotify -p 0");}'
```


As he put it:

> It aggregates multiple lines to one message. So you have less growl boxes on the screen if one page generates more than one error message.
