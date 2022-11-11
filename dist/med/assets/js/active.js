(function ($) {
    'use strict';

    var browserWindow = $(window);

    // :: 1.0 Preloader Active Code
    browserWindow.on('load', function () {
        $('.preloader').fadeOut('slow', function () {
            $(this).remove();
        });
    });

    // :: 2.0 Nav Active Code
    if ($.fn.classyNav) {
        $('#creditNav').classyNav();
    }

    // :: 3.0 Sliders Active Code
    if ($.fn.owlCarousel) {
        var welcomeSlide = $('.hero-slideshow');

        welcomeSlide.owlCarousel({
            items: 1,
            loop: true,
            nav: true,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            dots: true,
            autoplay: true,
            autoplayTimeout: 10000,
            smartSpeed: 500
        });

        welcomeSlide.on('translate.owl.carousel', function () {
            var slideLayer = $("[data-animation]");
            slideLayer.each(function () {
                var anim_name = $(this).data('animation');
                $(this).removeClass('animated ' + anim_name).css('opacity', '0');
            });
        });

        welcomeSlide.on('translated.owl.carousel', function () {
            var slideLayer = welcomeSlide.find('.owl-item.active').find("[data-animation]");
            slideLayer.each(function () {
                var anim_name = $(this).data('animation');
                $(this).addClass('animated ' + anim_name).css('opacity', '1');
            });
        });

        $("[data-delay]").each(function () {
            var anim_del = $(this).data('delay');
            $(this).css('animation-delay', anim_del);
        });

        $("[data-duration]").each(function () {
            var anim_dur = $(this).data('duration');
            $(this).css('animation-duration', anim_dur);
        });
    }

    // :: 4.0 ScrollUp Active Code
    if ($.fn.scrollUp) {
        browserWindow.scrollUp({
            scrollSpeed: 1500,
            scrollText: '<i class="fa fa-angle-up"></i> Top'
        });
    }

    // :: 5.0 CounterUp Active Code
    if ($.fn.counterUp) {
        $('.counter').counterUp({
            delay: 10,
            time: 2000
        });
    }

    // :: 6.0 Progress Bar Active Code
    if ($.fn.circleProgress) {
        $('#circle').circleProgress({
            size: 90,
            emptyFill: "rgba(0, 0, 0, .0)",
            fill: '#fff',
            thickness: '3',
            reverse: true
        });
        $('#circle2').circleProgress({
            size: 90,
            emptyFill: "rgba(0, 0, 0, .0)",
            fill: '#fff',
            thickness: '3',
            reverse: true
        });
        $('#circle3').circleProgress({
            size: 90,
            emptyFill: "rgba(0, 0, 0, .0)",
            fill: '#fff',
            thickness: '3',
            reverse: true
        });
        $('#circle4').circleProgress({
            size: 90,
            emptyFill: "rgba(0, 0, 0, .0)",
            fill: '#ffbb38',
            thickness: '3',
            reverse: true
        });
        $('#circle5').circleProgress({
            size: 90,
            emptyFill: "rgba(0, 0, 0, .0)",
            fill: '#ffbb38',
            thickness: '3',
            reverse: true
        });
        $('#circle6').circleProgress({
            size: 90,
            emptyFill: "rgba(0, 0, 0, .0)",
            fill: '#ffbb38',
            thickness: '3',
            reverse: true
        });
        $('#circle7').circleProgress({
            size: 90,
            emptyFill: "rgba(0, 0, 0, .0)",
            fill: '#ffbb38',
            thickness: '3',
            reverse: true
        });
        $('#circle8').circleProgress({
            size: 90,
            emptyFill: "rgba(0, 0, 0, .0)",
            fill: '#ffbb38',
            thickness: '3',
            reverse: true
        });
        $('#circle9').circleProgress({
            size: 90,
            emptyFill: "rgba(0, 0, 0, .0)",
            fill: '#ffbb38',
            thickness: '3',
            reverse: true
        });
    }

    // :: 7.0 Tooltip Active Code
    if ($.fn.tooltip) {
        $('[data-toggle="tooltip"]').tooltip();
    }

    // :: 8.0 Prevent Default a Click
    $('a[href="#"]').on('click', function ($) {
        $.preventDefault();
    });

    // :: 9.0 Jarallax Active Code
    if ($.fn.jarallax) {
        $('.jarallax').jarallax({
            speed: 0.2
        });
    }

    // :: 10.0 Sticky Active Code
    if ($.fn.sticky) {
        $("#sticker").sticky({
            topSpacing: 0
        });
    }

    // :: 11.0 Wow Active Code
    if (browserWindow.width() > 767) {
        new WOW().init();
    }

})(jQuery);

// chat-box

// show and hide
$('#chat-box').click(function(){
    $('.chat-window').addClass('d-show');
    $('.chat-window').removeClass('d-none');
})


$(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('click', '#new_chat', function (e) {
    var size = $( ".chat-window:last-child" ).css("margin-left");
     size_total = parseInt(size) + 400;
    alert(size_total);
    var clone = $( "#chat_window_1" ).clone().appendTo( ".container" );
    clone.css("margin-left", size_total);
});
$(document).on('click', '.icon_close', function (e) {
    //$(this).parent().parent().parent().parent().remove();
    // $( "#chat_window_1" ).remove();
    $('.chat-window').addClass('d-none');
    $('.chat-window').removeClass('d-show');
});

// for carousel testimonials
$(document).ready(function() {
    $('.testimonial-carousel').carousel({
      interval: 3000
    })
});
