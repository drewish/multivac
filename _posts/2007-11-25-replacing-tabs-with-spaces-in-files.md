---
layout: post
title: Replacing tabs with spaces in files
created: 1196041590
categories: programming documentation unix sed
---
I've got a bunch of source code that I'd written with 4-character wide tabs. I needed to replace them with spaces. I'm ashamed to admit how long it took me to figure out.
<code>
#!/bin/sh
for i in *.[c,h]
do
    expand -t4 $i > tabfree.txt && mv tabfree.txt "$i"
done
</code>
Hopefully by posting this I'll save someone (read: me in six months) some time.
