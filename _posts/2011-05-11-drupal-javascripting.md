---
layout: post
title: Drupal JavaScripting
created: 1305140762
categories: documentation javascript drupal
---
I was trying to find some docs on how to use Drupal's JavaScript behaviors system to send to some people at work and realized that two years after D6 was released it was still poorly documented. The <a href="http://drupal.org/node/171213">JavaScript and jQuery</a> page had good examples of how to get JavaScript onto the page from a module or theme but didn't really discuss what to do from that point. I spent some time adding some documentation to the page on drupal.org but wanted to put a copy here for Google's benefit.

After announcing the change on twitter <a href="http://drupal.org/node/756722">Tim Plunkett</a> <a href="http://twitter.com/#!/tmplunkett/status/68360188901597184">pointed out</a> that there were already some D7 docs so incorporated those.
<!--break-->
<h3>JavaScript closures</h3>
It's best practice to wrap your code in a closure. A closure is nothing more than a function that helps limit the scope of variables so you don't accidentally overwrite global variables.

<code>
// Define a new function.
(function () {
  // Variables defined in here will not affect the global scope.
  var window = "Whoops, at least I only broke my code.";
  console.log(window);
// The extra set of parenthesis here says run the function we just defined.
}());
// Our wacky code inside the closure doesn't affect everyone else.
console.log(window);
</code>

A closure can have one other benefit, if we pass <code>jQuery</code> in as a parameter we can map it to the <code>$</code> shortcut allowing us to use use <code>$()</code> without worrying if <a href="http://api.jquery.com/jQuery.noConflict/"><code>jQuery.noConflict()</code></a> has been called.

<code>
// We define a function that takes one parameter named $.
(function ($) {
  // Use jQuery with the shortcut:
  console.log($.browser);
// Here we immediately call the function with jQuery as the parameter.
}(jQuery));
</code>

In Drupal 7 <code>jQuery.noConflict()</code> is called to make it easier to use other JS libraries, so you'll either have to type out <code>jQuery()</code> or have the closure rename it for you.

<h3>JavaScript behaviors</h3>
Drupal uses a "behaviors" system to provide a single mechanism for attaching JavaScript functionality to elements on a page. The benefit of having a single place for the behaviors is that they can be applied consistently when the page is first loaded and then when new content is added during AHAH/AJAX requests. In Drupal 7 behaviors have two functions, one called when content is added to the page and the other called when it is removed.

Behaviors are registered by setting them as properties of <code>Drupal.behaviors</code>. Drupal will call each and pass in a DOM element as the first parameter (in Drupal 7 a settings object will be passed as the second parameter). For the sake of efficiency the behavior function should do two things:

<ul>
<li>Limit the scope of searches to the context element and its children. This is done by passing context parameter along to jQuery:
<code>jQuery('.foo', context);</code></li>
<li>Assign a marker class to the element and use that class to restrict selectors to avoid processing the same element multiple times:
<code>jQuery('.foo:not(.foo-processed)', context).addClass('foo-processed');</code></li>
</ul>

As a simple example lets look at how you'd go about finding all the <code>https</code> links on a page and adding some additional text marking them as secure, turning <code><a href="https://example.com">Example</a></code> into <code><a href="https://example.com">Example (Secure!)</a></code>. Hopefully you can see another important reason for using the marker class, if our code ran twice the link would end up reading "Example (Secure!) (Secure!)".

In Drupal 6 it would be done like this:

<code>
// Using the closure to map jQuery to $. 
(function ($) {
  // Store our function as a property of Drupal.behaviors.
  Drupal.behaviors.myModuleSecureLink = function (context) {
    // Find all the secure links inside context that do not have our processed
    // class.
    $('a[href^="https://"]:not(.secureLink-processed)', context)
      // Add the class to any matched elements so we avoid them in the future.
      .addClass('secureLink-processed')
      // Then stick some text into the link denoting it as secure.
      .append(' (Secure!)');
  };

  // You could add additional behaviors here.
  Drupal.behaviors.myModuleMagic = function(context) {};
}(jQuery));
</code>

In Drupal 7 it's a little different because behaviors can be attached when content is added to the page and detached when it is removed:

<code>
// Using the closure to map jQuery to $. 
(function ($) {
  // Store our function as a property of Drupal.behaviors.
  Drupal.behaviors.myModuleSecureLink = {
    attach: function (context, settings) {
      // Find all the secure links inside context that do not have our processed
      // class.
      $('a[href^="https://"]:not(.secureLink-processed)', context)
        // Add the class to any matched elements so we avoid them in the future.
        .addClass('secureLink-processed')
        // Then stick some text into the link denoting it as secure.
        .append(' (Secure!)');
    }
  }

  // You could add additional behaviors here.
  Drupal.behaviors.myModuleMagic = {
    attach: function (context, settings) { },
    detach: function (context, settings) { }
  };
}(jQuery));
</code>
