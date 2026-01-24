/**
 * Premium Animation System for Portfolio
 * 
 * Features:
 * - Animated particle background
 * - Enhanced cursor with glow and trail
 * - Magnetic hover effects
 * - Scroll-triggered animations
 * - Parallax effects
 * - Accessibility support (prefers-reduced-motion)
 */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // ============================================
  // PARTICLE BACKGROUND SYSTEM
  // ============================================
  class ParticleBackground {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.animationId = null;
      this.mouse = { x: 0, y: 0 };
      
      this.init();
    }

    init() {
      this.resize();
      this.createParticles();
      this.bindEvents();
      if (!prefersReducedMotion) {
        // Use requestIdleCallback for non-critical animation start
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => this.animate(), { timeout: 1000 });
        } else {
          setTimeout(() => this.animate(), 100);
        }
      }
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    createParticles() {
      // Optimized particle count for performance
      const particleCount = Math.min(
        Math.floor((this.canvas.width * this.canvas.height) / 15000),
        200 // Cap at 200 particles for performance
      );
      this.particles = [];
      
      for (let i = 0; i < particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.6 + 0.4,
        });
      }
    }

    bindEvents() {
      // Throttle resize for performance
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.resize();
          this.createParticles();
        }, 250);
      }, { passive: true });

      // Throttle mousemove for performance
      let mouseUpdateTimeout;
      window.addEventListener('mousemove', (e) => {
        if (!mouseUpdateTimeout) {
          mouseUpdateTimeout = requestAnimationFrame(() => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            mouseUpdateTimeout = null;
          });
        }
      }, { passive: true });
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Update and draw particles
      this.particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary wrapping
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;

        // Mouse interaction (subtle attraction)
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.x += dx * force * 0.01;
          particle.y += dy * force * 0.01;
        }

        // Draw particle with glow effect
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        
        // Draw glow
        const gradient = this.ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 3
        );
        gradient.addColorStop(0, `rgba(162, 89, 255, ${particle.opacity})`);
        gradient.addColorStop(0.5, `rgba(162, 89, 255, ${particle.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(162, 89, 255, 0)`);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Draw core
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius * 0.6, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(162, 89, 255, ${particle.opacity * 1.2})`;
        this.ctx.fill();

        // Draw connections
        this.particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(otherParticle.x, otherParticle.y);
            this.ctx.strokeStyle = `rgba(162, 89, 255, ${0.2 * (1 - distance / 150)})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
          }
        });
      });

      this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }
  }

  // ============================================
  // ENHANCED CURSOR SYSTEM
  // ============================================
  class EnhancedCursor {
    constructor() {
      this.cursor = null;
      this.cursorTrail = [];
      this.magneticElements = [];
      this.isHovering = false;
      
      this.init();
    }

    init() {
      // Only disable on mobile (touch devices)
      const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
      
      if (prefersReducedMotion || isMobile) {
        return; // Disable on mobile and for reduced motion
      }

      this.createCursor();
      this.createTrail();
      this.bindEvents();
      this.findMagneticElements();
    }

    createCursor() {
      this.cursor = document.createElement('div');
      this.cursor.className = 'enhanced-cursor';
      document.body.appendChild(this.cursor);

      this.cursorInner = document.createElement('div');
      this.cursorInner.className = 'enhanced-cursor-inner';
      this.cursor.appendChild(this.cursorInner);
      
      // Initialize cursor position
      this.cursor.style.display = 'block';
      this.cursor.style.visibility = 'visible';
    }

    createTrail() {
      for (let i = 0; i < 5; i++) {
        const trailDot = document.createElement('div');
        trailDot.className = 'cursor-trail';
        trailDot.style.opacity = (5 - i) / 5 * 0.3;
        document.body.appendChild(trailDot);
        this.cursorTrail.push({ element: trailDot, x: 0, y: 0 });
      }
    }

    bindEvents() {
      let mouseX = 0, mouseY = 0;
      let cursorX = 0, cursorY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      // Initial cursor position
      if (this.cursor) {
        this.cursor.style.left = '50%';
        this.cursor.style.top = '50%';
        cursorX = window.innerWidth / 2;
        cursorY = window.innerHeight / 2;
      }

      // Fast cursor follow with optimized easing
      let rafId = null;
      const animate = () => {
        // Faster cursor response (increased from 0.15 to 0.35)
        cursorX += (mouseX - cursorX) * 0.35;
        cursorY += (mouseY - cursorY) * 0.35;

        if (this.cursor) {
          this.cursor.style.left = cursorX + 'px';
          this.cursor.style.top = cursorY + 'px';
          this.cursor.style.display = 'block';
          this.cursor.style.visibility = 'visible';
        }

        // Faster trail (increased from 0.3 to 0.5)
        this.cursorTrail.forEach((trail, i) => {
          const prevX = i === 0 ? cursorX : this.cursorTrail[i - 1].x;
          const prevY = i === 0 ? cursorY : this.cursorTrail[i - 1].y;
          
          trail.x += (prevX - trail.x) * 0.5;
          trail.y += (prevY - trail.y) * 0.5;
          
          trail.element.style.left = trail.x + 'px';
          trail.element.style.top = trail.y + 'px';
        });

        rafId = requestAnimationFrame(animate);
      };
      animate();
      
      // Store rafId for cleanup if needed
      this.rafId = rafId;

      // Hover detection
      const hoverElements = document.querySelectorAll('a, button, .project-card, .cv-btn, .cta-btn, .contact-btn');
      hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          this.isHovering = true;
          if (this.cursor) this.cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
          this.isHovering = false;
          if (this.cursor) this.cursor.classList.remove('cursor-hover');
        });
      });

      // Magnetic effect
      this.magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
          if (prefersReducedMotion) return;
          
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          const moveX = x * 0.15;
          const moveY = y * 0.15;
          
          el.style.transform = `translate(${moveX}px, ${moveY}px)`;
          el.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'translate(0, 0)';
          el.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });
      });
    }

    findMagneticElements() {
      this.magneticElements = document.querySelectorAll('.cv-btn, .cta-btn, .project-card');
    }
  }

  // ============================================
  // SCROLL ANIMATIONS
  // ============================================
  class ScrollAnimations {
    constructor() {
      this.observer = null;
      this.init();
    }

    init() {
      if (prefersReducedMotion) {
        // Still show content, just without animation
        document.querySelectorAll('.section, .project-card, .hero-inner, .contact-info-card').forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
        return;
      }

      // GSAP is already handling .section and .project-card animations
      // So we only add scroll animations to elements GSAP isn't animating
      const elementsToAnimate = document.querySelectorAll(
        '.contact-info-card, .page-hero, .cta-content, .experience-card'
      );

      if (elementsToAnimate.length === 0) return;

      // Intersection Observer for scroll animations
      const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            this.observer.unobserve(entry.target);
          }
        });
      }, options);

      // Observe elements that aren't handled by GSAP
      elementsToAnimate.forEach(el => {
        el.classList.add('scroll-animate');
        this.observer.observe(el);
      });
    }
  }

  // ============================================
  // PARALLAX EFFECTS
  // ============================================
  class ParallaxEffects {
    constructor() {
      if (prefersReducedMotion) return;
      this.init();
    }

    init() {
      const parallaxElements = document.querySelectorAll('.hero-photo-wrap, .hero-photo-glow');
      
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((el, index) => {
          const speed = 0.3 + (index * 0.1);
          const yPos = -(scrolled * speed);
          el.style.transform = `translateY(${yPos}px)`;
        });
      }, { passive: true });
    }
  }

  // ============================================
  // TEXT ANIMATIONS
  // ============================================
  function initTextAnimations() {
    if (prefersReducedMotion) return;

    // Animate hero text on load
    const heroName = document.querySelector('.hero-name');
    const heroIntro = document.querySelector('.hero-intro');
    const heroCta = document.querySelector('.hero-cta');
    
    if (heroName) {
      heroName.style.opacity = '0';
      heroName.style.transform = 'translateY(20px)';
      setTimeout(() => {
        heroName.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        heroName.style.opacity = '1';
        heroName.style.transform = 'translateY(0)';
      }, 100);
    }

    if (heroIntro) {
      heroIntro.style.opacity = '0';
      heroIntro.style.transform = 'translateY(20px)';
      setTimeout(() => {
        heroIntro.style.transition = 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s';
        heroIntro.style.opacity = '1';
        heroIntro.style.transform = 'translateY(0)';
      }, 100);
    }

    if (heroCta) {
      heroCta.style.opacity = '0';
      setTimeout(() => {
        heroCta.style.transition = 'opacity 0.8s ease-out 0.4s';
        heroCta.style.opacity = '1';
      }, 100);
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  function initAnimations() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAnimations);
      return;
    }

    // Initialize particle background
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-background';
    canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: none; opacity: 0.6;';
    document.body.appendChild(canvas);
    
    if (!prefersReducedMotion) {
      try {
        const particleBg = new ParticleBackground(canvas);
        // Store reference for potential cleanup
        window.particleBackground = particleBg;
      } catch (error) {
        console.warn('Particle background initialization failed:', error);
      }
    }

    // Initialize enhanced cursor
    new EnhancedCursor();

    // Initialize scroll animations
    new ScrollAnimations();

    // Initialize parallax
    new ParallaxEffects();

    // Add smooth hover effects to interactive elements
    enhanceHoverEffects();

    // Initialize text animations
    initTextAnimations();
  }

  // ============================================
  // HOVER EFFECT ENHANCEMENTS
  // ============================================
  function enhanceHoverEffects() {
    // Enhanced button hover
    document.querySelectorAll('.cv-btn, .cta-btn, .contact-btn').forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
      });
      btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Enhanced project card hover
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', function() {
        const img = this.querySelector('.project-img');
        if (img) {
          img.style.transform = 'scale(1.08)';
        }
      });
      card.addEventListener('mouseleave', function() {
        const img = this.querySelector('.project-img');
        if (img) {
          img.style.transform = 'scale(1)';
        }
      });
    });

    // Social icons hover
    document.querySelectorAll('.hero-socials a, .footer-social a').forEach(icon => {
      icon.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.1)';
      });
      icon.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  // Start initialization
  initAnimations();
})();
