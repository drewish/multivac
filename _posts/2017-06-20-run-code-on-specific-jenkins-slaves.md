---
layout: post
title: Run code on specific Jenkins hosts
---
I needed to update some code in a GitHub repo that's checked out as part of a
Jenkins pipeline. I could have just run the job over and over until it had run
on all the hosts, but with 15 hosts, that sounded like a pain in the ass.

Turns out you can pass a host name to `node` so here's a quick pipeline to run
the shell command on all the hosts (`ci-slave1` through `ci-slave15`):

```groovy
#!/usr/bin/env groovy

for (def i = 1; i <= 15; i++) {
    node("ci-slave${i}") {
        sh '''
            cd /home/jenkins/dev_tools
            git checkout master
            git pull
        '''
    }
}
```

Worth pointing out I'm using the old school `for` loop to avoid the CPS isssues
Jenkins has with the nicer Groovy loops.
