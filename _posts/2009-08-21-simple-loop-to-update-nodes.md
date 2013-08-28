---
layout: post
title: Simple loop to update nodes
created: 1250873672
categories: documentation snippets drupal 6 drupal
---
For some reason I find myself rewriting this little bit of code every time I need to update a bunch of nodes on a site. Going to post it here to save myself some time. Be aware that this might time out if you've got a large number of nodes, designed for up to a couple hundred nodes:


``` php
<?php
// TODO: Set your basic criteria here:
$result = db_query("SELECT n.nid FROM {node} n WHERE n.type = '%s'", array('task'));
while ($row = db_fetch_array($result)) {
  $node = node_load($row);
  if ($node->nid) {
    $node->date = $node->created;

    // TODO: Test and set your own value here:
    if (empty($node->field_task_status[0]['value'])) {
      $node->field_task_status[0]['value'] = 'active';
      $node = node_submit($node);
      node_save($node);
      drupal_set_message(t('Updated [%title](!url).', array('!url' => url('node/'. $node->nid), '%title' => $node->title)));
    }
  }
}
?>
```
