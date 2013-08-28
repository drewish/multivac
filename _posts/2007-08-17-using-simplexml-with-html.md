---
layout: post
title: Using SimpleXML with HTML
created: 1187389303
categories: php documentation simplexml html
---
PHP 5's SimpleXML module is one of the the biggest reasons to upgrade to 5. If
you're parsing RSS feeds or the results of webservice requests it works
beautifully and saves a ton of time. The only problem with it is that it'll
only load valid XML. I banged my head against it for way to long before coming
up with the following:

``` php
<?php
  $doc = new DOMDocument();
  $doc->strictErrorChecking = FALSE;
  $doc->loadHTML($html);
  $xml = simplexml_import_dom($doc);
?>
```
