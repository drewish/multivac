---
layout: post
title: ! 'Reason #902,423 why Java sucks'
created: 1202857787
categories: personal java
---
I've grown increasingly annoyed at Java over the years. I've taken to describing the language designer's philosophy as "If there's two ways of doing anything, pick the one that involves more typing".

All I want to do in take an array of numbers and convert it into a comma separated list, e.g. 1,2,3,4. Most modern languages make this easy:
<ul>
<li>PHP: <a href="http://us.php.net/manual/en/function.implode.php"><code>implode(',', $data)</code></a></li>
<li>Perl: <a href="http://perldoc.perl.org/functions/join.html"><code>join(",", $data)</code></a></li>
<li>Python: <a href="http://docs.python.org/lib/string-methods.html"><code>",".join(data)</code></a></li>
<li>Ruby: <a href="http://www.ruby-doc.org/core-1.9/classes/Array.html#M002176"><code>data.join(",")</code></a></li>
<li>.Net: <a href="http://msdn2.microsoft.com/en-us/library/57a79xd0.aspx"><code>String.Join(",", data)</code></a></li>
</ul>

So how do you do it in Java? Well there's no built in method so you end up getting to <a href="http://www.leepoint.net/notes-java/data/strings/96string_examples/example_arrayToString.html">write your own</a>:
<code>
public static String join(String[] a, String separator) {
    StringBuffer result = new StringBuffer();
    if (a.length > 0) {
        result.append(a[0]);
        for (int i=1; i<a.length; i++) {
            result.append(separator);
            result.append(a[i]);
        }
    }
    return result.toString();
}
</code>
Maybe sometime around Java 9 they'll get around to adding it...
