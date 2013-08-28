---
layout: post
title: Everything is an update
created: 1237437625
categories: documentation hook_update_n drupal6 drupal
---
For some work projects we've started making all the configuration changes via update functions. These get checked into version control and from there deployed to the staging site for testing, and then eventually deployed on the production site. The nice thing about update functions is that you can test it on staging and be sure that exactly the same changes will occur on the production site. 

Here's a few examples, I'll continue to update it as I get more good examples.

<h3>Installing a module</h3>
Simple one liner to enable several modules:

``` php
<?php
function foo_update_6000(&$sandbox) {
  $ret = array();
  drupal_install_modules(array('devel', 'devel_node_access'));
  return $ret;
}
?>
```



<h3>Batch based update to regenerate PathAuto aliases</h3>
More elaborate update that uses the BatchAPI to avoid timeouts while regenerating the path aliases for two node types:

``` php
<?php
function foo_update_6000(&$sandbox) {
  $ret = array();

  if (!isset($sandbox['progress'])) {
    // Set the patterns
    variable_set('pathauto_node_foo_pattern', 'foo/view/[nid]');
    variable_set('pathauto_node_bar_pattern', 'bar/view/[nid]');

    // Initialize batch update information.
    $sandbox['progress'] = 0;
    $sandbox['last_processed'] = -1;
    $sandbox['max'] = db_result(db_query("SELECT COUNT(*) FROM {node} n WHERE n.type IN ('foo', 'bar')"));
  }

  // Fetch a group of node ids to update.
  $nids = array();
  $result = db_query_range("SELECT n.nid FROM {node} n WHERE n.type IN ('foo', 'bar') AND n.nid > %d ORDER BY n.nid", array($sandbox['last_processed']), 0, 50);
  while ($node = db_fetch_object($result)) {
    $nids[] = $node->nid;
  }

  if ($nids) {
    // Regenerate the aliases for the nodes.
    pathauto_node_operations_update($nids);

    // Update our progress information for the batch update.
    $sandbox['progress'] += count($nids);
    $sandbox['last_processed'] = end($nids);
  }

  // Indicate our current progress to the batch update system. If there's no
  // max value then there's nothing to update and we're finished.
  $ret['#finished'] = empty($sandbox['max']) ? 1 : ($sandbox['progress'] / $sandbox['max']);

  return $ret;
}
?>
```

<h3>Change node settings</h3>
Make a few changes to the node type settings:

``` php
<?php
function foo_update_6001() {
  $ret = array();

  // Change the teaser label to 'teaser text'.
  $ret[] = update_sql("UPDATE content_node_field_instance SET label = 'Teaser text' WHERE field_name = 'field_teaser'");

  // Change the 'description' and 'biography' labels to 'body text'.
  $ret[] = update_sql("UPDATE content_node_field_instance SET label = 'Body text' WHERE field_name IN ('field_description', 'field_bio')");

  // Rename the front node type 'Front Page' to 'Front Page Configuration'
  $ret[] = update_sql("UPDATE node_type SET name = 'Front Page Configuration' WHERE type = 'front'");

  return $ret;
}
?>
```

<h3>Delete a bunch of views</h3>
I exported the site's views into a default views and needed to remove the existing ones from the database.

``` php
<?php
function foo_update_6001(&$sandbox) {
  $ret = array();

  // Since we're shipping default views delete the versions from the database.
  if (!isset($sandbox['progress'])) {
    // Initialize batch update information.
    $sandbox['progress'] = 0;
    $sandbox['views'] = array(
      'season',
   // ...
      'nodequeue_1',
    );
    $sandbox['max'] = count($sandbox['views']);
  }

  module_load_include('module', 'views');
  $view_id = $sandbox['views'][$sandbox['progress']];
  if ($view = views_get_view($view_id)) {
    $view->delete();
    $view->destroy();
  }
  $sandbox['progress']++;

  // Indicate our current progress to the batch update system. If there's no
  // max value then there's nothing to update and we're finished.
  $ret['#finished'] = empty($sandbox['max']) ? 1 : ($sandbox['progress'] / $sandbox['max']);

  return $ret;
}
?>
```
