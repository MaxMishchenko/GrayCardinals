let currentScale = 1;
let isAOSInitialized = false;
let animatedElements = new Set();
let isScrolling = false;
let scrollTimeout;
let resizeObserver;

function scaleContentAndAdjustAOS() {
    const baseWidth = 1920;
    const currentWidth = window.innerWidth;
    const wrapper = document.querySelector('.wrapper');

    if (resizeObserver) resizeObserver.disconnect();

    if (currentWidth > 425) {
        currentScale = currentWidth / baseWidth;
        wrapper.style.transform = `scale(${currentScale})`;
        wrapper.style.transformOrigin = 'top left';
        wrapper.style.width = '1920px';

        updateBodyHeight(wrapper);

        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'auto';

        // Observe wrapper height changes
        observeWrapperResize(wrapper);

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

function updateBodyHeight(wrapper) {
    const wrapperHeight = wrapper.scrollHeight;
    const scaledHeight = wrapperHeight * currentScale;
    document.body.style.height = `${scaledHeight}px`;
}

function observeWrapperResize(wrapper) {
    resizeObserver = new ResizeObserver(() => {
        updateBodyHeight(wrapper);
        AOS.refresh();
    });
    resizeObserver.observe(wrapper);
}

function getElementId(el) {
    if (el.id) return el.id;
    if (el.dataset.aosId) return el.dataset.aosId;

    const elements = Array.from(document.querySelectorAll('[data-aos]'));
    const index = elements.indexOf(el);
    const uniqueId = `aos-element-${index}`;
    el.dataset.aosId = uniqueId;
    return uniqueId;
}

function initSimpleMobileAOS() {
    AOS.init({
        offset: 50,
        once: true,
        duration: 600,
        easing: 'ease-out',
        startEvent: 'load',
        useClassNames: false,
        disableMutationObserver: true,
        debounceDelay: 50,
        throttleDelay: 99
    });
    isAOSInitialized = true;
    setTimeout(() => checkVisibleElementsOnce(), 300);
}

function initAOSWithCorrectOffset() {
    if (!isAOSInitialized) {
        AOS.init({
            offset: currentScale !== 1 ? 50 : 120,
            once: true,
            duration: 600,
            easing: 'ease-out',
            startEvent: 'load',
            useClassNames: false,
            disableMutationObserver: true,
            debounceDelay: 50,
            throttleDelay: 99
        });
        isAOSInitialized = true;
    }
    setTimeout(() => {
        adjustOffsetsForScale();
        checkVisibleElementsOnce();
    }, 200);
}

function adjustOffsetsForScale() {
    document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => {
        const rect = el.getBoundingClientRect();
        const newOffset = Math.floor((rect.top - window.innerHeight * 0.8) / currentScale);
        el.setAttribute('data-aos-offset', newOffset);
    });
    AOS.refresh();
}

function checkVisibleElementsOnce() {
    const winH = window.innerHeight;
    const isMobile = window.innerWidth <= 425;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => {
        const rect = el.getBoundingClientRect();
        const elId = getElementId(el);
        if (animatedElements.has(elId)) return;

        const isVisible = isMobile
            ? rect.top < winH * 0.9 && rect.bottom > 0
            : rect.top < winH * 0.85 && rect.bottom > 0;

        if (isVisible) {
            el.classList.add('aos-animate');
            animatedElements.add(elId);
        }
    });
}

function handleScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        checkVisibleElementsOnce();
    }, 60);
}

function scrollToElement(element) {
    const winH = window.innerHeight;
    const isMobile = window.innerWidth <= 425;
    if (isMobile) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }

    const baseWidth = 1920;
    currentScale = window.innerWidth / baseWidth;
    const rect = element.getBoundingClientRect();
    let offset = window.pageYOffset || document.documentElement.scrollTop;

    let top = 0, el = element;
    while (el) {
        top += el.offsetTop;
        el = el.offsetParent;
    }

    const headerOffset = winH < 600 ? 60 : winH < 800 ? 80 : 100;
    let targetY = currentScale !== 1 ? top * currentScale - headerOffset : top - headerOffset;

    const distance = targetY - offset;
    if (Math.abs(distance) < 10) {
        window.scrollTo(0, targetY);
        return;
    }

    const duration = Math.min(Math.abs(distance) * 0.5, 800);
    let start = null;

    function animateScroll(time) {
        if (start === null) start = time;
        const progress = Math.min((time - start) / duration, 1);
        const ease = progress < 0.5 ? 4 * progress ** 3 : (progress - 1) * (2 * progress - 2) ** 2 + 1;
        const pos = offset + distance * ease;
        window.scrollTo(0, pos);
        if (progress < 1) requestAnimationFrame(animateScroll);
    }

    requestAnimationFrame(animateScroll);
}

function handleAnchorNavigation() {
    document.addEventListener('click', e => {
        const link = e.target.closest('a[href^="#"]');
        if (!link || link.getAttribute('href') === '#') return;
        e.preventDefault();
        const id = link.getAttribute('href').substring(1);
        const el = document.getElementById(id);
        if (el) scrollToElement(el);
    });

    ['load', 'hashchange'].forEach(evt => {
        window.addEventListener(evt, () => {
            const id = location.hash.substring(1);
            const el = document.getElementById(id);
            if (el) setTimeout(() => scrollToElement(el), evt === 'load' ? 500 : 100);
        });
    });
}

function reinitialize() {
    const scrollRatio = window.pageYOffset / Math.max(document.body.scrollHeight, 1);

    animatedElements.clear();
    document.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.remove('aos-animate');
        el.removeAttribute('data-aos-offset');
        delete el.dataset.aosId;
    });

    AOS.refreshHard();

    setTimeout(() => {
        scaleContentAndAdjustAOS();
        setTimeout(() => {
            window.scrollTo(0, scrollRatio * Math.max(document.body.scrollHeight, 1));
            const el = document.querySelector(location.hash);
            if (el) setTimeout(() => scrollToElement(el), 200);
        }, 150);
    }, 50);
}

function initializePage() {
    scaleContentAndAdjustAOS();
    handleAnchorNavigation();
    setTimeout(() => checkVisibleElementsOnce(), 500);
}

document.addEventListener('DOMContentLoaded', initializePage);
window.addEventListener('load', () => setTimeout(checkVisibleElementsOnce, 300));
window.addEventListener('resize', () => clearTimeout(scrollTimeout) || (scrollTimeout = setTimeout(reinitialize, 200)));
window.addEventListener('scroll', handleScroll, { passive: true });
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) setTimeout(() => !isMobile() && checkVisibleElementsOnce(), 200);
});

function isMobile() {
    return window.innerWidth <= 425;
}

setTimeout(() => {
    if (!isMobile() && document.querySelectorAll('[data-aos]:not(.aos-animate)').length > 0) {
        checkVisibleElementsOnce();
    }
}, 2000);