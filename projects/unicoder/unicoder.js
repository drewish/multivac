/*jshint laxcomma:true, unused:true, curly:true, browser:true, jquery:true, indent:2, maxerr:50 */


function Unicoder(w, h) {
  this.img = null;
  this.afterUpdate = null; // callback

  this.targetWidth = w;
  this.targetHeight = h;
}

Unicoder.prototype.image = function (val) {
  if (val) {
    this.img = val;
    this.update();
  }
  return this.image;
};

Unicoder.prototype.height = function (val) {
  if (val) {
    this.targetHeight = parseInt(val, 10);
    this.update();
  }
  return this.targetHeight;
};

Unicoder.prototype.width = function (val) {
  if (val) {
    this.targetWidth = parseInt(val, 10);
    this.update();
  }
  return this.targetHeight;
};

// TODO these parameters might be over kill. Probably can clean them up.
Unicoder.prototype.fitInBounds = function (width, height, maxWidth, maxHeight) {
  width = width || this.img.width;
  height = height || this.img.height;
  maxWidth = maxWidth || this.targetWidth;
  maxHeight = maxHeight || this.targetHeight;

  var ratio = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio)
  };
};

Unicoder.prototype.update = function() {
  if (!this.img) { return; }

  var ctx = document.getElementById('canvas-sampled').getContext('2d')
    , bounded = this.fitInBounds()
    // We want to double the dimensions so each character can represent 4
    // pixels. But characters are taller than wide so we need a lower scalling
    // factor for the height.
    , sampleWidth  = bounded.width * 2
    , sampleHeight = Math.floor(bounded.height * 1.2)
    , data, pixels, text
    ;
  // Characters display two rows so ensure the height is an even number.
  sampleHeight += sampleHeight % 2;

  // Write the image to the canvas so we can read it back as an ImageData
  // instance which allows per pixel access.
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(this.img, 0, 0, sampleWidth, sampleHeight);
  data = ctx.getImageData(0, 0, sampleWidth, sampleHeight).data;

  // ...then convert it to grayscale and dither it to black and white...
  pixels = this.ditherPixels(this.imageDataToGrayPixels(data, sampleWidth, sampleHeight));
  // ...and finally make some text.
  text = this.pixelsToText(pixels);

  if (typeof this.afterUpdate == 'function') {
    this.afterUpdate(text);
  }
};

Unicoder.prototype.imageDataToGrayPixels = function (imageData, width, height) {
  var pixels = []
    , offset, red, green, blue, alpha
    ;
  for (var y = 0; y < height; y++) {
    pixels[y] = [];
    for (var x = 0; x < width; x++) {
      offset = (y * width + x) * 4;
      red   = imageData[offset];
      green = imageData[offset + 1];
      blue  = imageData[offset + 2];
      alpha = imageData[offset + 3];
      pixels[y][x] = (0.3 * red + 0.59 * green + 0.11 * blue) / 255;
    }
  }
  return pixels;
};

// Apply Floyd–Steinberg dithering
// http://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering
Unicoder.prototype.ditherPixels = function (pixels) {
  var height = pixels.length - 1
    , width = pixels[0].length - 1
    , x, y, old_pixel, new_pixel, quant_error
    ;
  for (y = 0; y < height; y += 1) {
    for (x = 0; x < width; x += 1) {
      old_pixel    = pixels[y][x];
      new_pixel    = Math.round(old_pixel);
      quant_error  = old_pixel - new_pixel;
      pixels[y][x] = new_pixel;
      if (x + 1 < width) {
        pixels[y  ][x+1] = pixels[y  ][x+1] + 7/16 * quant_error;
      }
      if (y + 1 < height) {
        pixels[y+1][x-1] = pixels[y+1][x-1] + 3/16 * quant_error;
        pixels[y+1][x  ] = pixels[y+1][x  ] + 5/16 * quant_error;
        pixels[y+1][x+1] = pixels[y+1][x+1] + 1/16 * quant_error;
      }
    }
  }
  return pixels;
};

// Each character represents a rectangle of 4 black or white pixels:
//   qr
//   st
// There are 16 possible combinations of and we have 16 different Unicode
// characters to represent them. To keep the references orderly I assigned each
// pixel a power of two:
//   12
//   48
// So adding up the values that are on gives you the index of the character in
// this list:
//   0123456789ABCDEF
//   █▟▙▄▜▐▚▗▛▞▌▖▀▝▘
// For example:
//   12
//   _8 sums to 11 (B) giving "▖"
// And:
//   1_
//   4_ sums to 5 giving "▐"
Unicoder.prototype.pixelsToText = function (pixels) {
  var characters = "█▟▙▄▜▐▚▗▛▞▌▖▀▝▘ ".split('')
    , height = pixels.length - 1
    , width = pixels[0].length - 1
    , string = ''
    , q, r, s, t
    ;
  for (var y = 0; y < height; y += 2) {
    for (var x = 0; x < width; x += 2) {
      q = 1 * Math.round(pixels[y][x]);
      r = 2 * Math.round(pixels[y][x + 1]);
      s = 4 * Math.round(pixels[y + 1][x]);
      t = 8 * Math.round(pixels[y + 1][x + 1]);
      string += characters[q + r + s + t];
    }
    string += "\n";
  }

  return string;
};