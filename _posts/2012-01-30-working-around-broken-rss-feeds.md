---
layout: post
title: Working around "broken" RSS feeds
created: 1327943320
categories: nodejs fullfeeds projects
---
Found some more time to work on my [fullfeeds](http://github.com/drewish/fullfeeds)
project over the weekend. Finally getting into Node's everything happens in a
callback spirit, and managing to not make it look like spagetti code.
Discovering the [async module](https://github.com/caolan/async) really helped
but I've probably gone a little overboard with it.

At this point it's following links, extracting and caching page content, and
generating a new feed. But it's still got a way to go:

- [The configuration is hard coded](https://github.com/drewish/fullfeeds/issues/7) — I hope you like the feeds I'm interested in.
- [It doesn't serve up its own feeds](https://github.com/drewish/fullfeeds/issues/4)  — on my server I symlinked its output directory into an Apache webroot to serve the files).
- [Doesn't run as a service](https://github.com/drewish/fullfeeds/issues/2) — I'm using cron to run it hourly.
