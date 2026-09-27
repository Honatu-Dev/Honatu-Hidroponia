/* ============================================
   HONATU – Scroll Controller
   Smooth scroll + active nav link tracking
   ============================================ */

export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

export function initActiveNavTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const observerNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => observerNav.observe(section));
}

/**
 * Ensures smooth and accurate scrolling when navigating to a hash URL (e.g. index.html#servicios)
 * from another page, accounting for asynchronous asset loading and layout shifts.
 */
export function handleInitialHashScroll() {
  if (typeof window === 'undefined' || !window.location.hash) return;

  const scrollToHash = () => {
    try {
      const hash = window.location.hash;
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (_) {}
  };

  // Run quickly for immediate response, after loader hides, and on window load
  setTimeout(scrollToHash, 80);
  setTimeout(scrollToHash, 350);
  window.addEventListener('load', () => {
    setTimeout(scrollToHash, 100);
  }, { once: true });

  window.addEventListener('hashchange', () => {
    scrollToHash();
  });
}
