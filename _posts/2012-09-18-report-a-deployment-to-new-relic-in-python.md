---
layout: post
title: Report a deployment to New Relic (in python)
created: 1347998228
categories: documentation python new relic
---
I wanted to be able to have a fabric script report a code deployment to New Relic and eventually after brushing up on my python worked this snippet out:

```
import urllib
import urllib2

try:
  request = urllib2.Request(
    'https://rpm.newrelic.com/deployments.xml',
    urllib.urlencode({'deployment[application_id]': 'YOUR APPLICATION ID'}),
    {'X-api-key': 'YOUR API KEY'}
  )
  response = urllib2.urlopen(request)
except urllib2.HTTPError, e:
  print 'Error reporting: ', e.code
  print e.headers
  print e.fp.read()
```

