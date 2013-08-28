---
layout: post
title: Better New Relic reporting on sites with Panels
created: 1351095555
categories: documentation panels new relic drupal
---
My last week at DoSomething I spent some time working on getting better metrics on which panel pages are slow. One half of that was to use New Relic's PHP API to provide better transaction names that included the node type and panel name:


``` php
<?php
/**
 * Implements hook_page_alter().
 *
 * We want to provide more detail to New Relic on the transaction and late in
 * the page build seemed like the simplest place.
 */
function example_page_alter(&$page) {
  if (!extension_loaded('newrelic')) {
    return;
  }

  $name = NULL;

  // Look for a panel page...
  $panel_page = page_manager_get_current_page();
  if (isset($panel_page['name'])) {
    // If it's a node page put the argument's node type into the transaction
    // name.
    if ($panel_page['name'] == 'node_view') {
      if (isset($panel_page['contexts']['argument_entity_id:node_1']->data)) {
        $node = $panel_page['contexts']['argument_entity_id:node_1']->data;
        $name = 'page_manager_node_view_page/' . $node->type;
      }
    }
    // If it's a page_manager page use the panel name.
    else if ($panel_page['task']['task type'] == 'page') {
      $name = 'page_manager_page_execute/' . $panel_page['name'];
    }
  }
  else {
    $menu_item = menu_get_item();
    if ($menu_item['path'] == 'node/%') {
      // Looks like panels didn't have a variant and it's falling back to
      // node_page_view.
      $name = 'node_page_view/' . $menu_item['page_arguments'][0]->type;
    }
  }

  if ($name) {
    newrelic_name_transaction($name);
  }
}
?>
```

So once you know which panels are slowing down your site you can use the new [Panels, Why so slow?](http://drupal.org/project/panels_why_so_slow) module to put the blame on the specific panes.
