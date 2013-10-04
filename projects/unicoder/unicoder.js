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
  data = ctx.getImageData(0, 0, sampleWidth, sampleHeight);

  // ...then convert it to grayscale and dither it to black and white...
  pixels = this.ditherPixels(this.imageDataToGrayPixels(data));
  // ...and finally make some text.
  text = this.pixelsToText(pixels);

  if (typeof this.afterUpdate == 'function') {
    this.afterUpdate(text);
  }
};

Unicoder.prototype.imageDataToGrayPixels = function (imageData) {
  var pixels = []
    , data = imageData.data
    , x, y, offset, red, green, blue, alpha, brightness
    ;
  for (y = 0; y < imageData.height; y++) {
    pixels[y] = [];
    for (x = 0; x < imageData.width; x++) {
      offset = (y * imageData.width + x) * 4;
      red   = data[offset];
      green = data[offset + 1];
      blue  = data[offset + 2];
      alpha = data[offset + 3] / 255;
      // Perceptive weighting for grayscaling:
      brightness = (0.3 * red + 0.59 * green + 0.11 * blue) / 255;
      // Alpha blending assumes a white background:
      pixels[y][x] = brightness * alpha + (1 - alpha);
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


//  - - -

// Playing around trying to take a character and compute a 3x3 grid of its
// brightness. We'll use this to find the best character with "sub-character"
// accuracy

function charsInRange() {
  var i = 0
    , ints = [];
  for (i = 32; i < 127; i ++) {
    ints.push(i);
  }
  return String.fromCharCode.apply(this, ints);
}

function sampleChar(size, text) {
  // Some rough approximations based on measuring Courier New
  var font_size = parseInt(size, 10)
    , height = Math.ceil(font_size * (72/64))
    , width = Math.ceil(font_size * (38/64))
    ;

  var ctx = document.getElementById('canvas-text').getContext('2d');
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.textBaseline = "top";
  ctx.font = font_size + 'px "Courier New"';
  ctx.fillText(text, 0, 0);

  var imagedata = ctx.getImageData(0, 0, width, height);
  var pixels = Unicoder.prototype.imageDataToGrayPixels(imagedata);

  // Turn each line into three average values
  var p = pixels.map(function(line) {
    return into_thirds(line).map(function avg(a) {
      var sum = 0;
      for (var i = a.length - 1; i >= 0; i--) {
        sum += a[i];
      }
      return (sum / a.length);
    });
  });
  // Then create three groups of lines and average the chunks vertically.
  var q = into_thirds(p).map(function (chunk) {
    var sum = [0, 0, 0]
      , length = chunk.length;
    for (var i = length - 1; i >= 0; i--) {
      sum[0] += chunk[i][0];
      sum[1] += chunk[i][1];
      sum[2] += chunk[i][2];
    }
    return [sum[0] / length, sum[1] / length, sum[2] / length];
  });


$('.hide').removeClass('hide');

  return q;
}

// Divide an array into three nicely sized chunks.
function into_thirds(array) {
  var n = array.length
    , r = Math.floor(n / 3)
    , lengths = [r, r, r]
    ;
  // Single extra line goes in the middle.
  if (n % 3 == 1) {
    lengths[1] = r + 1;
  }
  // Two extra lines go on the ends.
  else if (n % 3 == 2) {
    lengths[0] = lengths[2] = r + 1;
  }

  return lengths.map(function(v) {
    return array.splice(0, v);
  });
}
