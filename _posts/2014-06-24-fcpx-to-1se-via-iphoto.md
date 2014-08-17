---
layout: post
title: Final Cut Pro X to 1 Second Everyday via iPhoto
---
In my [last post](/2014/06/23/our-year-with-ryland) I mentioned using my 5D for
some of the shots in the 1 Second Every day video. I found it a little
complicated to get those from Final Cut Pro X, where I store my video, to the
iPhone's Camera Roll while maintaining the correct date.

The short version is that you need to:

- convert the video to a compatible codec
- set the file's modified date to the date it was shot
- use iPhoto and iTunes to copy the video to the phone

*I'll note that I'd tried bypassing iPhoto and syncing the videos as a folder
but it didn't work. The videos would appear in the Camera Roll but when I
opened 1SE, it wouldn't show them.*

### In Final Cut Pro X

Locate the clip, right-click it then select "Reveal in Finder" (or hit ⇧⌘R).

*I'd tried using the "Send to Compressor" option but Compressor tended to spend
a lot more time with the spinning beach ball.*

### In Compressor

- Drop the original file from Finder into the new batch.
- Drop the "Apple Devices HD (Best Quality)" settings onto the batch.
- I'd suggest setting the Location to a new folder.

*Note that you can convert multiple videos in the same batch.*

### In Terminal

*I had dozens of videos that needed their dates fixed so I whipped up this
bash script to automate the process. If you've only got one or two videos, it's
far simpler use iPhoto's "Adjust Date and Time..." feature after you import the
videos and skip this step.*

Use the following bash script to set the file's modified date to the capture
time specified in the file's name. It'll loop over all the `m?v` files in the
current directory and try to set their modified dates to the time in the file
name.

```bash
#!/bin/bash
for i in *.m?v
do
  # Example inputs:
  #   2014-05-28 19_58_42 (id).mov
  #   2014-06-22 16_38_40 (id)-Apple Devices HD (Best Quality).m4v
  # We ditch the extension (the digit in m4v screws it up) and then all the
  # other non-digits and turn the second underscore into a period:
  #   201405281958.42
  t=`echo $i | sed -e 's/m?v//' -e 's/[^0-9_\n]//g' -e 's/_//' -e 's/_/./'`
  touch -t $t "$i"
done
```

I'm lazily skipping over the details of where this script should live and how
to use `chmod` to make it executable... If you need help with this [hit me up
on twitter](https://twitter.com/drewish).

### In iPhoto

Import the converted clips into a new "Videos to 1SE" event.

### In iTunes

Configure the photos settings to look like the image below:

![iTunes screenshot]({% asset_path 1SE_iTunes_settings.png %})

By checking:

- Sync Photos from `iPhoto`
- Selected albums, Events, and Faces, and automatically include `no Events`
- Include videos
- Events: `Videos to 1SE`

Apply the changes and when your phone finishes syncing, you should have access
to the videos in 1SE.
