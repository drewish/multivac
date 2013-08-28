---
layout: post
title: Simple Arduino serial communications
created: 1244326057
categories: documentation arduino usb serial processing
---
I've been playing around with some Arduino stuff I bought from [adafruit industries](http://www.adafruit.com/) and needed to rough out some serial communications between the Arduino and Processing. This just sets the Arduino up to echo characters back at the Processing sketch which buffers a line of output and displays the last line from the serial port.

<h3>Processing Sketch</h3>
<img src="http://drewish.com/files/Processing - Echo.png" width="580" height="232"/>

``` java
/**
 * Terminal client.
 */
import processing.serial.*;

Serial port;
String input = "";
String output = "";
int lf = 10; // ASCII linefeed

void setup() {
  // Setup the screen for output.
  textFont(createFont("Verdana", 18));
  size(500, 130);
  noStroke();
  background(0);

  // List all the available serial ports:
  println(Serial.list());

  // The first serial port on my mac is the Arduino so I just open that.
  // Consult the output of println(Serial.list()); to figure out which you
  // should be using.
  port = new Serial(this, Serial.list()[0], 9600);

  // Fire a serialEvent() when when a linefeed comes in to the serial port.
  port.bufferUntil(lf);
  port.write(lf);
}

// Buffer a string until a linefeed is encountered then send it to the serial port.
void keyPressed() {
  if (key < 255) {
    output += str(key);
    if (key == lf) {
      print("sending: " + output);
      port.write(output);
      output = "";
    }
  }
}

// Process a line of text from the serial port.
void serialEvent(Serial p) {
  input = (port.readString());
  print("received: " + input);
}

// Draw the input and ouput buffers and a little help.
void draw() {
  background(0);
  fill(204, 102, 0);
  text("Type a line of text to send to the serial port:", 10, 20);
  fill(255, 255, 255);
  rect(10, 75, 480, 5);
  text(output, 10, 55);
  text(input, 10, 110);
}
```

<h3>Arduino Sketch</h3>
This part turned out to be trivial, it just reads a character at a time and writes it back.

``` java
/*
 * Reflect serial input back.
 */
void setup()
{
  Serial.begin(9600);
}

void loop()
{
  while (Serial.available() > 0) {
    Serial.write(Serial.read());
  }
}
```

