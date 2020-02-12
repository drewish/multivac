---
layout: post
title: Switching to fish
---
I've used tcsh as my terminal shell since I'd started using FreeBSD back in 2001. I tried switching to bash a few times but found it pretty irritating.

Last year at [The Big Elixir](https://www.thebigelixir.com) one of the speakers made a pitch for trying out [fish](https://fishshell.com) and a few weeks back I finally made the switch. I started this page to document what I'd done to get everything setup and help remember all the cool functionality I've come across.

So if you want to get started it's pretty easy if you've already got [homebrew](https://brew.sh) installed it's pretty easy:
```
brew install fish
```

Add it to the list of allowed shells by editing `/etc/shells` and appending:
```
/usr/local/bin/fish
```

Then you can switch your default shell:
```
chsh -s /usr/local/bin/fish
```

At this point you can open a new terminal and should be greeted by:
```
Welcome to fish, the friendly interactive shell
```

Fire up their browser based configuration tool and set your color scheme  (I like Solarized Dark) and prompt (Informative Vcs):
```
fish_config
```

Like other modern shells fish supports command completion. You can have it parse the man pages and extract options:
```
fish_update_completions
```
