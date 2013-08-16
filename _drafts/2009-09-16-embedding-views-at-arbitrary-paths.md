---
layout: post
title: Embedding Views at arbitrary paths
created: 1253115413
categories: drupal views.module documentation
---
On a project I'm working on we're using a lot of custom menu wild card loaders so we can have paths like <code>project/%

<?php
function _example_display_view($view_id, $display_id, $args = array()) {
  // Check that we can load the requested view.
  if ($view = views_get_view($view_id)) {
    // Check that the user can access the view.
    if (!$view->access($display_id)) {
      $output = drupal_access_denied();
    }
    else {
      // Load the current menu item and force the view to use it
      // as its path.
      $menu = menu_get_item();
      $view->override_path = $menu['path'];

      // Now render the view normally.
      $output = $view->execute_display($display_id, $args);
    }
    // Destroy the view so it can be garbage collected.
    $view->destroy();

    return $output;
  }
  return drupal_not_found();
}
?>
