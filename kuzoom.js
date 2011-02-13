/*jslint white: true, browser: true, devel: true, 
 windows: true, undef: true, 
 nomen: true, eqeqeq: true, plusplus: true, bitwise: true, 
 regexp: true, newcap: true, immed: true */ 
/*global jQuery*/

//TODO: prefix jquery selected items with $
(function ($) {

    // Default configurations for fancyInput
    var defaultConf = {
        bigImageAttr : "href",
        lensHeight : 0,
        bigImageHeight : 0,
        smallImageHeight : 0
    };

    /**
     * Lens is the indicator on small image
     */
    var createLens = function (el, conf) {
        var lens = $("<div>").addClass("kuzoomLens")
                             .css({height : conf.lensHeight});

        el.append(lens);
        return lens;
    };

    /**
     * Zoom window is a container for big image
     */
    var createZoomWindow = function (el) {
        var zoomWindow = $("<div>").addClass("kuzoomWindow");
        el.append(zoomWindow);

        return zoomWindow;
    };


    /**
     * Big image, will be appended to zoom window
     */
    var createBigImage = function (el, zoomWindow, conf) {
        var bigImageUrl = el.attr(conf.bigImageAttr);
        var bigImage = $("<img>").attr("src", bigImageUrl);
        bigImage.appendTo(zoomWindow);

        return bigImage;
    };

    /**
     * Prevent click event on small image
     */
    var onClick = function (e) {
        e.preventDefault();
    };

    $.fn.kuzoom = function (conf) {
        // setup options
        conf = $.extend(defaultConf, conf);

        //ensure that our items are anchors to fit our structure
        var elementList = $(this).filter("a");

        elementList.each(function () {
            var el = $(this);

            el.click(onClick);

            var lens = createLens(el, conf);
            var zoomWindow = createZoomWindow(el);
            var bigImage = createBigImage(el, zoomWindow, conf);

            //calculate coordinates and heights
            var minTopForSmallImage = conf.lensHeight / 2;
            var smallImageHeight = conf.smallImageHeight;
            var bigImageHeight = conf.bigImageHeight;
            var lensRoute = (bigImageHeight + conf.lensHeight) - smallImageHeight;
            var maxTopForSmallImage = smallImageHeight - minTopForSmallImage;

            var itemTop = el.offset().top;

            el.mousemove(function (e) {
                var posY = e.pageY - itemTop,
                    lensTop = 0,
                    ratio = 0;



                //if lens moves out from top of image
                if (posY > minTopForSmallImage) {
                    //if moves to bottom
                    if (posY > maxTopForSmallImage) {
                        lensTop = maxTopForSmallImage - minTopForSmallImage;
                    }
                    else {
                        //middle of small image
                        lensTop = posY - minTopForSmallImage;
                    }
                }
                else {
                    //if lens at top of small image
                    lensTop = 0;
                }

                ratio = lensTop / smallImageHeight;

                //set margin for big image
                var bigImageTop = lensRoute * ratio;
                bigImage.css({"margin-top" : -1 * bigImageTop});
                lens.css({top : lensTop});
            });

        });
    };
}(jQuery));
