(function ($) {
    'use strict';

    $.extend({
        animateTo: {
            /**
             * Animates to a given Y position
             * @param y A y position in CSS units
             */
            y: function (y, speed, callback) {
                $('html,body').animate({
                    scrollTop: y
                }, speed, callback);
                return this;
            },

            /** 
             * Animates to the top of the page
             */
            top: function (speed, callback) {
                this.y(0, speed, callback);
                return this;
            },

            /**
             * Animates the scroll position to the top of the container in the current page housing the
             * specified url path. To use this you must mark the wrapping tag of each page with a 'data-url-segment'
             * attribute which marks their url segment in the site tree. For example, /one/two/three/ would look for
             * an element with data-url-segment="three" within an element with data-url-segment="two" which itself is
             * within an element with data-url-segment="one".
             * 
             * @param targetUrl The url path to navigate to
             */
            page: function (targetUrl, speed, callback) {
                if (targetUrl.replace(/\//g, '') === '') return this.top();

                // else
                var segments = targetUrl.split('/'),
                    target;
                $.each(segments, function () {
                    if (this === '') return;
                    var potentialTargets = $('[data-url-segment=' + this + ']', target || 'body').toArray();
                    potentialTargets.sort(function (a, b) {
                        return $(a).parents().length - $(b).parents().length;
                    });
                    target = potentialTargets[0];
                });

                if (target) {
                    var offsetY = $(target).offset().top;
                    return this.y(offsetY, speed, callback);
                }

                return this;
            }
        }
    });
})(jQuery);