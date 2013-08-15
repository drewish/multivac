---
layout: post
title: Working around "broken" RSS feeds
created: 1327943320
categories: nodejs fullfeeds projects
---
Found some more time to work on my <a href="http://github.com/drewish/fullfeeds">fullfeeds</a> project over the weekend. Finally getting into Node's everything happens in a callback spirit, and managing to not make it look like spagetti code. Discovering the <a href="https://github.com/caolan/async">async module</a> really helped but I've probably gone a little overboard with it.

At this point it's following links, extracting and caching page content, and generating a new feed. But it's still got a way to go:
- <a href="https://github.com/drewish/fullfeeds/issues/7">The configuration is hard coded</a> — I hope you like the feeds I'm interested in.
- <a href="https://github.com/drewish/fullfeeds/issues/4">It doesn't serve up its own feeds</a>  — on my server I symlinked its output directory into an Apache webroot to serve the files).
- <a href="https://github.com/drewish/fullfeeds/issues/2">Doesn't run as a service</a> — I'm using cron to run it hourly.
