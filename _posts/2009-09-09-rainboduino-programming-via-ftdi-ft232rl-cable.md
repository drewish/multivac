---
layout: post
title: Rainboduino programming via FTDI FT232RL cable
created: 1252528654
categories: documentation usb ftdi arduino
image: http://www.flickr.com/photos/drewish/3904268969/
---
I bought one of the [Rainbowduinos](http://www.seeedstudio.com/depot/rainbowduino-led-driver-platform-plug-and-shine-p-371.html)
a while back but hadn't tried programming. Turns out it's a bit of a trick.
They (sort of) [document the process with a Seeedunio](http://www.seeedstudio.com/blog/?p=420)
but I don't have that particular board one so I decided to try to figure out
how to do it using the [FTDI FT232RL](http://www.adafruit.com/index.php?main_page=product_info&products_id=70)
cable I'd bought from adafruit industries.

After finding the FTDI pinout on the [datasheet](http://www.ftdichip.com/Documents/DataSheets/Modules/DS_TTL-232R_CABLES_V201.pdf)
and discovering that RTS is used to signal reset by the Arduino IDE I came up
with the following wiring diagram.

Connect the cable pins on the left to the board pins on the right. Note: that
you need to connect GND and VCC even if you're externally powering the
Rainboduino.

```
1 GND Black  <-> GND
3 VCC Red    <-> VCC
4 TXD Orange <-> RXD
5 RXD Yellow <-> TXD
6 RTS Green  <-> DTR
```


You should now be able to use the Arduino IDE to upload code. Make sure you
select the correct serial port and ATmega168 as the board type.
