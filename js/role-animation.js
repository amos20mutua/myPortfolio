/**
 * Animated Role Display
 * Cycles through different roles with smooth animations
 */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class RoleAnimation {
    constructor() {
      this.roles = [
        'Web Developer',
        'Business Builder',
        'Network Enginee',
        'ICT Support',
        'Virtual Assistant'
      ];
      this.currentIndex = 0;
      this.roleElement = null;
      this.container = null;
      this.init();
    }

    init() {
      if (prefersReducedMotion) {
        // Show all roles without animation
        const container = document.querySelector('.roles-container');
        if (container) {
          container.innerHTML = this.roles.map(role => 
            `<span class="role-text">${role}</span>`
          ).join(' • ');
        }
        return;
      }

      this.container = document.querySelector('.roles-container');
      if (!this.container) return;

      this.roleElement = this.container.querySelector('.role-text.active');
      if (!this.roleElement) {
        // Create first role element if it doesn't exist
        this.roleElement = document.createElement('span');
        this.roleElement.className = 'role-text active';
        this.roleElement.textContent = this.roles[0];
        this.container.appendChild(this.roleElement);
      }

      // Start animation after a shorter delay
      setTimeout(() => {
        this.animate();
      }, 1500);
    }

    animate() {
      if (!this.roleElement || prefersReducedMotion) return;

      // Fade out current role
      this.roleElement.style.opacity = '0';
      this.roleElement.style.transform = 'translateY(-20px)';

      setTimeout(() => {
        // Update to next role
        this.currentIndex = (this.currentIndex + 1) % this.roles.length;
        this.roleElement.textContent = this.roles[this.currentIndex];
        this.roleElement.setAttribute('data-role', this.roles[this.currentIndex]);

        // Fade in new role
        this.roleElement.style.opacity = '1';
        this.roleElement.style.transform = 'translateY(0)';

        // Schedule next animation
        setTimeout(() => {
          this.animate();
        }, 3000); // Show each role for 3 seconds
      }, 500); // Transition duration
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new RoleAnimation();
    });
  } else {
    new RoleAnimation();
  }
})();
