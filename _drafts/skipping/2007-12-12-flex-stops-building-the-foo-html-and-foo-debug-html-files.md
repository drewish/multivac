---
layout: post
title: Flex stops building the foo.html and foo-debug.html files
created: 1197445216
categories: programming documentation flex
---
I've been trying to get up to speed on <a href="http://labs.adobe.com/technologies/flex/">Adobe Flex</a> for my <a href="https://projects.cecs.pdx.edu/~aaltman/capstone_a_team/index.cgi/wiki">CS Capstone project</a>. I should mention, by some surprisingly enlightened decision, <a href="http://www.flexregistration.com/student.php">Adobe offers a free Flex license to students</a>.

Everything was going great until I it suddenly stopped building the <code>foo.html</code> and <code>foo-debug.html</code> files that launch the <code>foo.swf</code> and <code>foo-debug.swf</code> files. Apparently <a href="http://groups.google.com/group/flex-open-source/browse_thread/thread/40affe8538fbb635">other people ran into this</a> too. I didn't figure out the proper fix for this but I developed a workaround based on <a href="http://www.morearty.com/blog/2006/12/11/changing-the-filenames-in-flex-builder-html-templates/">a blog post</a> by one of the Flex developers.

Basically, just rename the <code>index.template.html</code> to <code>${swf}.template.html</code> and then do a clean rebuild. You should end up with <code>bar.html</code> and <code>foo-test.html</code> and be able to get back to work.
