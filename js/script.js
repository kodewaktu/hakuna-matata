/* ==========================================================================
   HAKUNA MATATA — script.js
   Vanilla JS only: mobile navigation + testimonial slider
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initTestimonialSlider();
});

/* ---------------- Mobile navigation ---------------- */
function initMobileNav() {
  var toggle = document.querySelector('.hamburger');
  var nav = document.querySelector('.mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ---------------- Testimonial slider ---------------- */
function initTestimonialSlider() {
  var slider = document.querySelector('.testimonial-slider');
  if (!slider) return;

  var track = slider.querySelector('.testimonial-track');
  var cards = Array.prototype.slice.call(slider.querySelectorAll('.testimonial-card'));
  var prevBtn = slider.querySelector('.slider-arrow.prev');
  var nextBtn = slider.querySelector('.slider-arrow.next');
  var dotsWrap = slider.querySelector('.slider-dots');
  if (!track || cards.length === 0) return;

  var index = 0;

  function perView() {
    var w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 1023) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, cards.length - perView());
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    var total = maxIndex() + 1;
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Ke testimoni ' + (i + 1));
      if (i === index) dot.classList.add('is-active');
      (function (i) {
        dot.addEventListener('click', function () { goTo(i); });
      })(i);
      dotsWrap.appendChild(dot);
    }
  }

  function update() {
    var cardWidth = cards[0].getBoundingClientRect().width;
    var gap = parseFloat(getComputedStyle(track).gap) || 24;
    var offset = index * (cardWidth + gap);
    track.style.transform = 'translateX(-' + offset + 'px)';

    if (dotsWrap) {
      Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index >= maxIndex();
  }

  function goTo(i) {
    index = Math.min(Math.max(i, 0), maxIndex());
    update();
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1); });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      index = Math.min(index, maxIndex());
      buildDots();
      update();
    }, 150);
  });

  buildDots();
  update();

  /* basic touch swipe support */
  var startX = null;
  track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) goTo(index + 1); else goTo(index - 1);
    }
    startX = null;
  });
}
