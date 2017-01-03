"use strict";

(function ($) {
    $.win = $(window);
    $.body = $(document);
    $.blindHeight = function () {
        return $.body.height() - $.win.height();
    };
    $.fn.lazy = function(opt){
        var o = $.extend({
            load:function(e){},
            error:function(e){},
            srcName:"lazy-src"
        },opt);
        return this.each(function(idx,lazyItem){
            var img = $(lazyItem);
            img.lazySrc = img.attr(o.srcName);
            img.on("load",function(e){
                o.load(e);
            }).on("error",function(e){
                o.error(e);
            });
            img.attr("src",img.lazySrc);
        });
    };
    $.winLoad = function(callback) {
        window.addEventListener("load", callback);
    };
})(jQuery);