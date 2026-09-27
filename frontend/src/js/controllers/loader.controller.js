/* ============================================
   HONATU – Loader & Page Transition Controller
   ============================================ */

import logoImg from '../../assets/logo/Logo.png';

export function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Ensure loader logo uses bundled asset
  const loaderImg = loader.querySelector('.loader-logo');
  if (loaderImg) {
    loaderImg.src = logoImg;
  }

  // Smoothly hide loader after page load
  const hideLoader = () => {
    if (!loader.classList.contains('loader--hide')) {
      loader.classList.add('loader--hide');
      loader.setAttribute('aria-hidden', 'true');
    }
  };

  // Immediate and timed safety nets to ensure loader ALWAYS hides
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 200);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 250));
    // Fallback timer so it never gets stuck regardless of asset loading state
    setTimeout(hideLoader, 400);
  }

  // Handle back/forward cache navigation
  window.addEventListener('pageshow', () => {
    hideLoader();
  });
}
