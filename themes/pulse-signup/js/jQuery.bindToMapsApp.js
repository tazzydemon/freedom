(function($, window, document, navigator) {
                'use strict';
                
                if ($.fn.bindToMapsApp) return false;
                
                var platform = null,
                matches= {
                    ios: /\biP(?:hone|(?:a|o)d)\b/,
                    ios6: /\biP(?:hone|(?:a|o)d).*?iOS (?:[6-9]_|[1-9][0-9])\b/,
                    android: /\bAndroid\b/,
                    wp7: /\bWindows Phone.+?7(?!\d)/,
                    wp8: /\bWindows Phone.+?8(?!\d)/,
                    win8: /\bWindows NT (?:6\.[2-9]|[7-9]|[1-9][0-9])/, // Windows NT 6.2 +
                    other: /./
                };
                $.each(matches, function(index) {
                    if (navigator.userAgent.match(this)) {
                        platform = index;
                        return false;
                    }
                });
                
                $.fn.bindToMapsApp = function(options) {
                    var $el = this,
                    cl = { // Class
                        options: {
                            platforms: {
                                ios: {
                                    address: {
                                        base: 'maps:?q={name}{address}',
                                        name: '{name}',
                                        address: ', {address}',
                                        external: false
                                    },
                                    coords: {
                                        base: 'maps:?q={name}{latlon}',
                                        name: 'q={name}',
                                        latlon: '@{lat},{lon}',
                                        external: false
                                    }
                                },
                                ios6: {
                                    address: {
                                        base: 'http://maps.apple.com/?q={name}{address}{zoom}',
                                        name: '{name}',
                                        address: ', {address}',
                                        zoom: '&z={zoom}',
                                        external: false
                                    },
                                    coords: {
                                        base: 'http://maps.apple.com/?{name}{latlon}{zoom}',
                                        name: 'q={name}',
                                        latlon: '&sll={lat},{lon}',
                                        zoom: '&z={zoom}',
                                        external: false
                                    }
                                },
                                android: {
                                    address: {
                                        base: 'geo:0,0?{address} {name}{zoom}',
                                        address: 'q={address}',
                                        name: '({name})',
                                        zoom: '&z={zoom}',
                                        external: false
                                    },
                                    coords: {
                                        base: 'geo:{latlon}?q={latlon}{name}{zoom}',
                                        latlon: '{lat},{lon}',
                                        name: '({name})',
                                        zoom: '&z={zoom}',
                                        external: false
                                    }
                                },
                                wp7: {
                                    address:{ 
                                        base: 'maps:{name}{address}',
                                        name: '{name}',
                                        address: ', {address}',
                                        external: false
                                    },
                                    coords: {
                                        base: 'maps:{latlon}',
                                        latlon: '{lat} {lon}',
                                        external: false
                                    }
                                },
                                wp8: {
                                    address:{ 
                                        base: 'maps:{name}{address}',
                                        name: '{name}',
                                        address: ', {address}',
                                        external: false
                                    },
                                    coords: {
                                        base: 'maps:{latlon}',
                                        latlon: '{lat} {lon}',
                                        external: false
                                    }
                                },
                                win8: {
                                    address:{ 
                                        base: 'bingmaps:?where={name}{address}{zoom}',
                                        name: '{name}',
                                        address: ', {address}',
                                        zoom: '&lvl={zoom}',
                                        external: false
                                    },
                                    coords: {
                                        base: 'bingmaps:?{latlon}{zoom}',
                                        latlon: 'cp={lat}~{lon}',
                                        zoom: '&lvl={zoom}',
                                        external: false
                                    }
                                },
                                other: {
                                    address: {
                                        base: 'http://maps.google.com/?q={name}{address}{zoom}',
                                        name: '{name}',
                                        address: ', {address}',
                                        zoom: '&z={zoom}',
                                        external: true
                                    },
                                    coords: {
                                        base: 'http://maps.google.com/?{name}{latlon}{zoom}',
                                        name: 'q={name}',
                                        latlon: '&sll={lat},{lon}',
                                        zoom: '&z={zoom}',
                                        external: true
                                    }
                                }
                            }
                        },
                        
                        init: function(options) {
                            $.extend(true, this.options, options);
                            
                            var data = {
                                name: {
                                    regex: /\{name\}/g,
                                    value: $el.data('name')
                                },
                                address: {
                                    regex: /\{address\}/g,
                                    value: $el.data('address')
                                },
                                latlon: {
                                    regex: /\{latlon\}/g,
                                    lat: {
                                        regex: /\{lat\}/g,
                                        value: $el.data('lat')
                                    },
                                    lon: {
                                        regex: /\{lon\}/g,
                                        value: $el.data('lon')
                                    }
                                },
                                zoom: {
                                    regex: /\{zoom\}/g,
                                    value: $el.data('zoom')
                                }
                            },
                            href, conf = this.options.platforms[platform];

                            if (0&&data.address.value) {
                                conf = conf.address;
                                href = conf.base;
                            } else if (data.latlon.lat.value && data.latlon.lon.value) {
                                conf = conf.coords;
                                href = conf.base;
                            }
                            $.each(data, function(name) {
                                if (conf[name]) {
                                    if (this.value !== undefined) {
                                        href = href.replace(this.regex, conf[name].replace(this.regex, this.value)); 
                                    } else if (this.lat && this.lat.value !== undefined && this.lon && this.lon.value !== undefined) {
                                        href = href.replace(this.regex, conf[name].replace(this.lat.regex, this.lat.value).replace(this.lon.regex, this.lon.value));
                                    } else {
                                        href = href.replace(this.regex, '');
                                    }
                                }
                            });
                            
                            $el.attr('href', href);
                            if (conf.external) $el.attr('target', '_blank');
                        }
                    }.init(options);
                }
            }(jQuery, window, document, navigator));