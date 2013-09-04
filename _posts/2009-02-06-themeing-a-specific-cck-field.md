---
layout: post
title: Themeing a specific CCK field
created: 1233963510
categories: cck drupal documentation drupal6 themeing
---
I wasted more time that I want to admit do trying to figure this out.

I was trying theme a specific CCK field named `field_images` on all the nodes
where it appears. The `devel_themer` module was listing
`content-field-field_images.tpl.php` as a candidate:

![Screen shot of devel themer](/files/devel_theme_on_my_field.png)

But after copying CCK's `content-field.tpl.php` into my theme and renaming it I
couldn't seem to get the theme to pick it up.

[Roger López](http://drupal.org/user/67977) gave me the frustratingly simple
answer on irc:

> "i think you need to have both templates in place"

duh. Copied `content-field.tpl.php` into my theme and everything worked great.
