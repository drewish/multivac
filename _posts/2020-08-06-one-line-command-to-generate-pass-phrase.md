---
layout: post
title: One line command to generate a pass phrase
---
I wanted to select some random words to use in a pass phrase and came up with
the following one liner:

```sh
ruby -e 'puts IO.readlines("/usr/share/dict/words").sample(5).join.tr("\n"," ")'
```
