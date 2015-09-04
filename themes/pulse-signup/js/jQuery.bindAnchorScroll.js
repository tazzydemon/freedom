(function($, window, document) {
    'use strict';
                
    if ($.fn.bindAnchorScroll !== undefined) return false;
    $.fn.bindAnchorScroll = function() {
        this.bind('click', function(e) {
            var $this = $(this),
            hash = $this.attr('href').match(/^.*#(.*)$/);
            if (hash && hash.length > 1) hash = hash[1];
                        
            var $anchor = $('a[name="'+hash+'"]');
            if ($anchor.length) {
                e.preventDefault();
                            
                $anchor.removeAttr('name');
                window.location.hash = hash;
                $anchor.attr('name', hash);
                            
                var $body = $(document.body),
                y = Math.min(Math.round($anchor.first().offset().top), ($body.height() - $(window).height()));
                                    
                $('html,body').animate({
                    scrollTop: y
                });
            }
        });
                    
        return this;
    };
                
})(jQuery, window, document);