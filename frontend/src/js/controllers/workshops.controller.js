import { AUTH_VINE_DECORATION, getAuthUser } from './auth.controller.js';
import { apiFetch } from '../config.js';
import { escapeHtml, escapeAttr } from '../utils/dom.js';

export function initWorkshops() {
  const overlay = document.getElementById('workshopOverlay');
  const modal = document.getElementById('workshopModal');
  const modalCard = document.getElementById('workshopModalCard');
  const closeBtn = document.getElementById('workshopClose');
  const selectedName = document.getElementById('workshopSelectedName');
  const form = document.getElementById('workshopForm');

  if (!form) return; // We are not on the workshops page

  // Inject calibrated modal vines if not already present
  if (modalCard && !modalCard.querySelector('.form-vine-wrapper')) {
    modalCard.insertAdjacentHTML('afterbegin', AUTH_VINE_DECORATION);
  }

  // Current selected workshop ID
  let currentWorkshopId = null;
  let workshopsData = [];
  let pastGridEmptyTimeout = null;

  // 1. Fetch workshops to get their IDs
  apiFetch('/api/workshops')
    .then(res => res.json())
    .then(data => {
      workshopsData = data;
      const grid = document.getElementById('workshopGrid');
      const pastGrid = document.getElementById('pastWorkshopGrid');
      
      const now = new Date();
      const futureWorkshops = workshopsData.filter(ws => new Date(ws.scheduledDate) >= now);
      const pastWorkshops = workshopsData.filter(ws => new Date(ws.scheduledDate) < now);

      if (grid) {
        if (futureWorkshops.length > 0) {
          grid.innerHTML = ''; // Clear placeholder
          futureWorkshops.forEach(ws => {
            const date = new Date(ws.scheduledDate);
            const dateStr = date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
            const timeStr = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
            const modality = escapeHtml(ws.modality || 'Presencial');
            const badgeClass = modality === 'Online' ? 'workshop-badge--online' : '';
            const agendaHtml = ws.agenda && ws.agenda.length
              ? ws.agenda.map(item => `<li>${escapeHtml(item)}</li>`).join('')
              : '';
            const title = escapeHtml(ws.title);
            const description = escapeHtml(ws.description || '');
            const imageUrl = escapeAttr(ws.imageUrl || 'https://res.cloudinary.com/usn9paiw/image/upload/f_auto,q_auto,c_fill,w_800,h_600/Huerto');

            // Text for the button depending on the price
            const isFree = !ws.price || Number(ws.price) === 0;
            const priceText = escapeHtml(isFree ? 'Registrarse' : `Reservar Lugar - $${ws.price}`);

            const article = document.createElement('article');
            article.className = 'workshop-card';
            article.innerHTML = `
              <div class="workshop-img">
                <img src="${imageUrl}" alt="${title}" loading="lazy">
                <span class="workshop-badge ${badgeClass}">${modality}</span>
              </div>
              <div class="workshop-body">
                <div class="workshop-date">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  ${escapeHtml(dateStr.charAt(0).toUpperCase() + dateStr.slice(1))} · ${escapeHtml(timeStr)}
                </div>
                <h3 class="workshop-title">${title}</h3>
                <p class="workshop-desc">${description}</p>
                <ul class="workshop-agenda">${agendaHtml}</ul>
                <button class="btn btn-terracotta btn-register-workshop" data-id="${escapeAttr(ws.id)}" data-workshop="${title}" style="width: 100%; justify-content: center;">
                  ${priceText}
                </button>
              </div>
            `;
            grid.appendChild(article);
          });
        } else {
          grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; padding: 60px 20px;">
              <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <h3>Próximamente</h3>
              <p>No hay talleres programados en este momento. Vuelve pronto.</p>
            </div>
          `;
        }
      }

      if (pastGrid) {
        if (pastWorkshops.length > 0) {
          pastGrid.innerHTML = '';
          pastWorkshops.forEach(ws => {
            const date = new Date(ws.scheduledDate);
            const dateStr = date.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
            const title = escapeHtml(ws.title);
            const modality = escapeHtml(ws.modality || 'Presencial');
            const description = escapeHtml(ws.description || '');
            const imageUrl = escapeAttr(ws.imageUrl || 'https://res.cloudinary.com/usn9paiw/image/upload/f_auto,q_auto,c_fill,w_800,h_600/Huerto');

            const div = document.createElement('div');
            div.className = 'past-card';
            div.innerHTML = `
              <img src="${imageUrl}" alt="${title}" loading="lazy">
              <div class="past-card-body">
                <div class="past-card-title">${title}</div>
                <div class="past-card-meta">${escapeHtml(dateStr.charAt(0).toUpperCase() + dateStr.slice(1))} · ${modality}</div>
                <p style="font-size: 0.88rem; color: var(--color-gray-600); line-height: 1.5;">${description}</p>
              </div>
            `;
            pastGrid.appendChild(div);
          });
        } else {
          pastGrid.innerHTML = `
            <div class="empty-state">
              <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M8 14h.01"></path>
                <path d="M12 14h.01"></path>
                <path d="M16 14h.01"></path>
                <path d="M8 18h.01"></path>
                <path d="M12 18h.01"></path>
                <path d="M16 18h.01"></path>
              </svg>
              <h3>Sin registros históricos</h3>
              <p>Aún no tenemos galerías de talleres pasados. ¡Inscríbete a los próximos y sé parte de la historia!</p>
            </div>
          `;
        }
      }

      // Cancel the fallback empty-state timeout since data already loaded
      if (pastGridEmptyTimeout) clearTimeout(pastGridEmptyTimeout);

      const guestFields = document.getElementById('workshopGuestFields');
      const loggedInMessage = document.getElementById('workshopLoggedInMessage');
      const loggedInDetails = document.getElementById('workshopLoggedInDetails');

      const updateWorkshopModalForAuth = () => {
        const user = getAuthUser();
        const token = localStorage.getItem('honatu_token');
        const isLoggedIn = Boolean(token && user?.email);

        if (isLoggedIn) {
          if (guestFields) guestFields.style.display = 'none';
          if (loggedInMessage) {
            loggedInMessage.style.display = 'block';
            const displayName = user.fullName || user.name || user.email.split('@')[0];
            loggedInDetails.textContent = `${displayName} (${user.email})`;
          }
        } else {
          if (guestFields) guestFields.style.display = 'block';
          if (loggedInMessage) loggedInMessage.style.display = 'none';
        }
      };

      // Bind events to the newly created buttons
      document.querySelectorAll('.btn-register-workshop').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const title = btn.getAttribute('data-workshop');
          const wsTitle = title || 'Taller Honatu';
          currentWorkshopId = btn.getAttribute('data-id') || e.target.getAttribute('data-id');

          if(selectedName) selectedName.textContent = wsTitle;
          updateWorkshopModalForAuth();
          if(overlay) overlay.classList.add('active');
          if(modal) {
            modal.classList.remove('vines-grown');
            modal.classList.remove('blooming-vines');
            void modal.offsetWidth; // Reflow to restart animation
            modal.classList.add('active');
            modal.classList.add('vines-grown');
            modal.setAttribute('aria-hidden', 'false');
          }
        });
      });
    })
    .catch(err => {
      console.error('Error fetching workshops:', err);
      if (pastGridEmptyTimeout) clearTimeout(pastGridEmptyTimeout);
      if (pastGrid) {
        pastGrid.innerHTML = `
          <div class="empty-state">
            <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
              <path d="M8 14h.01"></path>
              <path d="M12 14h.01"></path>
              <path d="M16 14h.01"></path>
              <path d="M8 18h.01"></path>
              <path d="M12 18h.01"></path>
              <path d="M16 18h.01"></path>
            </svg>
            <h3>Sin registros históricos</h3>
            <p>No se pudieron cargar los talleres pasados. Intenta recargar la página.</p>
          </div>
        `;
      }
    });

  const pastGrid = document.getElementById('pastWorkshopGrid');
  if (pastGrid) {
    pastGrid.innerHTML = `
      <article class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton-text"></div>
          <div class="skeleton-text medium"></div>
        </div>
      </article>
      <article class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton-text"></div>
          <div class="skeleton-text medium"></div>
        </div>
      </article>
      <article class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton-text"></div>
          <div class="skeleton-text medium"></div>
        </div>
      </article>
    `;

    pastGridEmptyTimeout = setTimeout(() => {
      pastGrid.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <path d="M8 14h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M16 14h.01"></path>
            <path d="M8 18h.01"></path>
            <path d="M12 18h.01"></path>
            <path d="M16 18h.01"></path>
          </svg>
          <h3>Sin registros históricos</h3>
          <p>Aún no tenemos galerías de talleres pasados. ¡Inscríbete a los próximos y sé parte de la historia!</p>
        </div>
      `;
    }, 1200);
  }

  const closeModal = () => {
    overlay.classList.remove('active');
    modal.classList.remove('active');
    modal.classList.remove('vines-grown');
    modal.setAttribute('aria-hidden', 'true');
    currentWorkshopId = null;
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  // 2. Handle form submission to the API
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentWorkshopId) {
      window.showToast('Error: No se pudo identificar el taller.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Procesando...';
    }

    const token = localStorage.getItem('honatu_token');
    const user = getAuthUser();
    const isLoggedIn = Boolean(token && user?.email);

    const payload = { workshopId: currentWorkshopId };
    if (!isLoggedIn) {
      payload.guestName = document.getElementById('wsName').value.trim();
      payload.guestEmail = document.getElementById('wsEmail').value.trim();
      payload.guestPhone = document.getElementById('wsPhone')?.value.trim() || '';
    }

    try {
      const response = await apiFetch('/api/workshops/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        closeModal();
        window.showToast('¡Te has registrado con éxito! Te contactaremos pronto.');
        form.reset();
      } else {
        window.showToast(data.message || 'Error al registrar', 'error');
      }

    } catch (error) {
      console.error('Error en inscripción:', error);
      window.showToast('Error de red al intentar registrarse.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
}
