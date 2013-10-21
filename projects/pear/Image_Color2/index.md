---
layout: default
title: PEAR Image_Color2
---
Between August 2005 and January 2006 I developed a PHP5 color conversion
library which became the PEAR [Image_Color2](http://pear.php.net/package/Image_Color2)
package.

The impetus for this was trying to sort my Flickr favorites by color. After
some experimentation and frustration with the RGB color model I did some
research and discovered that I really wanted to be sorting by hue. So
converting to color model like HSL would make it much easier. I spent some
building a basic color conversion framework then polished it up enough to be
published as a PEAR module.

The package supports conversions between the following color models:

- RGB
- CMYK — Used in printing.
- Grayscale — Perceptively weighted gray scale.
- Hex — Hex RGB colors, e.g. #abcdef.
- HSL — Used in CSS3 to define colors.
- HSV — Used by Photoshop and other graphics packages.
- Named — RGB value for named colors like black, khaki, etc.
- WebsafeHex — Just like the hex mode, but rounds to web safe colors.
