---
layout: post
title: Moving CCK description field into the node body
created: 1169590696
categories: cck drupal documentation
---
Back in Drupal 4.7 if you were using CCK for nodes the node body was left empty. In Drupal 5 CCK nodes now can have a body. I wanted to move data from a field named <code>description</code> into the node body so I came up with the following snippet fit for running in the <a href="http://drupal.org/project/devel">devel module</a>'s execute PHP block.<!--break-->
<?php
$result = db_query("SELECT nid FROM {node} WHERE type = 'content_problem'");
while ($o = db_fetch_object($result)) {
  $node = node_load($o->nid);
  if ($node) {
    $node->body = $node->field_description[0]['value'];
    $node->format = $node->field_description[0]['format'];
    node_save($node);
  }
  print "$node->title<br>";
}
?>
