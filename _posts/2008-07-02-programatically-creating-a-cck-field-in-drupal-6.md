---
layout: post
title: Programatically creating a CCK field in Drupal 6
created: 1215035203
categories: cck drupal documentation drupal6
---
I spent some time today trying to figure out how to create a CCK field as part of an <a href="http://api.drupal.org/api/function/hook_update_N/6">hook_update_N</a> function. Unlike previous versions of CCK, in 6 it's very easy to manipulate the fields from code.

The first step is to create the field using CCK's UI. Once you've got the field setup the way you'd like it use PHP's <a href="http://us2.php.net/var_export"><code>var_export()</code></a> to dump the contents of the node's field as an array:
<code>
var_export(content_fields('field_translator_note', 'feature'));
</code>
<!--break-->
That'll give you some massive array definition that you can copy and paste into your code.
<?php
$field = array (
  'field_name' => 'field_translator_note',
  'type_name' => 'feature',
  'display_settings' => 
  array (
    4 => 
    array (
      'format' => 'hidden',
    ),
    2 => 
    array (
      'format' => 'hidden',
    ),
    3 => 
    array (
      'format' => 'hidden',
    ),
    'label' => 
    array (
      'format' => 'hidden',
    ),
    'teaser' => 
    array (
      'format' => 'hidden',
    ),
    'full' => 
    array (
      'format' => 'hidden',
    ),
  ),
  'widget_active' => '1',
  'type' => 'text',
  'required' => '0',
  'multiple' => '0',
  'db_storage' => '0',
  'module' => 'text',
  'active' => '1',
  'columns' => 
  array (
    'value' => 
    array (
      'type' => 'text',
      'size' => 'big',
      'not null' => false,
      'sortable' => true,
    ),
  ),
  'text_processing' => '0',
  'max_length' => '',
  'allowed_values' => '',
  'allowed_values_php' => '',
  'widget' => 
  array (
    'rows' => '',
    'default_value' => 
    array (
      0 => 
      array (
        'value' => '',
      ),
    ),
    'default_value_php' => NULL,
    'label' => 'Translator\'s note',
    'weight' => NULL,
    'description' => '',
    'type' => 'text_textarea',
    'module' => 'text',
  ),
);

// Need to load the CCK include file where content_field_instance_create() is defined.
module_load_include('inc', 'content', 'includes/content.crud');

// I wanted to add the field to several node types so loop over them...
foreach (array('athlete', 'feature', 'product', 'tech') as $type) {
  // ...and assign the node type.
  $field['type_name'] = $type;
  content_field_instance_create($field);
}
?>

High-fives to all the CCK developers for making this so easy.
