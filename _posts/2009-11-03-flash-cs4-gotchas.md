---
layout: post
title: Flash CS4 Gotchas
created: 1257281459
categories: documentation programming flash as3 documentation programming flash as3
---
I've been banging my head against Flash for the last few days and started trying to document a few things.

### Can't import fl.controls

For some reason Adobe didn't include them by default so you'll need to add the
path to the project.

1. Open the File > Publish Settings... menu item
1. Click the Flash tab
1. Click the Settings... button
1. Click the Source Path tab
1. Click the + button and paste in: `$(AppConfig)/Component Source/ActionScript 3.0/User Interface`


### Can't use a Tween on a scrollRect

The Tween class can only change a simple property and the scrollRect need to be
changed and the reassigned before it will update. The solution is to add new
property to the class and Tween that instead:

``` as3
public function get scrollX():Number {
  if (this.scrollRect) {
    return this.scrollRect.x;
  }
  return 0;
}

public function set scrollX(value:Number) {
  var r:Rectangle = this.scrollRect;
  if (r) {
    r.x = value;
    this.scrollRect = r;
  }
}
```

Then you can use a Tween:

``` as3
tween = new Tween(this, "scrollX", Strong.easeOut, scrollX, scrollX + 100, 1, true);
```

Also, you'll want to keep a reference to the Tween object so that it doesn't
get garbage collected half way through the animation.


### Can't use named HTML entities

Flash's [TextField only supports a small subset of named HTML entities](http://help.adobe.com/en_US/AS3LCR/Flash_10.0/flash/text/TextField.html#htmlText) (`&lt; &gt; &amp; &quot; &apos;`). If you're displaying HTML from users or a CMS you'll find that things like `&amp;deg;` slips by so you'll need to convert the named entities to their numeric versions.

**Update: ** I'd originally tried using PHP's HTML entity table to build some
ActionScript 3 conversion code but it turned out it was missing a lot of common
entities like em and en dashes. To account for these I converted the
[Wikipedia's List of XML and HTML character entity references](http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references)
into this format.

The framework for this code was taken from [here](http://as-gard.googlecode.com/svn/trunk/AS3/trunk/src/asgard/net/HTMLEntities.as).

``` php
<?php
public class HappyHtml {
  protected static var numberedEntities:Array = [
    '&#34;', '&#38;', '&#39;', '&#60;', '&#62;', '&#160;', '&#161;',
    '&#162;', '&#163;', '&#164;', '&#165;', '&#166;', '&#167;', '&#168;',
    '&#169;', '&#170;', '&#171;', '&#172;', '&#173;', '&#174;', '&#175;',
    '&#176;', '&#177;', '&#178;', '&#179;', '&#180;', '&#181;', '&#182;',
    '&#183;', '&#184;', '&#185;', '&#186;', '&#187;', '&#188;', '&#189;',
    '&#190;', '&#191;', '&#192;', '&#193;', '&#194;', '&#195;', '&#196;',
    '&#197;', '&#198;', '&#199;', '&#200;', '&#201;', '&#202;', '&#203;',
    '&#204;', '&#205;', '&#206;', '&#207;', '&#208;', '&#209;', '&#210;',
    '&#211;', '&#212;', '&#213;', '&#214;', '&#215;', '&#216;', '&#217;',
    '&#218;', '&#219;', '&#220;', '&#221;', '&#222;', '&#223;', '&#224;',
    '&#225;', '&#226;', '&#227;', '&#228;', '&#229;', '&#230;', '&#231;',
    '&#232;', '&#233;', '&#234;', '&#235;', '&#236;', '&#237;', '&#238;',
    '&#239;', '&#240;', '&#241;', '&#242;', '&#243;', '&#244;', '&#245;',
    '&#246;', '&#247;', '&#248;', '&#249;', '&#250;', '&#251;', '&#252;',
    '&#253;', '&#254;', '&#255;', '&#338;', '&#339;', '&#352;', '&#353;',
    '&#376;', '&#402;', '&#710;', '&#732;', '&#913;', '&#914;', '&#915;',
    '&#916;', '&#917;', '&#918;', '&#919;', '&#920;', '&#921;', '&#922;',
    '&#923;', '&#924;', '&#925;', '&#926;', '&#927;', '&#928;', '&#929;',
    '&#931;', '&#932;', '&#933;', '&#934;', '&#935;', '&#936;', '&#937;',
    '&#945;', '&#946;', '&#947;', '&#948;', '&#949;', '&#950;', '&#951;',
    '&#952;', '&#953;', '&#954;', '&#955;', '&#956;', '&#957;', '&#958;',
    '&#959;', '&#960;', '&#961;', '&#962;', '&#963;', '&#964;', '&#965;',
    '&#966;', '&#967;', '&#968;', '&#969;', '&#977;', '&#978;', '&#982;',
    '&#8194;', '&#8195;', '&#8201;', '&#8204;', '&#8205;', '&#8206;', '&#8207;',
    '&#8211;', '&#8212;', '&#8216;', '&#8217;', '&#8218;', '&#8220;', '&#8221;',
    '&#8222;', '&#8224;', '&#8225;', '&#8226;', '&#8230;', '&#8240;', '&#8242;',
    '&#8243;', '&#8249;', '&#8250;', '&#8254;', '&#8260;', '&#8364;', '&#8465;',
    '&#8472;', '&#8476;', '&#8482;', '&#8501;', '&#8592;', '&#8593;', '&#8594;',
    '&#8595;', '&#8596;', '&#8629;', '&#8656;', '&#8657;', '&#8658;', '&#8659;',
    '&#8660;', '&#8704;', '&#8706;', '&#8707;', '&#8709;', '&#8711;', '&#8712;',
    '&#8713;', '&#8715;', '&#8719;', '&#8721;', '&#8722;', '&#8727;', '&#8730;',
    '&#8733;', '&#8734;', '&#8736;', '&#8743;', '&#8744;', '&#8745;', '&#8746;',
    '&#8747;', '&#8756;', '&#8764;', '&#8773;', '&#8776;', '&#8800;', '&#8801;',
    '&#8804;', '&#8805;', '&#8834;', '&#8835;', '&#8836;', '&#8838;', '&#8839;',
    '&#8853;', '&#8855;', '&#8869;', '&#8901;', '&#8968;', '&#8969;', '&#8970;',
    '&#8971;', '&#9001;', '&#9002;', '&#9674;', '&#9824;', '&#9827;', '&#9829;',
    '&#9830;',
  ];
  protected static var namedEntities:Array = [
    '&quot;', '&amp;', '&apos;', '&lt;', '&gt;', '&nbsp;', '&iexcl;',
    '&cent;', '&pound;', '&curren;', '&yen;', '&brvbar;', '&sect;', '&uml;',
    '&copy;', '&ordf;', '&laquo;', '&not;', '&shy;', '&reg;', '&macr;',
    '&deg;', '&plusmn;', '&sup2;', '&sup3;', '&acute;', '&micro;', '&para;',
    '&middot;', '&cedil;', '&sup1;', '&ordm;', '&raquo;', '&frac14;', '&frac12;',
    '&frac34;', '&iquest;', '&Agrave;', '&Aacute;', '&Acirc;', '&Atilde;', '&Auml;',
    '&Aring;', '&AElig;', '&Ccedil;', '&Egrave;', '&Eacute;', '&Ecirc;', '&Euml;',
    '&Igrave;', '&Iacute;', '&Icirc;', '&Iuml;', '&ETH;', '&Ntilde;', '&Ograve;',
    '&Oacute;', '&Ocirc;', '&Otilde;', '&Ouml;', '&times;', '&Oslash;', '&Ugrave;',
    '&Uacute;', '&Ucirc;', '&Uuml;', '&Yacute;', '&THORN;', '&szlig;', '&agrave;',
    '&aacute;', '&acirc;', '&atilde;', '&auml;', '&aring;', '&aelig;', '&ccedil;',
    '&egrave;', '&eacute;', '&ecirc;', '&euml;', '&igrave;', '&iacute;', '&icirc;',
    '&iuml;', '&eth;', '&ntilde;', '&ograve;', '&oacute;', '&ocirc;', '&otilde;',
    '&ouml;', '&divide;', '&oslash;', '&ugrave;', '&uacute;', '&ucirc;', '&uuml;',
    '&yacute;', '&thorn;', '&yuml;', '&OElig;', '&oelig;', '&Scaron;', '&scaron;',
    '&Yuml;', '&fnof;', '&circ;', '&tilde;', '&Alpha;', '&Beta;', '&Gamma;',
    '&Delta;', '&Epsilon;', '&Zeta;', '&Eta;', '&Theta;', '&Iota;', '&Kappa;',
    '&Lambda;', '&Mu;', '&Nu;', '&Xi;', '&Omicron;', '&Pi;', '&Rho;',
    '&Sigma;', '&Tau;', '&Upsilon;', '&Phi;', '&Chi;', '&Psi;', '&Omega;',
    '&alpha;', '&beta;', '&gamma;', '&delta;', '&epsilon;', '&zeta;', '&eta;',
    '&theta;', '&iota;', '&kappa;', '&lambda;', '&mu;', '&nu;', '&xi;',
    '&omicron;', '&pi;', '&rho;', '&sigmaf;', '&sigma;', '&tau;', '&upsilon;',
    '&phi;', '&chi;', '&psi;', '&omega;', '&thetasym;', '&upsih;', '&piv;',
    '&ensp;', '&emsp;', '&thinsp;', '&zwnj;', '&zwj;', '&lrm;', '&rlm;',
    '&ndash;', '&mdash;', '&lsquo;', '&rsquo;', '&sbquo;', '&ldquo;', '&rdquo;',
    '&bdquo;', '&dagger;', '&Dagger;', '&bull;', '&hellip;', '&permil;', '&prime;',
    '&Prime;', '&lsaquo;', '&rsaquo;', '&oline;', '&frasl;', '&euro;', '&image;',
    '&weierp;', '&real;', '&trade;', '&alefsym;', '&larr;', '&uarr;', '&rarr;',
    '&darr;', '&harr;', '&crarr;', '&lArr;', '&uArr;', '&rArr;', '&dArr;',
    '&hArr;', '&forall;', '&part;', '&exist;', '&empty;', '&nabla;', '&isin;',
    '&notin;', '&ni;', '&prod;', '&sum;', '&minus;', '&lowast;', '&radic;',
    '&prop;', '&infin;', '&ang;', '&and;', '&or;', '&cap;', '&cup;',
    '&int;', '&there4;', '&sim;', '&cong;', '&asymp;', '&ne;', '&equiv;',
    '&le;', '&ge;', '&sub;', '&sup;', '&nsub;', '&sube;', '&supe;',
    '&oplus;', '&otimes;', '&perp;', '&sdot;', '&lceil;', '&rceil;', '&lfloor;',
    '&rfloor;', '&lang;', '&rang;', '&loz;', '&spades;', '&clubs;', '&hearts;',
    '&diams;',
  ];

  public static function decode(text:String):String {
    var len:int = namedEntities.length;
    for (var i:int = 0; i < len; i++) {
      var entity:String = namedEntities[i];
      var ch:String = numberedEntities[i];
      if (text.indexOf(entity) > -1) {
        text = text.replace(new RegExp(entity, "g"), ch);
      }
    }
    return text;
  }
}
```

