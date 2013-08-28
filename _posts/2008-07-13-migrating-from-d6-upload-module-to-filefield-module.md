---
layout: post
title: Migrating from D6 upload.module to filefield.module
created: 1215980144
categories: drupal documentation drupal6 filefield.module
---
So building on my [last post for creating CCK fields](/node/118), here's some
code I whipped up to migrate from the D6's core upload.module to the
filefield.module. This isn't general purpose code but might help someone else
out. The catch is I'd built a video node with and was using the upload module
to attach exactly two files, an image and a video. The new node will have
separate thumbnail and video fields. If you'll be moving to a multi-value field
this code won't work for you.

The gist is the same as before, setup your field for video and your field for
images then export using:

``` php
<?php var_export(content_fields('field_web_video', 'video'), 1); ?>
```

and

``` php
<?php var_export(content_fields('field_video_thumb', 'video'), 1); ?>
```

Then roll that into an update function that also moves the file data around in
the database. Code is after the jump.


``` php
<?php
/**
 * Add filefields to the video nodes and migrate the files.
 */
function foo_video_update_6000() {
  // Make sure the filefield* modules are installed correctly.
  drupal_install_modules(array('filefield', 'filefield_image', 'filefield_imagecache'));
  drupal_flush_all_caches();

  module_load_include('inc', 'content', 'includes/content.admin');
  content_alter_db_cleanup();

  // Need to load the CCK include file where content_field_instance_create() is defined.
  module_load_include('inc', 'content', 'includes/content.crud');

  $thumb_field = array (
//
// DROPPED THE CCK FIELD DEFINITION FROM HERE
//
  );
  content_field_instance_create($thumb_field);

  $video_field = array (
//
// DROPPED THE CCK FIELD DEFINITION FROM HERE
//
  );
  content_field_instance_create($video_field);


  // Migrate the videos
  $fids = array();
  $result = db_query("SELECT n.nid, n.vid, f.fid, u.description, u.list FROM {files} f INNER JOIN {upload} u ON f.fid = u.fid INNER JOIN {node} n ON u.vid = n.vid WHERE n.type = 'video' AND filemime LIKE 'video/%'");
  while ($file = db_fetch_object($result)) {
    $fids[] = $file->fid;
    // Check for a record... it adds a bunch more queries but it's simple and we only run this once.
    if (db_result(db_query("SELECT COUNT(*) FROM {content_type_video} WHERE vid = %d", $file->vid))) {
      db_query("UPDATE {content_type_video} SET field_web_video_fid = %d, field_web_video_description = '%s', field_web_video_list = %d WHERE vid = %d",
        $file->fid, $file->description, $file->list, $file->vid);
    }
    else {
      db_query("INSERT INTO {content_type_video} (nid, vid, field_web_video_fid, field_web_video_description, field_web_video_list) VALUES (%d, %d, %d, '%s', %d)",
        $file->nid, $file->vid, $file->fid, $file->description, $file->list);
    }
  }
  db_query("DELETE FROM {upload} WHERE fid IN (". db_placeholders($fids, 'int') .")", $fids);

  // Migrate the images
  $fids = array();
  $result = db_query("SELECT n.nid, n.vid, f.fid, u.description, u.list FROM {files} f INNER JOIN {upload} u ON f.fid = u.fid INNER JOIN {node} n ON u.vid = n.vid WHERE n.type = 'video' AND filemime LIKE 'image/%'");
  while ($file = db_fetch_object($result)) {
    $fids[] = $file->fid;
    // Check for a record... it adds a bunch more queries but it's simple and we only run this once.
    if (db_result(db_query("SELECT COUNT(*) FROM {content_type_video} WHERE vid = %d", $file->vid))) {
      db_query("UPDATE {content_type_video} SET field_video_thumb_fid = %d, field_video_thumb_description = '%s', field_video_thumb_list = %d WHERE vid = %d",
        $file->fid, $file->description, $file->list, $file->vid);
    }
    else {
      db_query("INSERT INTO {content_type_video} (nid, vid, field_video_thumb_fid, field_video_thumb_description, field_video_thumb_list) VALUES (%d, %d, %d, '%s', %d)",
        $file->nid, $file->vid, $file->fid, $file->description, $file->list);
    }
  }
  db_query("DELETE FROM {upload} WHERE fid IN (". db_placeholders($fids, 'int') .")", $fids);

  // No more uploads on video nodes!
  variable_set('upload_video', 0);

  return array();
}
?>
```

**Update:** I posted some additional info on this topic over on: http://drupal.org/node/292904
