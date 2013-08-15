---
layout: post
title: Comparing a node's values with its previous version on save
created: 1251160147
categories: documentation drupal 6 drupal
---
There was a <a href="http://lists.drupal.org/pipermail/development/2009-August/033587.html">great question</a> on Drupal developers mailing list the other day—one to which I've "rediscovered" the solution to a few times—so I wanted to make sure that everyone was aware of it. 

The basic question is: 
<blockquote>
When a node is being saved, how can you see what values have changed?</blockquote>
The short answer is: 
<blockquote>
Use the 'presave' operation to load a copy of the node before it's saved, stick it back into the node object, and in your 'update' operation code compare the "before" and "after" versions:
</blockquote>
<?php

/**
 * Implementation of hook_nodeapi().
 */
function example_nodeapi(&$node, $op, $a3, $a4) {
  // We want to compare nodes with their previous versions. Ignore new
  // nodes with no nid since there's no previous version to load.
  if ($op == 'presave' && !empty($node->nid)) {
    // We don't want to collide with values set by other modules so we'll
    // use the module name as a prefix and a long name to be save.
    $node->example_presave_node = node_load($node->nid);
  }
  elseif ($op == 'update') {
    // On update we pull the previous version out of the node and compare
    // it to the newly saved one.
    $presave = $node->example_presave_node;
    // Pretend we're comparing a single value CCK number field here.
    $field_name = 'field_example';
    if ($node->$field_name != $presave->$field_name) {
      drupal_set_message(
        t("The node's value changed from %previous to %current.", array(
          '%previous' => $presave->$field_name[0]['value'],
          '%current' => $node->$field_name[0]['value'],
        ))
      );
    }
  }
}
?>

