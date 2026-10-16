/* ============================================
   HONATU – Contact Controller
   Contact form handling
   ============================================ */

import { apiFetch } from '../config.js';

function getPayload(form) {
  if (form.id === 'servicioForm') {
    return {
      serviceType: form.querySelector('#tipo_servicio')?.value || 'contacto',
      details: form.querySelector('#mensaje')?.value || '',
      guestName: form.querySelector('#nombre')?.value || '',
      guestEmail: form.querySelector('#email')?.value || '',
      guestPhone: form.querySelector('#telefono')?.value || ''
    };
  }

  return {
    serviceType: form.querySelector('#contact-interest')?.value || 'contacto',
    details: form.querySelector('#contact-msg')?.value || '',
    guestName: form.querySelector('#contact-name')?.value || '',
    guestEmail: form.querySelector('#contact-email')?.value || ''
  };
}

export function initContactForm() {
  const forms = [
    document.getElementById('contactForm'),
    document.getElementById('servicioForm')
  ].filter(Boolean);

  forms.forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalHTML = submitBtn ? submitBtn.innerHTML : 'Enviar';

      const setLoading = (loading) => {
        if (!submitBtn) return;
        submitBtn.disabled = loading;
        submitBtn.innerHTML = loading ? 'Enviando...' : originalHTML;
      };

      const setSuccess = () => {
        if (!submitBtn) return;
        submitBtn.innerHTML = '¡Solicitud Enviada con Éxito! <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        submitBtn.style.background = 'var(--color-sage)';
        submitBtn.style.borderColor = 'var(--color-sage)';
      };

      const resetButton = () => {
        if (!submitBtn) return;
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.background = '';
        submitBtn.style.borderColor = '';
        submitBtn.disabled = false;
      };

      setLoading(true);

      try {
        const response = await apiFetch('/api/service-requests', {
          method: 'POST',
          body: JSON.stringify(getPayload(form))
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.message || 'No se pudo enviar la solicitud.');
        }

        setSuccess();

        if (window.showToast) {
          window.showToast('¡Gracias! Hemos recibido tu solicitud. Nos pondremos en contacto contigo muy pronto.', 'success');
        }

        setTimeout(() => {
          resetButton();
          form.reset();
        }, 3500);
      } catch (error) {
        console.error('Error enviando solicitud:', error);
        if (window.showToast) {
          window.showToast(error.message || 'No se pudo enviar la solicitud. Intenta de nuevo más tarde.', 'error');
        }
        resetButton();
      }
    });
  });
}
