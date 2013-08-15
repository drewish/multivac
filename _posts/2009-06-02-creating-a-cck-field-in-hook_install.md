---
layout: post
title: Creating a CCK field in hook_install()
created: 1243957556
categories: cck drupal documentation drupal6
---
My rule of thumb for deciding what to post on this blog has been to document anything I've spent more than an hour trying to figure out. Today I've got a good one for anyone trying to create CCK fields as part of a module's installation process.

Back in Drupal 5 the Station module was made up of lot of custom code to track various values like a playlist's date or program's genre and DJs. During the upgrade to Drupal 6 I migrated that data into locked, CCK fields that were created when the module was installed. As people started to install the 6.x version of module I began getting <a href="http://drupal.org/node/357519">strange bug reports</a> about the Station Schedule that I couldn't seem to replicate on my machine. 
<!--break-->
Eventually after trying it on a fresh installation, I discovered the problem was that its fields weren't being created correctly by the <a href="http://api.drupal.org/api/function/hook_install/6"><code>hook_install()</code></a> implementation when CCK and/or the field modules were installed at the same time as the Station modules. Meaning that the user who setup a new Drupal site, downloaded all the modules, checked the Station Schedule check box on the module list and let Drupal figure out the dependencies from the <code>.info</code> files would think the modules had installed correctly but they'd actually be missing several required field instances which would cause errors down the line. My first response to this problem was to add a <a href="http://api.drupal.org/api/function/hook_requirements/6"><code>hook_requirements()</code></a> implementation that prevented the Schedule from being installed at the same time as the other modules:
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

This at least removed the "Surprise, you've got a broken site!" element, but it was annoying to have to reinstall the module. When I realized that it wasn't just the Schedule that was suffering from this problem—but also the Program and Playlist modules—I decided to look for a better solution.

After six hours of debugging via print statement—technically the <a href="http://drupal.org/project/devel">Devel module</a>'s <code>dsm()</code> function (yes, I know the time would have been better spent figuring out how to get a proper PHP debugger running on OS X)—I found it boiled down to two issues:
<ol><li>The field's columns weren't being populated because the fields' <code>.module</code> files weren't being included.</li>
<li>CCK uses <a href="http://api.drupal.org/api/function/drupal_write_record/6"><code>drupal_write_record()</code></a> to record the field information but it was failing because <code>content_schema()</code> wasn't being called.</li>
</ol>
The first was simple enough to correct, I could manually include the module files. The second was much trickier, <a href="http://api.drupal.org/api/function/drupal_get_schema/6"><code>drupal_get_schema()</code></a> calls <a href="http://api.drupal.org/api/function/module_implements/6"><code>module_implements()</code></a> so that it only returns schema information for <em>enabled</em> modules but <a href="http://api.drupal.org/api/function/drupal_install_modules/6"><code>drupal_install_modules()</code></a> <em>installs</em> the group of modules then <em>enables</em> the group. I was expecting that when hook_install() was called the required modules would be both installed and enabled. So in order to create my fields in <code>station_schema_install()</code> I'd need to get CCK and the fields enabled first. Feeling close to one of those head slapping moments I started studying <a href="http://api.drupal.org/api/function/module_enable/6"><code>module_enable()</code></a> and realized it seemed safe to call from within a <code>hook_install()</code> implementation. It had the added bonus of including the module which solved the first problem. 

I love it when you figure out the right way to do something and it turns out to also be the short way. It's really this simple:
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

As always, I hope this saves someone else some trouble.
