// GSAP, Lenis, Barba are loaded via CDN in HTML
// Custom Cursor
const cursor = document.createElement('div');
cursor.className = 'cursor';
document.body.appendChild(cursor);
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});
// Cursor hover effect
[...document.querySelectorAll('a, button, .project-card')].forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// Hero Animations
window.addEventListener('DOMContentLoaded', () => {
  gsap.to('.hero-title', { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' });
  gsap.to('.hero-subtitle', { opacity: 1, y: 0, duration: 1.1, delay: 0.3, ease: 'power3.out' });

  // Lenis smooth scroll
  window.lenis = new Lenis({
    duration: 1.2,
    smooth: true,
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothTouch: false,
  });
  function raf(time) {
    window.lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // GSAP Scroll Animations
  gsap.utils.toArray('.section').forEach((section, i) => {
    gsap.from(section, {
      opacity: 0,
      y: 60,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
      }
    });
  });
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 0.8,
      delay: i * 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
      }
    });
  });

  // Barba.js Page Transitions
  if (window.barba) {
    barba.init({
      transitions: [{
        name: 'fade',
        async leave(data) {
          const done = this.async();
          document.querySelector('.page-transition').classList.add('active');
          await gsap.to('.page-transition', { opacity: 1, duration: 0.5 });
          done();
        },
        async enter(data) {
          await gsap.to('.page-transition', { opacity: 0, duration: 0.5 });
          document.querySelector('.page-transition').classList.remove('active');
        },
      }],
    });
  }

  // Hero media scroll animation (shrink to top right)
  if (document.querySelector('.hero-media')) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero-media', {
      scrollTrigger: {
        trigger: '.leo-hero',
        start: 'top top',
        end: '+=60%',
        scrub: true,
        pin: false,
      },
      scale: 0.22,
      x: '60vw',
      y: '-38vh',
      transformOrigin: 'top right',
      ease: 'power2.inOut',
    });
    gsap.to('.hero-photo', {
      scrollTrigger: {
        trigger: '.leo-hero',
        start: 'top top',
        end: '+=60%',
        scrub: true,
        pin: false,
      },
      width: '48px',
      height: '48px',
      left: 'calc(100vw - 70px)',
      bottom: 'calc(100vh - 70px)',
      boxShadow: '0 2px 8px rgba(30,126,143,0.18)',
      ease: 'power2.inOut',
    });
  }
}); 