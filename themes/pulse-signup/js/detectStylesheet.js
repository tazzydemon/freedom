(function (navigator, window, document) {
    'use strict';

    var themeDir = document.getElementsByTagName('html')[0].getAttribute('data-theme-dir');
//    console.log("themedir"+themeDir);
    function setName(name, touch) {
        window.isTouch = !! touch;
        return name + (window.isTouch ? '-touch' : '');
    }

    var ua = navigator.userAgent.toString(),
        stylesheet = '',
        touch      = '';

    if (ua.match('MSIE 9')) touch = setName('', !! ua.match('IEMobile'));
    else if (ua.match('WebKit')) touch = setName('', !! ua.match(/(Android|iP(ad|od|hone)|Mobile|Tablet)/));
    else if (ua.match('Firefox')) touch = setName('', !! ua.match(/(Android|iP(ad|od|hone)|Mobile|Tablet)/));
    else if (ua.match('Opera')) touch = setName('', !! ua.match(/(Mobile|Mini)/));
    else touch = setName('', !! ua.match(/(Touch|Mobile|Phone|Tablet|Android|iP(ad|od|hone))/));



    if (ua.match('MSIE 9')) stylesheet = setName('-msie9');
    else if (ua.match('MSIE 8')) stylesheet = setName('-msie8');
    else if (ua.match('MSIE 7')) stylesheet = setName('-msie7');
    else if (ua.match('WebKit')) stylesheet = setName('-webkit');
    else if (ua.match('Firefox')) stylesheet = setName('-moz');
    else if (ua.match('Opera')) stylesheet = setName('-o');
    else stylesheet = setName(''); //uses clean sheet

// SMALL ~ 568px =========================
    // SPRITES : Non-Retina, clean
    document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/sprite-sm.css" />');

    // SPRITES - RETINA : vendor prefixed
        if (stylesheet == '-webkit' || stylesheet == '-moz' || stylesheet == '-o'  )
            document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/sprite-sm-retina' + stylesheet + '.css"  />');

    // SPRITES - RETINA : clean
    document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/sprite-sm-retina.css" media="only screen and (min-resolution: 144dpi), only screen and (min-resolution: 1.5dppx)" />');


    // INCLUDES : vendor prefixed

		if ( stylesheet == '-msie7' || stylesheet == '-msie8' || stylesheet == '-msie9' || stylesheet == '-webkit' || stylesheet == '-moz' || stylesheet == '-o'  )
            document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/includes-sm' + stylesheet + touch + '.css" />');

    // INCLUDES : clean
    document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/includes-sm' + touch + '.css" />');


    // BASE
        if ( stylesheet == '-msie7' || stylesheet == '-msie8' ){
            document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/base-sm-non-responsive.css" />');
        } else {
            document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/base-sm' + touch + '.css" />');
        }


// LARGE 569px ~ =========================

    // SPRITES : Non-Retina, clean
    document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/sprite-lg.css" />');

    // SPRITES - RETINA : vendor prefixed
    	if (stylesheet == '-webkit' || stylesheet == '-moz' || stylesheet == '-o'  )
            document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/sprite-lg-retina' + stylesheet + '.css"  />');

    // SPRITES - RETINA : clean
    document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/sprite-lg-retina.css" media="(min-width: 569px) and only screen and (min-resolution: 144dpi), only screen and (min-resolution: 1.5dppx)" />');


    // INCLUDES : vendor prefixed
		// non-responsive browsers
		if ( stylesheet == '-msie7' || stylesheet == '-msie8' ){
            document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/includes-lg' + stylesheet + '.css">');
        } else {
            document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/includes-lg' + stylesheet + touch + '.css"  media="screen and (min-width:569px)" />');
        }

		// responsive browsers
		if ( stylesheet == '-msie9' || stylesheet == '-webkit' || stylesheet == '-moz' || stylesheet == '-o'  )
            document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/includes-lg' + stylesheet + touch + '.css"  media="screen and (min-width:569px)" />');

    // INCLUDES : clean
	// non-responsive browsers
		if ( stylesheet == '-msie7' || stylesheet == '-msie8' ){
            document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/includes-lg.css"/>');
        } else {
            document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/includes-lg' + touch + '.css"  media="screen and (min-width:569px)" />');
        }


    // BASE
		if ( stylesheet == '-msie7' || stylesheet == '-msie8' ){
            document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/base-lg-non-responsive.css" />');
        } else {
            document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/base-lg' + touch + '.css" media="screen and (min-width:800px)" />');
        }


// PRINT ~ =========================
    document.write('<link rel="stylesheet" type="text/css" href="' + themeDir + '/css/print.css" media="print" />');

})(navigator, window, document);
