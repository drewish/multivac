---
layout: post
title: Using cURL and the host header to bypass a load balancer
created: 1269897010
categories: curl documentation
---
Users are reporting that when they load the site they're occasionally seeing stale content. We have multiple app servers behind a load balancer so my suspicion is that one server isn't expiring content correctly so depending on which one you get you'll see different data. To test this I want to write a simple script to connect to each server save the results and then compare them for differences.

The main problem to tackle is that if I try to connect to www.example.com I'll be connecting to the load balancer and then handed off to a random server. I want to connect directly to each server servers so I'll need to use their  IP address. This approach would look something like:

``` sh
curl --verbose 'http://10.1.1.36:8000/the_url_to_test'
```

But since the servers use name-based virtual hosts so we'd get a 404 error back. The trick is to have curl send the proper host header:

```sh
curl --verbose --header 'Host: www.example.com' 'http://10.1.1.36:8000/the_url_to_test'
```


This gives us the output we need to start writing the comparison script.
