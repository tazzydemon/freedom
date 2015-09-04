/**
 * @author Nik Rolls
 * @version: 1.0
 * 
 * A simple jQuery plugin that turns a child ul with the class of slideshow into an automatically animating slideshow.
 * Previous and next links are optional, as are a navigation list, and you can select between slide or fade transitions.
 * 
 */

(function (jQuery, window) {
    "use strict";

    var $ = jQuery;

    // prevent duplication
    if ($.slideshow) return false;

    $.fn.slideshow = function (options) {
        var $el = this,
            cl = {
                settings: {
                    animation: 'slide'
                },

                $list: $('ul.slideshow', $el),
                $items: undefined,
                $current: undefined,
                slideshowTimer: null,

                $prevNext: $('a.prev', $el).add('a.next', $el),
                prevNextTimer: null,
                animatingIn: false,

                $slideshowLinks: $('.link-container', $el).find('a'),
                hiddenSlideshowLinkHeight: undefined,

                init: function () {
                    this.settings = $.extend(this.settings, options);

                    this.$items = this.$list.children();
                    this.$current = this.$items.first();
                    this.hiddenSlideshowLinkHeight = this.$slideshowLinks.height();

                    this.slideshowTimer = window.setTimeout(this.advanceSlideshow.bind(this), 10000);
                    this.makeSlideshowLinkActive(0);
                    this.$slideshowLinks.bind('click', this.slideshowLinkClick.bind(this));

                    switch (this.settings.animation) {
                    case 'slide':
                        this.$items.not(':first').css('margin-left', this.$list.first().width());
                        break;
                    case 'fade':
                        this.$items.not(':first').hide();
                        break;
                    }

                    this.$prevNext.bind('click', this.prevNextClick.bind(this));
                    this.$items.add(this.$prevNext).add(this.$slideshowLinks).hover(this.prevNextShow.bind(this), this.prevNextHide.bind(this));
                },

                advanceSlideshow: function (qty) {
                    window.clearTimeout(this.slideshowTimer);

                    var ourQty = qty !== undefined ? qty : 1;

                    if (ourQty % this.$items.length) {
                        var $next = this.$current;
                        while (ourQty !== 0) {
                            if (ourQty < 0) {
                                $next = $next.prev();
                                if (!$next.length) $next = this.$items.last();
                            } else {
                                $next = $next.next();
                                if (!$next.length) $next = this.$items.first();
                            }
                            ourQty -= (Math.max(-1, Math.min(1, ourQty)));
                        }

                        switch (this.settings.animation) {
                        case 'slide':
                            this.slide(this.$current, $next, qty);
                            break;
                        case 'fade':
                            this.fade(this.$current, $next);
                            break;
                        }

                        this.$current = $next;
                        this.makeSlideshowLinkActive(this.$current.index());
                    }

                    this.slideshowTimer = window.setTimeout(this.advanceSlideshow.bind(this), 10000);
                },

                slide: function (current, next, qty) {
                    var $next = next instanceof jQuery ? next : $(next),
                        $current = current instanceof jQuery ? current : $(current),
                        direction;

                    if (qty) direction = qty < 0 ? -1 : 1;
                    else direction = $next.index() < $current.index() ? -1 : 1;

                    $next.css({
                        marginLeft: $next.width() * direction
                    });
                    $next.animate({
                        marginLeft: 0
                    });
                    $current.animate({
                        marginLeft: $current.width() * (direction * -1)
                    });
                },

                fade: function (current, next) {
                    var $next = next instanceof jQuery ? next : $(next),
                        $current = current instanceof jQuery ? current : $(current);

                    $current.fadeOut();
                    $next.fadeIn();
                },

                makeSlideshowLinkActive: function (index) {
                    this.$slideshowLinks.removeClass('active').siblings('span.arrow').hide().end().eq(index).addClass('active').siblings('span.arrow').css('display', 'inline');
                },
                showSlideshowLinks: function () {
                    this.$slideshowLinks.stop().animate({
                        height: 30,
                        marginBottom: 0
                    });
                },
                hideSlideshowLinks: function () {
                    this.$slideshowLinks.stop().animate({
                        height: this.hiddenSlideshowLinkHeight,
                        marginBottom: 10
                    });
                },
                slideshowLinkClick: function (e) {
                    e.preventDefault();
                    var i = 0;
                    $.each(this.$slideshowLinks, function () {
                        if (this === e.currentTarget) return false;
                        i += 1;
                    });
                    this.advanceSlideshow(i - this.$current.index());
                },

                prevNextClick: function (e) {
                    e.preventDefault();
                    if ($(e.target).hasClass('next')) this.advanceSlideshow(1);
                    else this.advanceSlideshow(-1);
                },
                prevNextShow: function () {
                    this.showSlideshowLinks();
                    if (this.$prevNext.css('display') === 'none') this.$prevNext.css('opacity', '0');
                    this.$prevNext.stop(true).show().animate({
                        opacity: 1
                    });
                },
                prevNextHide: function () {
                    this.hideSlideshowLinks();
                    this.$prevNext.stop(true).fadeOut();
                }
            }.init();

        return this;
    };

})(jQuery, window);