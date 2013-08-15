---
layout: post
title: Using Mercurial and SVN
created: 1282224263
categories: documentation subversion osx mercurial macports
---
At Sony we're looking for a distributed version control system to replace Subversion—primarily Git and Mercurial. I'm very familiar with Git but hadn't done much with Mercurial so it seemed like a good idea to use it for a couple of weeks and learn the quirks. Since I'm stuck using Subversion I decided to see if it would be feasible to use Mercurial as a "super client" working locally then pushing changes back to svn.  A little Googling turned up two candidates <a href="http://pypi.python.org/pypi/hgsvn">hgsvn</a> and 
<a href="http://bitbucket.org/durin42/hgsubversion/wiki/Home">hgsubversion</a>. hgsubversion extends the commands pushing and pulling changes, giving a more native experience, so it seemed like the best choice for learning the system.

The setup is actually pretty simple but I'm documenting it for my own future reference.

Use MacPorts to Install hgsubversion:

<code>
sudo port install py26-hgsubversion
</code>

Enable the <code>rebase</code> and <code>hgsubversion</code> extensions:

<code>
printf "[extensions]\nrebase=\nhgsubversion =\n" >> ~/.hgrc
</code>

Check that the extension was enabled:

<code>
hg help extensions
</code>

It should list something like:

<code>
    enabled extensions:

     hgsubversion
                 integration with Subversion repositories
</code>

Now you're good to checkout from SVN (note: using the <code>svn+</code> prefix in the URL lets you use passwords stored in your keychain):

<code>
hg clone svn+http://example.com/svn/repo/trunk
</code>

I actually ran into <a href="http://bitbucket.org/durin42/hgsubversion/issue/100/hg-clone-strange-error">an issue</a> where the clone was exploding with a stack trace. The bug had been fixed in 1.1.2 but MacPorts hadn't yet been updated so I rolled <a href="https://trac.macports.org/ticket/25988">a patch</a> to update it.
