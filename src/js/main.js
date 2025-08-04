$(document).ready(function () {
    $('a[href^="#"]').on('click', function (event) {
        event.preventDefault();

        const targetId = $(this).attr('href');
        const targetElement = $(targetId);

        if (targetElement.length) {
            if (window.innerWidth <= 425) {
                targetOffset = targetElement.offset().top - 94;
            } else {
                targetOffset = targetElement.offset().top - 20;
            }

            $('html, body').animate({
                scrollTop: targetOffset
            }, 600, function () {
                targetElement.attr('tabindex', '-1').focus();
            });
        }
    });

    //Slider
    const slider = document.querySelector(".partners__slider");
    const clone = slider.innerHTML;
    slider.innerHTML += clone;

    //FAQ
    const $accordionItems = $('.faq__list-item');
    const $allIcons = $('.faq__list-icon-wrapper .faq__list-icon');
    const $allTexts = $('[data-text]');

    $accordionItems.on('click keydown', function (e) {
        if (e.type === 'click' || (e.type === 'keydown' && (e.key === 'Enter' || e.keyCode === 13))) {
            const $currentItem = $(this);
            const $currentIcon = $currentItem.find('.faq__list-icon-wrapper .faq__list-icon');
            const $currentText = $currentItem.find('[data-text]');
            const isOpen = $currentIcon.hasClass('open');

            if (isOpen) {
                $currentIcon.removeClass('open');
                $currentText.stop(true, true).animate({opacity: 0}, 150, function () {
                    $(this).slideUp(200);
                });
            } else {
                $allIcons.removeClass('open');
                $allTexts.stop(true, true).animate({opacity: 0}, 150, function () {
                    $(this).slideUp(200);
                });

                $currentIcon.addClass('open');
                $currentText
                    .stop(true, true)
                    .css({display: 'none', opacity: 0})
                    .slideDown(200)
                    .animate({opacity: 1}, 400);
            }
        }
    });

    //Anim
    const aboutImg = document.querySelector('.about__img');
    aboutImg.classList.add('animate');

    //Menu
    $('.header__mobile-burger').click(function (e) {
        e.preventDefault();

        $('.header__mobile-menu').toggleClass('open');

        if (!$(this).hasClass('cross')) {
            $(this).addClass('cross');
            $('.header').addClass("open");
        } else {
            $(this).removeClass('cross');
            $('.header').removeClass("open");
        }
    });

    //Header
    $('.header__mobile-menu a').on('click', function () {
        $('.header__mobile-burger').trigger('click');
    });
});