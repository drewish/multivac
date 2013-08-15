---
layout: post
title: Sorting numeric values stored in character fields with views.module
created: 1188420101
categories: drupal documentation mysql views.module
---
I spent a good chunk of time this morning trying to figure out how to get the <a href="http://drupal.org/project/views">views module</a> to sort a character field with numeric data correctly. The <a href="http://drupal.org/project/audio">audio module</a> has a normalized table of meta-data meaning that there's one column for the tag name and one for the value. The value is stored as a character string which causes problem when sorting numeric data like the track numbers or years. If you've got a <code> SELECT value FROM audio_metadata ORDER BY value</code> that returns the range of numbers <code>1...13</code> it ends up sorted as <code>1,10,11,12,13,2,3...9</code>. The trick <a href="http://blog.feedmarker.com/2006/02/01/how-to-do-natural-alpha-numeric-sort-in-mysql/">as I discovered</a> is to add zero to the field to coerce it to a numeric value: <code> SELECT value + 0 AS v FROM audio_metadata ORDER BY v</code>.

The problem then is to figure out how to get the views module to generate this bit SQL to get the sorting right. The solution I came upon is when defining the field set <code>'notafield'</code> to <code>TRUE</code> and provide a <code>'query_handler'</code> to generate the correct SQL. I've included the relevant parts of the audio module below to demonstrate how it works. You can see the <a href="http://cvs.drupal.org/viewvc.py/drupal/contributions/modules/audio/views_audio.inc?revision=1.11&view=markup">complete code here</a>.

<!--break-->
<?php

function audio_views_tables() {
  $numeric_tags = array('track', 'year');

  foreach (audio_get_tags_allowed() as $tag) {
    $tables['audio_metadata_'. $tag] = array(
      'name' => 'audio_metadata',
      'join' => array(
        'left' => array(
          'table' => 'audio',
          'field' => 'vid'
        ),
        'right' => array(
          'field' => 'vid'
        ),
        'extra' => array(
          'tag' => $tag
        ),
      ),
      'fields' => array(
        'value' => array(
          'name' => t('Audio: Tag @tag', array('@tag' => $tag)),
          'sortable' => TRUE,
          'help' => t('This will display tag %tag values.', array('%tag' => $tag)),
        ),
      ),
      'sorts' => array(
        'value' => array(
          'name' => t('Audio: Tag @tag', array('@tag' => $tag)),
          'help' => t('Sort audio nodes by tag %tag values.', array('%tag' => $tag)),
        ),
      ),
    );

    // Use different handlers for numeric tags.
    if (in_array($tag, $numeric_tags)) {
      $tables["audio_metadata_$tag"]['sorts']['value']['handler'] = 'audio_views_sort_handler_numeric_tag';
      // Set notafield to TRUE so that our handler can add the field.
      $tables["audio_metadata_$tag"]['fields']['value']['notafield'] = TRUE;
      $tables["audio_metadata_$tag"]['fields']['value']['query_handler'] = 'audio_views_field_query_handler_numeric';
    }
  }

  return $tables;
}

/**
 * Field sort handler to convert numeric values in string fields for sorting.
 */
function audio_views_field_query_handler_numeric($fielddata, $fieldinfo, &$query) {
  // This handler expects that the field will have 'notafield' => TRUE so that
  // we can add in our field and not have worry about views overwriting it with
  // the default.
  $query->add_field($fielddata['field'] .' + 0', $fielddata['tablename'], $fielddata['queryname']);
}

/**
 * Sort handler to convert numeric values in string fields for sorting.
 */
function audio_views_sort_handler_numeric_tag($op, &$query, $sortinfo, $sort) {
  // We go to a bunch of trouble here to make sure we're adding the same field
  // as audio_views_field_query_handler_numeric() would so that views doesn't
  // duplicate it.
  $query->add_orderby('', $sort['field'] .' + 0', $sort['sortorder'], $sortinfo['table'] .'_'. $sortinfo['field']);
}
?>
