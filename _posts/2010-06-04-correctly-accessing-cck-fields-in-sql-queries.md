---
layout: post
title: Correctly accessing CCK fields in SQL queries
created: 1275685104
categories: documentation sql snippets drupal 6 drupal cck
---
Twice today I've had to deal with writing a SQL query that needed data in a CCK
field. The naive approach is to just look at the table and field names and plug
them into your query:

``` php
<?php
$result = db_query("SELECT COUNT(*) AS count FROM {node} n
INNER JOIN {term_node} tn ON n.vid = tn.vid
INNER JOIN {content_type_date} ctd ON n.vid = ctd.vid
WHERE tn.tid = 25 AND ctd.field_date_value > NOW() AND n.changed > %d", $newtime);
?>
```

Often this will work just fine but since CCK can dynamically alter the database
schema (when you add a field to a second content type or change the number of
values) the query may break.

Fortunately CCK provides functions for finding a field's table and column names
so it's simple to do it correctly:

``` php
<?php
$field = content_fields('field_date');
$db_info = content_database_info($field);
?>
```

A <code>var_dump($db_info)</code> gives:

```
array(2) {
  ["table"]=>
  string(17) "content_type_date"
  ["columns"]=>
  array(2) {
    ["value"]=>
    array(6) {
      ["type"]=>
      string(7) "varchar"
      ["length"]=>
      int(20)
      ["not null"]=>
      bool(false)
      ["sortable"]=>
      bool(true)
      ["views"]=>
      bool(true)
      ["column"]=>
      string(16) "field_date_value"
    }
    ["value2"]=>
    array(6) {
      ["type"]=>
      string(7) "varchar"
      ["length"]=>
      int(20)
      ["not null"]=>
      bool(false)
      ["sortable"]=>
      bool(true)
      ["views"]=>
      bool(false)
      ["column"]=>
      string(17) "field_date_value2"
    }
  }
}
```


After noting that the field has two columns and making our choice, we've got
the pieces to plug into the query:

``` php
<?php
$field = content_fields('field_date');
$db_info = content_database_info($field);
$result = db_query("SELECT COUNT(*) AS count FROM {node} n
INNER JOIN {term_node} tn ON n.vid = tn.vid
INNER JOIN {". $db_info['table'] ."} ctd ON n.vid = ctd.vid
WHERE tn.tid = 25 AND ctd." . $db_info['columns']['value']['column'] . " > NOW() AND n.changed > %d", $newtime);
?>
```

The query is a bit harder to read, but you've future proofed your code so you
won't be back to fix six months from now when you reuse that date field on
another node type.



