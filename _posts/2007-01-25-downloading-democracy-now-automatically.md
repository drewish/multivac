---
layout: post
title: Downloading Democracy Now! automatically
created: 1169744918
categories: curl php documentation kpsu
---
Here's a PHP script I wrote for the radio station to download each day's copy of <a href="http://democracynow.org/">Democracy Now!</a>. This requires that the PHP <a href="http://us3.php.net/curl">cURL extension</a> be installed.<!--break-->
<?php
// Download today's Democracy Now! Their URLs use the format:
// http://www.archive.org/download/dn{y4}-{m2}{d2}/{y4}-{m2}{d2}-1_vbr.mp3
// where y4 is a four digit year, m2 a 0-padded 2 digit month, and d2 a
// 0-padded 2 digit date.

$date = 'dn'. date('Y-md' ,time());
$url = 'http://www.archive.org/download/' . $date .'/'. $date .'-1_vbr.mp3';
$filename = './democracy_now.mp3';

print "trying to fetch $url to $filename\n";

$fh = fopen($filename, 'wb+');
if ($fh) {
    // set up the request
    $ch = curl_init();
    if ($ch) {
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_FILE, $fh);
        curl_setopt($ch, CURLOPT_FAILONERROR, TRUE);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
        #curl_setopt($ch, CURLOPT_VERBOSE, TRUE);

        $result = curl_exec($ch);
        print $result;

        // check for errors
        if (curl_errno($ch) != 0) {
            print 'Request failed. ' . curl_error($ch) .'-'. curl_errno($ch);
        }
        curl_close($ch);
    }
    fclose($fh);
}
?>
