---
layout: post
title: Creating a CCK field in hook_install()
created: 1243957556
categories: cck drupal documentation drupal6
---
My rule of thumb for deciding what to post on this blog has been to document
anything I've spent more than an hour trying to figure out. Today I've got a
good one for anyone trying to create CCK fields as part of a module's
installation process.

Back in Drupal 5 the Station module was made up of lot of custom code to track
various values like a playlist's date or program's genre and DJs. During the
upgrade to Drupal 6 I migrated that data into locked, CCK fields that were
created when the module was installed. As people started to install the 6.x
version of module I began getting [strange bug reports](http://drupal.org/node/357519)
about the Station Schedule that I couldn't seem to replicate on my machine.



Eventually after trying it on a fresh installation, I discovered the problem
was that its fields weren't being created correctly by the [`hook_install()`](http://api.drupal.org/api/function/hook_install/6) implementation when CCK and/or the field modules were installed at the same time as the Station modules. Meaning that the user who setup a new Drupal site, downloaded all the modules, checked the Station Schedule check box on the module list and let Drupal figure out the dependencies from the `.info` files would think the modules had installed correctly but they'd actually be missing several required field instances which would cause errors down the line. My first response to this problem was to add a [`hook_requirements()`](http://api.drupal.org/api/function/hook_requirements/6) implementation that prevented the Schedule from being installed at the same time as the other modules:

``` php
<?php
/**
 * Implementation of hook_requirements().
 */
function station_schedule_requirements($phase) {
  $requirements = array();
  $t = get_t();
  if ($phase == 'install' && !module_exists('userreference')) {
    $requirements['station_schedule_userreference'] = array(
      'description' => $t('Sadly the Station Schedule cannot be installed until the User Reference module has been fully installed. User Reference should now be installed, so please try installing Station Schedule again.'),
      'severity' => REQUIREMENT_ERROR,
    );
  }
  return $requirements;
}
?>
```

This at least removed the "Surprise, you've got a broken site!" element, but it
was annoying to have to reinstall the module. When I realized that it wasn't
just the Schedule that was suffering from this problem—but also the Program and
Playlist modules—I decided to look for a better solution.

After six hours of debugging via print statement—technically the
[Devel module](http://drupal.org/project/devel)'s `dsm()` function (yes, I know
the time would have been better spent figuring out how to get a proper PHP
debugger running on OS X)—I found it boiled down to two issues:

1. The field's columns weren't being populated because the fields' `.module` files weren't being included.
1. CCK uses [`drupal_write_record()`](http://api.drupal.org/api/function/drupal_write_record/6) to record the field information but it was failing because `content_schema()` wasn't being called.

The first was simple enough to correct, I could manually include the module
files. The second was much trickier, [`drupal_get_schema()`](http://api.drupal.org/api/function/drupal_get_schema/6)
calls [`module_implements()`](http://api.drupal.org/api/function/module_implements/6)
so that it only returns schema information for *enabled* modules but [`drupal_install_modules()`](http://api.drupal.org/api/function/drupal_install_modules/6)
*installs* the group of modules then *enables* the group. I was expecting that
when hook_install() was called the required modules would be both installed and
enabled. So in order to create my fields in `station_schema_install()` I'd need
to get CCK and the fields enabled first. Feeling close to one of those head
slapping moments I started studying [`module_enable()`](http://api.drupal.org/api/function/module_enable/6)
and realized it seemed safe to call from within a `hook_install()`
implementation. It had the added bonus of including the module which solved the
first problem.

I love it when you figure out the right way to do something and it turns out to
also be the short way. It's really this simple:

``` php
<?php
/**
 * Implementation of hook_schema().
 */
function station_schedule_install() {
  drupal_install_schema('station_schedule');

  // To deal with the possibility that we're being installed at the same time
  // as CCK and the field modules we depend on, we need to manually enable the
  // the modules to ensure they're available before we create our fields.
  module_enable(array('content', 'userreference'));

  $dj_field = array (
    // FIELD DEFINITION OMITTED.
  );

  // Create the fields.
  module_load_include('inc', 'content', 'includes/content.crud');
  content_field_instance_create($dj_field);
}
?>
```

As always, I hope this saves someone else some trouble.
