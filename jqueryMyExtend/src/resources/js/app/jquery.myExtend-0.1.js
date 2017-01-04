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
            srcName:"lazy-src",
            errorName:"error-src"
        },opt);
        return this.each(function(idx,lazyItem){
            var img = $(lazyItem);
            img.lazySrc = img.attr(o.srcName);
            console.log(img.errorSrc);
            img.errorSrc = img.attr(o.errorName);
            img.one("load",function(e){
                o.load(e);
            }).one("error",function(e){
                o.error(e);
                if(img.errorSrc){
                    img.attr("src",img.errorSrc);
                };
            });
            img.attr("src",img.lazySrc);
        });
    };
    $.windowLoad = function(callback) {
        window.addEventListener("load", callback);
    };
})(jQuery);