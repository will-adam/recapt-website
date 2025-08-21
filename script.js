// Modern Mobile Nav Toggle
const burger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', nav.classList.contains('nav-open'));
  });
}

// Smooth scroll for navbar anchor links
document.querySelectorAll('.nav-item a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const targetID = this.getAttribute('href');
    const target = document.querySelector(targetID);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      // If mobile nav is open, close it after selection
      if (nav && nav.classList.contains('nav-open')) {
        nav.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Carousel
const track = document.getElementById('track');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
let index = 0;
function updateCarousel() {
  const cardWidth = 316; // 300 + 16 gap
  track.style.transform = `translateX(${-index * cardWidth}px)`;
}
if (next && prev && track) {
  next.addEventListener('click', () => {
    index = Math.min(index + 1, track.children.length - 1);
    updateCarousel();
  });
  prev.addEventListener('click', () => {
    index = Math.max(index - 1, 0);
    updateCarousel();
  });
}

// Footer Year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
