(function ($, window, document) {
    'use strict';

    function Lightbox() {
        this.init.apply(this, arguments);
    }

    Lightbox.prototype = {
        aElement: null,
        type: null,
        galleryItems: [],
        galleryIndex: 0,
        formHref: null,
        insertText: '',
        lbHtml: '<div id="lightbox-background"></div>' + '<div id="lightbox" class="{{type}}">' + '    <div class="outer">' + '        <div class="inner">' + '            <div class="close"><span></span><a href="#"><span></span>Close</a></div>' + '            <div class="container">' + '                {{insert}}' + '            </div>' + '            {{wait-indicator}}' + '            <figcaption></figcaption>' + '        </div>' + '    </div>' + '</div>',
        waitIndicatorHtml: '<div class="wait-indicator">' + '   <img src="themes/hyundai/images/loader.gif"/>' + '</div>',
        prevNextHtml: '<a class="next" href="#">Next</a>' + '<a class="prev" href="#">Prev</a>',
        touchHintsHtml: '<div class="touchHints">Swipe left or right to change image.</div>',
        youtubeID: null,
        youtubeHtml: '<iframe width="600" height="315" src="http://www.youtube.com/embed/{{youtubeID}}" frameborder="0" allowfullscreen></iframe>',

        init: function (el) {
            if (!el) {
                return el;
            }
            this.aElement = el;
            this.type = $(this.aElement).attr("rel").split(" ")[1];

            var src = $(this.aElement).attr('href');
            switch (this.type) {
            case 'lb-gallery':
                this.initiateGallery(src);
                this.insertText = this.prevNextHtml;
                break;
            case 'youtube':
                this.youtubeID = src.match(/[\?&]v=([^&#]*)/)[1];
                this.insertText = this.youtubeHtml.replace('{{youtubeID}}', this.youtubeID);
                break;
            case 'form':
                this.formHref = src;
                break;
            default:
                this.galleryItems = {
                    href: src,
                    caption: $(this.aElement).find('span.caption').text()
                };
                this.galleryIndex = 0;
            }

            this.insertLightBox();

            return this;
        },

        insertLightBox: function () {
            var prependThis = this.lbHtml.replace('{{type}}', this.type).replace('{{insert}}', this.insertText).replace('{{wait-indicator}}', (this.type === 'form' ? this.waitIndicatorHtml : ''));

            $("body").prepend(prependThis);
            $("#lightbox-background").hide().fadeIn(400);

            var lb = $("#lightbox");
            var vScrollTop = $(window).scrollTop() + 50;
            lb.css("top", vScrollTop);

            var outerThis = this;
            lb.hide().delay(400).fadeIn(700, function () {
                // Click-outside closing
                $('#lightbox,#lightbox-background').bind('click', outerThis.closeLightBox);
                $('div.outer', '#lightbox').bind('click', function (e) {
                    e.stopPropagation();
                });

                // Load content
                if (outerThis.type === 'form') {
                    $("#lightbox div.container").load(outerThis.formHref);
                } else { // Image or gallery
                    outerThis.loadImage(outerThis.galleryItems[outerThis.galleryIndex]);

                    $('#lightbox a').filter('.next').bind('click', function (e) {
                        e.preventDefault();
                        outerThis.changeSlide(1, true);
                    }).end().filter('.prev').bind('click', function (e) {
                        e.preventDefault();
                        outerThis.changeSlide(-1, true);
                    });
                }
            });
            lb.find(".close a").click(function (e) {
                e.preventDefault();
                outerThis.closeLightBox();
            });

            if (this.galleryItems.length) {
                this.touchGestures();
            }

            // Daisychaining support
            return this;
        },

        removeImage: function (galleryItem) {
            $("figcaption", "#lightbox").fadeTo(350, 0);
            var outerThis = this;
            $("div.container img", "#lightbox").fadeOut(350, function () {
                outerThis.loadImage(galleryItem);
            });

            // Daisychaining support
            return this;
        },

        loadImage: function (galleryItem) {
            var outerThis = this;
            //delete any existing image
            if ($("div.container", "#lightbox").find("img").length > 0) {
                $("div.container img", "#lightbox").remove();
            }
            var animating = true;
            var maxWidth = 960;

            var img = $("<img />").load(function () {
                var vThisW, vThisH;
                if (this.width > maxWidth) {
                    vThisW = maxWidth;
                    vThisH = this.height * (maxWidth / this.width);
                } else {
                    vThisW = this.width;
                    vThisH = this.height;
                }
                $("div.container", "#lightbox").animate({
                    width: vThisW,
                    height: vThisH
                }, 700, function () {
                    animating = false;
                    if (outerThis.$touchHintsEl) {
                        outerThis.$touchHintsEl.fadeIn().delay(2500).fadeOut(null, function () {
                            $(this).remove();
                        });
                    }
                }).css("overflow", "visible");

                /*
                 * Is first check this needed? It is bugging out in IE7+8
                 */
                //            if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                //                console.log('Broken image!');
                //            } else {
                var id = window.setInterval(function () {
                    if (animating === false) {
                        $("div.container", "#lightbox").prepend(img).find("img").hide().fadeIn(700);
                        $("figcaption", "#lightbox").text(galleryItem.caption || '').hide().fadeTo(700, 1);
                        window.clearInterval(id);
                    }
                }, 1000);
                //            }
            }).attr('src', galleryItem.href);

            // Daisychaining support
            return this;
        },

        closeLightBox: function () {
            $(document).off("click", "#lightbox a.next");
            $(document).off("click", "#lightbox a.prev");
            var outerThis = this;
            $("#lightbox").fadeOut(700, function () {
                $(this).remove();
            });
            $("#lightbox-background").delay(400).fadeOut(400, function () {
                $(this).remove();

                // Go as far to destroying the Lightbox object as we can in JS
                outerThis.lb = null;
            });

            // Daisychaining support
            return this.aElement;
        },

        /**
         * Configures touch-swipe gestures for the lightbox if the user is on a mobile device. Also shows and then
         * hides usage instructions.
         * @return {Object} self
         */
        touchGestures: function () {
            if (window.isMobile && document.addEventListener) {
                var start = {
                    x: null,
                    y: null
                },
                    diff = {
                        x: 0,
                        y: 0
                    },
                    touch = {
                        x: null,
                        y: null
                    },
                    threshold = 50,
                    lightbox = document.getElementById('lightbox'),
                    outerThis = this;

                $('a.next,a.prev', lightbox).hide();
                this.$touchHintsEl = $(this.touchHintsHtml).hide();
                $(lightbox).find('div.inner').append(this.$touchHintsEl);

                var touchStart = function (e) {
                        lightbox.addEventListener('touchmove', touchMove);
                        lightbox.addEventListener('touchend', touchEnd);

                        start = {
                            x: e.touches[0].screenX,
                            y: e.touches[0].screenY
                        };
                        touch = {
                            x: null,
                            y: null
                        };
                        diff = {
                            x: null,
                            y: null
                        };
                    },
                    touchMove = function (e) {
                        touch = {
                            x: e.touches[0].screenX,
                            y: e.touches[0].screenY
                        };
                        diff = {
                            x: touch.x !== null ? touch.x - start.x : 0,
                            y: touch.y !== null ? touch.y - start.y : 0
                        };

                        if (diff.y > threshold || diff.y < -threshold) {
                            lightbox.removeEventListener('touchmove', touchMove);
                            lightbox.removeEventListener('touchend', touchEnd);
                        } else if (diff.x > threshold || diff.x < -threshold) {
                            e.preventDefault();
                        }
                    },
                    touchEnd = function () {
                        if (diff.x > threshold || diff.x < -threshold) {
                            outerThis.changeSlide(Math.max(-1, Math.min(1, diff.x)), true);
                        }

                        lightbox.removeEventListener('touchmove', touchMove);
                        lightbox.removeEventListener('touchend', touchEnd);
                    };

                lightbox.addEventListener('touchstart', touchStart);
            }
            return this;
        },

        /**
         * Switches the slide based on an index
         * @param {Int} index The index (absolute or relative) to advance the slide to
         * @param {Bool} relative (optional) If set to true, <b>index</b> will be treated as relative (positive or negative to the current slide)
         * @return {Object} self
         */
        changeSlide: function (index, relative) {
            if (this.type === 'lb-gallery') {
                relative = relative || false;

                if (relative) {
                    this.galleryIndex += index;
                } else {
                    this.galleryIndex = index;
                }

                if (this.galleryIndex > this.galleryItems.length - 1) {
                    this.galleryIndex = 0;
                } else if (this.galleryIndex < 0) {
                    this.galleryIndex = this.galleryItems.length - 1;
                }

                var nextGalleryItem = this.galleryItems[this.galleryIndex];
                this.removeImage(nextGalleryItem);
            }

            // Daisychaining support
            return this;
        },

        initiateGallery: function () {
            var outerThis = this;
            $('a[rel~="lb"][rel~="lb-gallery"]').not('[rel~="lb-gallery-exclude"]').each(function (i) {
                if ($(this).attr('href') === $(outerThis.aElement).attr('href')) {
                    outerThis.galleryIndex = i;
                }
                var newGallItem = {
                    href: $(this).attr("href"),
                    caption: $(this).find('span.caption').text()
                };
                outerThis.galleryItems[i] = newGallItem;
            });

            // Daisychaining support
            return this;
        }
    };

    $(function () {
        $('a[rel*="lb"]').click(function (e) {
            e.preventDefault();
            this.lb = new Lightbox(this);
        });
    });
})(jQuery, window, document);