(function($){
    $.win = $(window);
    $.body = $(document);
    $.blindHeight = function(){ return $.body.height() - $.win.height(); };
})(jQuery);