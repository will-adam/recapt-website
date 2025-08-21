// Mobile nav toggle
const burger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (burger) {
  burger.addEventListener('click', () => {
    const isOpen = nav.style.display === 'flex';
    nav.style.display = isOpen ? 'none' : 'flex';
    burger.setAttribute('aria-expanded', String(!isOpen));
  });
}

// Carousel
const track = document.getElementById('track');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
let index = 0;
function updateCarousel(){
  const cardWidth = 316; // 300 + 16 gap
  track.style.transform = `translateX(${-index * cardWidth}px)`;
}
if (next && prev && track){
  next.addEventListener('click', ()=>{ index = Math.min(index + 1, track.children.length - 1); updateCarousel(); });
  prev.addEventListener('click', ()=>{ index = Math.max(index - 1, 0); updateCarousel(); });
}

// Year
document.getElementById('year').textContent = new Date().getFullYear();
