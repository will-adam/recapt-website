document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.site-header');
  const burger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  /* ----------------- Mobile Nav ----------------- */

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('nav-open');
    document.body.classList.toggle('menu-open'); // disables/enables scroll
  });


  function toggleNav(force) {
    if (!nav || !burger) return;
    const isOpen = typeof force === 'boolean' ? force : !nav.classList.contains('open');
    nav.classList.toggle('open', isOpen);
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    if (isOpen) nav.style.animation = 'slideDown 0.28s ease forwards';
    else nav.style.animation = '';
  }

  if (burger && nav) {
    burger.addEventListener('click', () => toggleNav());
    burger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); toggleNav();
      }
    });
    document.addEventListener('click', (e) => {
      if (window.matchMedia('(max-width: 640px)').matches &&
        nav.classList.contains('open') &&
        !nav.contains(e.target) && !burger.contains(e.target)) {
        toggleNav(false);
      }
    }, { passive: true });
  }

  document.querySelectorAll('#nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetID = this.getAttribute('href');
      const target = document.querySelector(targetID);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (nav && nav.classList.contains('open')) {
          setTimeout(() => toggleNav(false), 280);
        }
      }
    });
  });

  /* ----------------- Hide/Show Header on Scroll ----------------- */
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.pageYOffset;
    if (!header) return;

    if (current > lastScroll && current > 80) {
      header.classList.add('hide');
    } else {
      header.classList.remove('hide');
    }
    lastScroll = current;
  }, { passive: true });

  /* ----------------- Carousel ----------------- */
  const trackWrapper = document.querySelector('.track-wrapper');
  const track = document.getElementById('track');

  function calcCardWidth() {
    if (!track || !track.children.length) return 0;
    const firstRect = track.children[0].getBoundingClientRect();
    let gap = 16;
    if (track.children.length > 1) {
      const secondRect = track.children[1].getBoundingClientRect();
      gap = Math.round(secondRect.left - firstRect.right) || 16;
    }
    return Math.round(firstRect.width + gap);
  }

  function updateCarousel() {
    if (!track) return;
    const cardWidth = calcCardWidth();
    const containerWidth = track.parentElement.clientWidth || document.documentElement.clientWidth;
    const visible = Math.max(1, Math.floor(containerWidth / cardWidth));
    track.style.transition = 'transform .4s ease';
    track.style.transform = `translateX(0)`; // reset
  }

  function initCarousel() {
    if (!track) return;
    const imgs = track.querySelectorAll('img');
    if (!imgs.length) {
      updateCarousel(); return;
    }
    let loaded = 0;
    imgs.forEach(img => {
      if (img.complete) loaded++;
      else img.addEventListener('load', () => {
        loaded++; if (loaded === imgs.length) updateCarousel();
      }, { once: true });
    });
    if (loaded === imgs.length) updateCarousel();
  }

  if (track) {
    initCarousel();
    window.addEventListener('resize', debounce(() => updateCarousel(), 120));
  }
  let isDown = false;
  let startX;
  let scrollLeft;

  trackWrapper.addEventListener('mousedown', (e) => {
    isDown = true;
    trackWrapper.classList.add('dragging'); // optional for styling
    startX = e.pageX - trackWrapper.offsetLeft;
    scrollLeft = trackWrapper.scrollLeft;
  });

  trackWrapper.addEventListener('mouseleave', () => {
    isDown = false;
    trackWrapper.classList.remove('dragging');
  });

  trackWrapper.addEventListener('mouseup', () => {
    isDown = false;
    trackWrapper.classList.remove('dragging');
  });

  trackWrapper.addEventListener('mousemove', (e) => {
    if (!isDown) return; // only drag if mouse is pressed
    e.preventDefault();  // prevent text/image selection while dragging
    const x = e.pageX - trackWrapper.offsetLeft;
    const walk = (x - startX) * 1.5;
    trackWrapper.scrollLeft = scrollLeft - walk;
  });

  /* ----------------- Carousel Drag (Mouse + Touch) ----------------- */
  if (trackWrapper) {
    let isDown = false;
    let startX;
    let scrollLeft;

    trackWrapper.addEventListener('mousedown', (e) => {
      isDown = true;
      trackWrapper.classList.add('dragging');
      startX = e.pageX - trackWrapper.offsetLeft;
      scrollLeft = trackWrapper.scrollLeft;
      e.preventDefault();
    });

    trackWrapper.addEventListener('mouseleave', () => {
      isDown = false;
      trackWrapper.classList.remove('dragging');
    });

    trackWrapper.addEventListener('mouseup', () => {
      isDown = false;
      trackWrapper.classList.remove('dragging');
    });

    trackWrapper.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - trackWrapper.offsetLeft;
      const walk = (x - startX) * 1.5;
      trackWrapper.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    trackWrapper.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX - trackWrapper.offsetLeft;
      scrollLeft = trackWrapper.scrollLeft;
    });

    trackWrapper.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - trackWrapper.offsetLeft;
      const walk = (x - startX) * 1.5;
      trackWrapper.scrollLeft = scrollLeft - walk;
    });
  }

  /* ----------------- Footer ----------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------- Utility: Debounce ----------------- */
  function debounce(fn, wait = 100) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); };
  }
});
