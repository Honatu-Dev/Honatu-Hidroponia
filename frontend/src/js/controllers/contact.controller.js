/* ============================================
   HONATU – Contact Controller
   Contact form handling
   ============================================ */

export function initContactForm() {
  const forms = [
    document.getElementById('contactForm'),
    document.getElementById('servicioForm')
  ].filter(Boolean);

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : 'Enviar';

      if (submitBtn) {
        submitBtn.innerHTML = '¡Solicitud Enviada con Éxito! <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        submitBtn.style.background = 'var(--color-sage)';
        submitBtn.style.borderColor = 'var(--color-sage)';
        submitBtn.disabled = true;
      }

      if (window.showToast) {
        window.showToast('¡Gracias! Hemos recibido tu solicitud. Nos pondremos en contacto contigo muy pronto.', 'success');
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
          submitBtn.disabled = false;
        }
        form.reset();
      }, 3500);
    });
  });
}

