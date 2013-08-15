---
layout: post
title: Media sprinting
created: 1216864486
categories: work drupal portland media/files sprint
---
<p>So back in April I started talking to Keiran at about doing a media and files sprint... well it's finally happening. aaronwinborn in in Portland and dopry is going to be helping remotely. Aaron posted <a href="http://aaronwinborn.com/blogs/aaron/media-code-sprint-top-3-goals">a great writeup on what we're hoping to accomplish</a> so I'll blockquote at length:</p>

<blockquote>
<p>Andrew Morton (<a href="http://drupal.org/user/34869">drewish</a>), Darrel O'Pry (<a href="http://drupal.org/user/22202">dopry</a>, remotely), and I are heading up a <a href="http://groups.drupal.org/node/11810">Media Code Sprint</a> in Portland this week! Come help, in person or remotely, if you're interested in multimedia and Drupal! It has now officially started, and as I've volunteered to help keep folks updated, here goes...</p>

<p>First the reasons.</p>
<h2>Number One: Better Media Handling in Core</h2>
<p>Dries conducted a survey prior to his <a href="http://buytaert.net/starting-to-work-on-drupal-7">State of Drupal</a> presentation at Boston Drupalcon 2008, and <strong>number one</strong> on the top ten (or 11) list of what would make THE KILLER DRUPAL 7 Release was "Better media handling".</p>
<p>Let me repeat that. <strong>Better media handling</strong>.</p>
<p>People have done really amazing stuff in contrib, but it is difficult (if not impossible in many cases) for developers to coordinate the use of files, as there is no good means for file handling in the core of Drupal. Thus, we have several dozen (or more) media modules doing some small part, or even duplicating functionality, sometimes out of necessity.</p>

<p>We need (better) media and file handling in Drupal core. In particular, there has been a <a href="http://drupal.org/node/142995">patch for a hook_file</a> in the queue for over a year, which has been in the <a href="http://drupal.org/patch/spotlight">Patch Spotlight</a> (for the second time, no less) since May! (And has been RTBC several times during that process...) Come on folks.</p>
<p>One of the powers of Drupal is its system of hooks. We have hooks to modify nodes, to notify changes to user objects, to alter nearly any data (such as forms and menus). Noticeably absent is a consistent handling for files or any sort of notification. We need hook_file.</p>
<p>So goal <strong>Number One: get media handling in core</strong>. <em>The means?</em> <a href="http://drupal.org/node/142995">Add hook_file and make files into a 1st class Drupal object</a>. We'll be creating a test suite for functionality in the hook_file patch to validate it and "grease the wheels" to get it committed.</p>

<p>The other goals of this sprint pale in comparison to the first in utility, but are still highly desirable and worthwhile.</p>
<h2>Number Two: Refactor File Functionality in Core</h2>
<p>As an extension to the first goal, there is a lot of inconsistency with how Drupal currently handles files. For instance, in some areas a function may return an object, and in others a string. Additionally, some functions are misnamed, or try to do too much to be useful as a file API.</p>
<p>Some specific examples: for what it does, <a href="http://api.drupal.org/api/function/file_check_directory/6">file_check_directory</a> may be better suited as something like file_check_writable, or maybe even split into that and file_check_make_writable. Also, for instance, <a href="http://api.drupal.org/api/function/file_scan_directory/6">file_scan_directory</a> needs to return file objects, rather than the current <cite>associative array (keyed on the provided key) of objects with "path", "basename", and "name" members corresponding to the matching files.</cite> (The function does what it needs to, but the returned objects have keys not corresponding to anything else used in core.)</p>

<p>So goal <strong>Number Two: refactor file functionality in core</strong>. <em>The means?</em> Go through and check for (and fix!) existing file functionality for documentation and consistency.</p>
<h2>Number Three: Spruce up Existing Contributed Media Modules</h2>
<p>There are several much needed multimedia modules that have not yet been upgraded to Drupal 6 (or which are still in heavy progress). This includes (but is not limited to) <a href="http://drupal.org/project/imagefield">Image Field</a>, <a href="http://drupal.org/project/imageapi">Image API</a>, and <a href="http://drupal.org/project/emfield">Embedded Media Field</a>. Additionally, some major improvements can be made, both to these, and to other essentials, such as the <a href="http://drupal.org/project/image">Image</a> module, such as creating a migration path from Image to Image Field (once that module is stable).</p>

<p>So goal <strong>Number Three: spruce up existing contributed media modules</strong>. <em>The means?</em> Get these modules upgraded!</p>
<p><strong>I want to recognize</strong> the valiant and heroic efforts made by everyone to date, as fortunately, there has already been significant progress on all these fronts. That makes our job (relatively) easy. In some respects, we just need to finish up the jobs that have<br />
already been started.</p>
<p>Thus, drewish declared this week the <a href="http://groups.drupal.org/node/11810">Media Code Sprint</a>!</p>

<p>We need you to help. If you are a developer, or want to be a developer, jump on in! If you aren't ready to develop, or consider yourself too new for that, you can still help test patches and functionality. Jump on in! And please, even if you don't know how to apply a patch, you can still help with documentation and other small (but important) tasks. Jump on in!</p>
<p>If you're in Portland, You Have No Excuse&reg;. If not, you can jump into #drupal in IRC any time you're available.</p>
<p>The official dates for the sprint are today (Wednesday July 23, 2008) through Saturday (the 26th). We'll be online and working most of that time. I'll make sure we continue to post progress as the week develops.</p>
<p>Of course, as is the wonderful nature of Drupal, this is an ongoing process. Even if we achieve our stated goals, there will always be more.</p>
<p>Thanks,<br />
Aaron Winborn</p>
</blockquote>
