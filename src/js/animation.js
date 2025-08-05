let currentScale = 1;
let isAOSInitialized = false;

function scaleContentAndAdjustAOS() {
    const baseWidth = 1920;
    const currentWidth = window.innerWidth;
    const wrapper = document.querySelector('.wrapper');

    if (currentWidth > 425) {
        currentScale = currentWidth / baseWidth;

        wrapper.style.transform = `scale(${currentScale})`;
        wrapper.style.transformOrigin = 'top left';
        wrapper.style.width = '1920px';

        const wrapperHeight = wrapper.scrollHeight;
        const scaledHeight = wrapperHeight * currentScale;
        document.body.style.height = `${scaledHeight}px`;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'auto';

        initAOSWithCorrectOffset();

    } else {
        currentScale = 1;
        wrapper.style.transform = 'none';
        wrapper.style.width = 'auto';

        document.body.style.height = 'auto';
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        initSimpleMobileAOS();
    }
}

function initSimpleMobileAOS() {
    if (!isAOSInitialized) {
        AOS.init({
            offset: 50,
            once: true,
            duration: 600,
            easing: 'ease-out',
            startEvent: 'load',
            useClassNames: false,
            disableMutationObserver: false,
            debounceDelay: 50,
            throttleDelay: 99,
        });
        isAOSInitialized = true;
    } else {
        AOS.refresh();
    }

    setTimeout(() => {
        triggerVisibleAnimationsOnLoad();
    }, 200);
}

function initAOSWithCorrectOffset() {
    if (isAOSInitialized) {
        AOS.refresh();
    } else {
        AOS.init({
            offset: currentScale !== 1 ? 50 : 120,
            once: true,
            duration: 600,
            easing: 'ease-out',
            startEvent: 'load',
            useClassNames: false,
            disableMutationObserver: false,
            debounceDelay: 50,
            throttleDelay: 99,
        });
        isAOSInitialized = true;
    }

    if (currentScale !== 1) {
        setTimeout(() => {
            document.querySelectorAll('[data-aos]').forEach(el => {
                const rect = el.getBoundingClientRect();
                const elementTop = rect.top;
                const windowHeight = window.innerHeight;
                let newOffset = Math.floor((elementTop - windowHeight * 0.8) / currentScale);
                el.setAttribute('data-aos-offset', newOffset);
            });

            AOS.refresh();

            setTimeout(() => {
                triggerVisibleAnimationsOnLoad();
            }, 200);
        }, 100);
    } else {
        setTimeout(() => {
            triggerVisibleAnimationsOnLoad();
        }, 200);
    }
}

function triggerVisibleAnimationsOnLoad() {
    const windowHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 425;

    document.querySelectorAll('[data-aos]').forEach(el => {
        if (!el.classList.contains('aos-animate')) {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top;
            const elementBottom = rect.bottom;
            let isVisible = false;

            if (isMobile) {
                isVisible = elementTop < windowHeight * 0.9 && elementBottom > 0;
            } else {
                if (currentScale !== 1) {
                    isVisible = elementTop < windowHeight * 0.85 && elementBottom > 0;
                } else {
                    isVisible = elementTop < windowHeight * 0.85 && elementBottom > 0;
                }
            }

            if (isVisible) {
                el.classList.add('aos-animate');
            }
        }
    });
}

function triggerVisibleAnimations() {
    const windowHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 425;

    document.querySelectorAll('[data-aos]').forEach(el => {
        if (!el.classList.contains('aos-animate')) {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top;
            const elementBottom = rect.bottom;

            let isVisible = false;

            if (isMobile) {
                isVisible = elementTop < windowHeight * 0.9 && elementBottom > 0;
            } else {
                if (currentScale !== 1) {
                    const correctedTop = elementTop / currentScale;
                    const correctedBottom = elementBottom / currentScale;

                    if (correctedTop < windowHeight * 0.9 && correctedBottom > 0) {
                        isVisible = true;
                    }
                } else {
                    if (elementTop < windowHeight * 0.9 && elementBottom > 0) {
                        isVisible = true;
                    }
                }
            }

            if (isVisible) {
                el.classList.add('aos-animate');
            }
        }
    });
}

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 425;

    document.querySelectorAll('[data-aos]').forEach(el => {
        if (!el.classList.contains('aos-animate')) {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top + scrollTop;

            if (isMobile) {
                if (elementTop < scrollTop + windowHeight * 0.85) {
                    el.classList.add('aos-animate');
                }
            } else {
                if (currentScale !== 1) {
                    const correctedElementTop = elementTop / currentScale;
                    const correctedScrollTop = scrollTop / currentScale;
                    const correctedWindowHeight = windowHeight / currentScale;

                    if (correctedElementTop < correctedScrollTop + correctedWindowHeight * 0.85) {
                        el.classList.add('aos-animate');
                    }
                } else {
                    if (elementTop < scrollTop + windowHeight * 0.85) {
                        el.classList.add('aos-animate');
                    }
                }
            }
        }
    });
}

function handleAnchorNavigation() {
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (link && link.getAttribute('href') !== '#') {
            e.preventDefault();

            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                scrollToElement(targetElement);
            }
        }
    });

    window.addEventListener('hashchange', function() {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                setTimeout(() => {
                    scrollToElement(targetElement);
                }, 100);
            }
        }
    });

    window.addEventListener('load', function() {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                setTimeout(() => {
                    scrollToElement(targetElement);
                }, 500);
            }
        }
    });
}

function scrollToElement(element) {
    // Отримуємо поточні розміри вікна та сторінки
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScrollTop = documentHeight - windowHeight;
    const isMobile = windowWidth <= 425;
    const wrapper = document.querySelector('.wrapper');
    const baseWidth = 1920;
    let actualScale = windowWidth > 425 ? windowWidth / baseWidth : 1;

    if (Math.abs(currentScale - actualScale) > 0.001) {
        currentScale = actualScale;
    }

    let targetPosition;
    let headerOffset;
    let elementOffsetTop = 0;
    let currentElement = element;

    while (currentElement) {
        elementOffsetTop += currentElement.offsetTop;
        currentElement = currentElement.offsetParent;
    }

    if (isMobile) {
        headerOffset = windowHeight < 600 ? 40 : 60;
        targetPosition = elementOffsetTop - headerOffset;
    } else {
        if (currentScale !== 1) {
            const realElementTop = elementOffsetTop * currentScale;

            if (windowHeight < 600) {
                headerOffset = 60;
            } else if (windowHeight < 800) {
                headerOffset = 80;
            } else {
                headerOffset = 100;
            }

            targetPosition = realElementTop - headerOffset;

            if (windowHeight < 700) {
                targetPosition = realElementTop - (windowHeight * 0.15);
            }

        } else {
            if (windowHeight < 600) {
                headerOffset = 60;
            } else if (windowHeight < 800) {
                headerOffset = 80;
            } else {
                headerOffset = 100;
            }

            targetPosition = elementOffsetTop - headerOffset;
        }
    }

    targetPosition = Math.max(0, Math.min(targetPosition, maxScrollTop));

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const elementRect = element.getBoundingClientRect();
    const elementTopInViewport = elementRect.top;
    const elementBottomInViewport = elementRect.bottom;
    const isElementVisible = elementTopInViewport >= headerOffset &&
        elementTopInViewport <= windowHeight * 0.3 &&
        elementBottomInViewport > 0;

    if (!isElementVisible) {
        smoothScrollTo(targetPosition);
    }
}

function smoothScrollTo(targetPosition) {
    const startPosition = window.pageYOffset || document.documentElement.scrollTop;
    const distance = targetPosition - startPosition;

    if (Math.abs(distance) < 10) {
        window.scrollTo(0, targetPosition);
        return;
    }

    const duration = Math.min(Math.abs(distance) * 0.5, 800);
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Easing функція для плавності (ease-in-out cubic)
        const ease = progress < 0.5
            ? 4 * progress * progress * progress
            : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;

        const currentPosition = startPosition + (distance * ease);
        window.scrollTo(0, currentPosition);

        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

function reinitialize() {
    const currentScrollRatio = window.pageYOffset / Math.max(document.body.scrollHeight, 1);

    document.body.style.height = 'auto';
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    if (isAOSInitialized) {
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.classList.remove('aos-animate');
            el.removeAttribute('data-aos-offset');
        });
    }

    setTimeout(() => {
        scaleContentAndAdjustAOS();

        setTimeout(() => {
            const newScrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            const newScrollPosition = newScrollHeight * currentScrollRatio;
            window.scrollTo(0, newScrollPosition);

            const hash = window.location.hash;
            if (hash) {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    setTimeout(() => {
                        scrollToElement(targetElement);
                    }, 200);
                }
            }
        }, 150);
    }, 50);
}

function initializePageLoad() {
    scaleContentAndAdjustAOS();

    handleAnchorNavigation();

    const checkIntervals = [300, 600, 1000, 1500];
    checkIntervals.forEach(interval => {
        setTimeout(() => {
            triggerVisibleAnimationsOnLoad();
        }, interval);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializePageLoad();
});

window.addEventListener('load', () => {
    setTimeout(() => {
        initializePageLoad();
    }, 100);

    setTimeout(() => {
        triggerVisibleAnimationsOnLoad();
    }, 500);

    setTimeout(() => {
        triggerVisibleAnimationsOnLoad();
    }, 1000);
});

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        reinitialize();
    }, 150);
});

window.addEventListener('scroll', handleScroll, { passive: true });

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        setTimeout(() => {
            triggerVisibleAnimationsOnLoad();
        }, 100);
    }
});

document.addEventListener('click', () => {
    triggerVisibleAnimationsOnLoad();
}, { once: true });

setTimeout(() => {
    triggerVisibleAnimationsOnLoad();
}, 3000);