---
layout: post
title: Media sprinting
created: 1216864486
categories: work drupal portland media/files sprint
---

So back in April I started talking to Keiran at about doing a media and files
sprint... well it's finally happening. aaronwinborn in in Portland and dopry is
going to be helping remotely. Aaron posted [a great writeup on what we're
hoping to accomplish](http://aaronwinborn.com/blogs/aaron/media-code-sprint-top-3-goals)
so I'll blockquote at length:


Andrew Morton ([drewish](http://drupal.org/user/34869)), Darrel O'Pry
([dopry](http://drupal.org/user/22202), remotely), and I are heading up a
[Media Code Sprint](http://groups.drupal.org/node/11810) in Portland this week!
Come help, in person or remotely, if you're interested in multimedia and Drupal!
It has now officially started, and as I've volunteered to help keep folks
updated, here goes...


First the reasons.

<h2>Number One: Better Media Handling in Core</h2>

Dries conducted a survey prior to his [State of Drupal](http://buytaert.net/starting-to-work-on-drupal-7) presentation at Boston Drupalcon 2008, and **number one** on the top ten (or 11) list of what would make THE KILLER DRUPAL 7 Release was "Better media handling".


Let me repeat that. **Better media handling**.


People have done really amazing stuff in contrib, but it is difficult (if not impossible in many cases) for developers to coordinate the use of files, as there is no good means for file handling in the core of Drupal. Thus, we have several dozen (or more) media modules doing some small part, or even duplicating functionality, sometimes out of necessity.



We need (better) media and file handling in Drupal core. In particular, there has been a [patch for a hook_file](http://drupal.org/node/142995) in the queue for over a year, which has been in the [Patch Spotlight](http://drupal.org/patch/spotlight) (for the second time, no less) since May! (And has been RTBC several times during that process...) Come on folks.


One of the powers of Drupal is its system of hooks. We have hooks to modify nodes, to notify changes to user objects, to alter nearly any data (such as forms and menus). Noticeably absent is a consistent handling for files or any sort of notification. We need hook_file.


So goal **Number One: get media handling in core**. *The means?* [Add hook_file and make files into a 1st class Drupal object](http://drupal.org/node/142995). We'll be creating a test suite for functionality in the hook_file patch to validate it and "grease the wheels" to get it committed.



The other goals of this sprint pale in comparison to the first in utility, but are still highly desirable and worthwhile.

<h2>Number Two: Refactor File Functionality in Core</h2>

As an extension to the first goal, there is a lot of inconsistency with how Drupal currently handles files. For instance, in some areas a function may return an object, and in others a string. Additionally, some functions are misnamed, or try to do too much to be useful as a file API.


Some specific examples: for what it does, [file_check_directory](http://api.drupal.org/api/function/file_check_directory/6) may be better suited as something like file_check_writable, or maybe even split into that and file_check_make_writable. Also, for instance, [file_scan_directory](http://api.drupal.org/api/function/file_scan_directory/6) needs to return file objects, rather than the current <cite>associative array (keyed on the provided key) of objects with "path", "basename", and "name" members corresponding to the matching files.</cite> (The function does what it needs to, but the returned objects have keys not corresponding to anything else used in core.)



So goal **Number Two: refactor file functionality in core**. *The means?* Go through and check for (and fix!) existing file functionality for documentation and consistency.

<h2>Number Three: Spruce up Existing Contributed Media Modules</h2>

There are several much needed multimedia modules that have not yet been upgraded to Drupal 6 (or which are still in heavy progress). This includes (but is not limited to) [Image Field](http://drupal.org/project/imagefield), [Image API](http://drupal.org/project/imageapi), and [Embedded Media Field](http://drupal.org/project/emfield). Additionally, some major improvements can be made, both to these, and to other essentials, such as the [Image](http://drupal.org/project/image) module, such as creating a migration path from Image to Image Field (once that module is stable).



So goal **Number Three: spruce up existing contributed media modules**. *The
means?* Get these modules upgraded!


**I want to recognize** the valiant and heroic efforts made by everyone to date,
as fortunately, there has already been significant progress on all these fronts.
That makes our job (relatively) easy. In some respects, we just need to finish
up the jobs that have<br />
already been started.


Thus, drewish declared this week the [Media Code Sprint](http://groups.drupal.org/node/11810)!



We need you to help. If you are a developer, or want to be a developer, jump on
in! If you aren't ready to develop, or consider yourself too new for that, you
can still help test patches and functionality. Jump on in! And please, even if
you don't know how to apply a patch, you can still help with documentation and
other small (but important) tasks. Jump on in!


If you're in Portland, You Have No Excuse&reg;. If not, you can jump into #drupal in IRC any time you're available.


The official dates for the sprint are today (Wednesday July 23, 2008) through Saturday (the 26th). We'll be online and working most of that time. I'll make sure we continue to post progress as the week develops.


Of course, as is the wonderful nature of Drupal, this is an ongoing process. Even if we achieve our stated goals, there will always be more.


Thanks,
Aaron Winborn


