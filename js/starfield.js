/**
 * Starfield Animation System
 * Creates many small stars moving across sections with constant motion
 * Performance optimized for thousands of stars
 */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class Starfield {
    constructor(container) {
      this.container = container;
      this.canvas = null;
      this.ctx = null;
      this.stars = [];
      this.animationId = null;
      this.speed = 0.5;
      
      this.init();
    }

    init() {
      if (prefersReducedMotion) return;

      this.createCanvas();
      this.createStars();
      this.bindEvents();
      this.animate();
    }

    createCanvas() {
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'starfield-canvas';
      this.canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        opacity: 0.8;
      `;
      this.container.style.position = 'relative';
      this.container.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.resize();
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.container.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      this.createStars(); // Recreate stars on resize
    }

    createStars() {
      if (!this.canvas) return;
      // Optimized star count for performance
      const starCount = Math.min(
        Math.floor((this.canvas.width * this.canvas.height) / 1000),
        500 // Cap at 500 stars per section for performance
      );
      this.stars = [];

      for (let i = 0; i < starCount; i++) {
        this.stars.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * 1.2 + 0.5,
          speed: Math.random() * 1.5 + 0.5, // Increased speed for faster movement
          opacity: Math.random() * 0.8 + 0.2,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
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
        }, 250);
      }, { passive: true });
    }

    animate() {
      if (!this.ctx || !this.canvas) return;

      // Use clearRect for better performance
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Batch operations for better performance
      this.ctx.save();
      
      this.stars.forEach(star => {
        // Move star (faster movement)
        star.x -= star.speed;
        star.twinkle += star.twinkleSpeed;

        // Reset if off screen (wrap around)
        if (star.x < -star.radius) {
          star.x = this.canvas.width + star.radius;
          star.y = Math.random() * this.canvas.height;
        }

        // Twinkle effect
        const twinkleOpacity = star.opacity + Math.sin(star.twinkle) * 0.3;
        const finalOpacity = Math.max(0.1, Math.min(1, twinkleOpacity));

        // Draw star with glow (optimized)
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(162, 89, 255, ${finalOpacity})`;
        this.ctx.fill();

        // Draw glow (only for larger stars for performance)
        if (star.radius > 1) {
          const gradient = this.ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.radius * 3
          );
          gradient.addColorStop(0, `rgba(162, 89, 255, ${finalOpacity * 0.5})`);
          gradient.addColorStop(1, 'rgba(162, 89, 255, 0)');
          this.ctx.fillStyle = gradient;
          this.ctx.beginPath();
          this.ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
          this.ctx.fill();
        }
      });
      
      this.ctx.restore();
      this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      if (this.canvas && this.canvas.parentNode) {
        this.canvas.parentNode.removeChild(this.canvas);
      }
    }
  }

  // Initialize starfields on all sections with performance optimization
  function initStarfields() {
    if (prefersReducedMotion) return;

    const sections = document.querySelectorAll('.hero, .section, .contact-cta, .page-hero, .experience-section');
    
    // Use requestIdleCallback if available for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        sections.forEach(section => {
          new Starfield(section);
        });
      }, { timeout: 2000 });
    } else {
      // Fallback: use setTimeout for non-blocking initialization
      setTimeout(() => {
        sections.forEach(section => {
          new Starfield(section);
        });
      }, 0);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStarfields);
  } else {
    initStarfields();
  }

  // Reinitialize on page navigation (for SPA-like behavior)
  if (document.readyState === 'complete') {
    initStarfields();
  } else {
    window.addEventListener('load', initStarfields);
  }
})();
