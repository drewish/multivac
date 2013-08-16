---
layout: post
title: Drupal 6's get/set static pattern
created: 1288573184
categories: drupal drupal 6 documentation
---
I really appreciated Tigerfish's <a href="http://tiger-fish.com/blog/drupal-6-patterns-static-caching">post on Drupal 6's static pattern</a>. I wanted to write up a similar pattern that's used elsewhere in core. 

menu_get_item()/menu_set_item()
drupal_get_title()/drupal_set_title()

The meat of it is that the setter function has a static variable that holds the value. When the set function is called with no arguments it makes no changes and returns the stored value. So the getter function is just a simple wrapper that calls the setter with no arguments.

<?php

/**
 * Set (or get) the active menu for the current page - determines the active trail.
 */
function menu_set_active_menu_name($menu_name = NULL) {
  static $active;

  if (isset($menu_name)) {
    $active = $menu_name;
  }
  elseif (!isset($active)) {
    $active = 'navigation';
  }
  return $active;
}

/**
 * Get the active menu for the current page - determines the active trail.
 */
function menu_get_active_menu_name() {
  return menu_set_active_menu_name();
}
?>
