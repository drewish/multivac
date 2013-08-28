---
layout: post
title: Building the C2 Morse code trainer on OSX
created: 1215075356
categories: macports osx morse code documentation
---
I was trying to install [Ward Cunningham and Jim Wilson's Morse code trainer](http://c2.com/morse/)
on OS X and it looks like their .dmg file doesn't work on the new Intel
machines. Here's what I did to get it to build.

Grab a copy of the source from the git repository:

```
amorton@minivac:~% git clone git://github.com/WardCunningham/morse.git
Initialized empty Git repository in /Users/amorton/morse/morse/.git/
remote: Counting objects: 52, done.
remote: Compressing objects: 100% (37/37), done.
remote: Total 52 (delta 12), reused 52 (delta 12)
Receiving objects: 100% (52/52), 1.85 MiB | 253 KiB/s, done.
Resolving deltas: 100% (12/12), done.
```

Use [MacPorts](http://www.macports.org/) to install the [required libraries](http://c2.com/morse/wiki.cgi?PortableLibraries)
libsdl and fntk:

```
amorton@minivac:~% sudo port install fltk libsdl
Password:
--->  Fetching fltk
--->  Attempting to fetch fltk-1.1.7-source.tar.bz2 from http://ftp.easysw.com/pub/fltk/1.1.7/
--->  Verifying checksum(s) for fltk
--->  Extracting fltk
--->  Applying patches to fltk
--->  Configuring fltk
--->  Building fltk with target all
--->  Staging fltk into destroot
--->  Installing fltk 1.1.7_2
--->  Activating fltk 1.1.7_2
--->  Cleaning fltk
Skipping org.macports.activate (libsdl ) since this port is already active
--->  Cleaning libsdl
```

Looks like I already had libsdl installed.

The existing makefile doesn't work but [Justin Burket](http://c2.com/morse/wiki.cgi?JustinBurket)
did the hard work to get this going in 10.3. His patch seemed to be reversed so
I manually applied it and updated it. My big contribution was adding the
Info.plist and building a proper .app bundle so the window gets the focus when
you launch it.

Download the attached patch and apply it:

```
amorton@minivac:~% cd morse/src/

amorton@minivac:~/morse/src% wget http://drewish.com/files/morse_osx.patch
--2008-07-03 01:59:42--  http://drewish.com/files/morse_osx.patch
Resolving drewish.com... 216.210.203.35
Connecting to drewish.com|216.210.203.35|:80... connected.
HTTP request sent, awaiting response... 200 OK
Length: 3416 (3.3K) [text/plain]
Saving to: `morse_osx.patch'

100%[======================================>] 3,416       --.-K/s   in 0.1s

2008-07-03 01:59:42 (27.1 KB/s) - `morse_osx.patch' saved [3416/3416]

amorton@minivac:~/morse/src% patch -p2 -i morse_osx.patch
patching file Info.plist
patching file Makefile
```


Now compile the app and move the result into the `/Applications` directory:

```
amorton@minivac:~/morse/src% make
g++ -c -Os `fltk-config --cxxflags` Bargraph.cxx
g++ -c -Os `fltk-config --cxxflags` Codebox.cxx
g++ -c -Os `sdl-config    --cflags` Cw.cxx
g++ -c -Os `fltk-config --cxxflags` Knob.cxx
fluid -c m.fl
g++ -c -Os `fltk-config --cxxflags` m.cxx
mkdir -p Morse.app/Contents/MacOS
g++ -o Morse m.o Bargraph.o Codebox.o Cw.o Knob.o \
	  `sdl-config --static-libs`  \
	  `fltk-config --ldstaticflags` -ldl \
	  -framework Carbon
mv Morse Morse.app/Contents/MacOS/
fltk-config --post Morse.app/Contents/MacOS/Morse
/Developer/Tools/Rez -t APPL -o Morse.app/Contents/MacOS/Morse /opt/local/include/FL/mac.r
cp Info.plist Morse.app/Contents/
rm *.o m.cxx m.h

amorton@minivac:~/morse/src% mv Morse.app /Applications/
```

