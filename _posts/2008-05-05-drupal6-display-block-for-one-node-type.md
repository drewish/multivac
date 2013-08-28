---
layout: post
title: ! 'Drupal6: Display block for one node type'
created: 1210029662
categories: drupal documentation drupal6
---
This is a little snippet I came up with to get a block to show up on a single node type:

``` php
<?php
$menu = menu_get_item();
if ($menu['path'] == 'node/%' && isset($menu['page_arguments'][0]->type)) {
  return $menu['page_arguments'][0]->type == 'story';
}
?>
```
It uses the node type stored in the menu system so you don't have to match `arg(0)` etc.
