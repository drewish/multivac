---
layout: post
title: Using PHP and CURL to do an HTML file POST
created: 1184701991
categories: curl php documentation
---
After scouring the internet to find out how to do multipart post operations and finding nothing nothing, I decided to save someone else some time. The trick is that @ before the file name:

<?php
$fullflepath = 'C:\temp\test.jpg';
$upload_url = 'http://www.example.com/uploadtarget.php';
$params = array(
  'photo'=>"@$fullfilepath",
  'title'=>$title
);		

$ch = curl_init();
curl_setopt($ch, CURLOPT_VERBOSE, 1);
curl_setopt($ch, CURLOPT_URL, $upload_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
$response = curl_exec($ch);
curl_close($ch);
?>

Originally posted here: http://drewish.com/blogger/archives/2005/01/27/using_php_and_curl_to_do_an_html_file_post.html
