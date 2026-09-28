import { AUTH_VINE_DECORATION } from './auth.controller.js';

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

  // 1. Fetch workshops to get their IDs
  fetch('http://localhost:5000/api/workshops')
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
            const badgeClass = ws.modality === 'Online' ? 'workshop-badge--online' : '';
            const agendaHtml = ws.agenda && ws.agenda.length ? ws.agenda.map(item => `<li>${item}</li>`).join('') : '';
            
            // Text for the button depending on the price
            const isFree = !ws.price || Number(ws.price) === 0;
            const buttonText = isFree ? 'Registrarse' : `Reservar Lugar - $${ws.price}`;

            const article = document.createElement('article');
            article.className = 'workshop-card';
            article.innerHTML = `
              <div class="workshop-img">
                <img src="${ws.imageUrl || '../../assets/images/placeholder.jpg'}" alt="${ws.title}" loading="lazy">
                <span class="workshop-badge ${badgeClass}">${ws.modality}</span>
              </div>
              <div class="workshop-body">
                <div class="workshop-date">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  ${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)} · ${timeStr}
                </div>
                <h3 class="workshop-title">${ws.title}</h3>
                <p class="workshop-desc">${ws.description || ''}</p>
                <ul class="workshop-agenda">${agendaHtml}</ul>
                <button class="btn btn-terracotta btn-register-workshop" data-id="${ws.id}" data-workshop="${ws.title}" style="width: 100%; justify-content: center;">
                  ${buttonText}
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
            
            const div = document.createElement('div');
            div.className = 'past-card';
            div.innerHTML = `
              <img src="${ws.imageUrl || '../../assets/images/placeholder.jpg'}" alt="${ws.title}" loading="lazy">
              <div class="past-card-body">
                <div class="past-card-title">${ws.title}</div>
                <div class="past-card-meta">${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)} · ${ws.modality}</div>
                <p style="font-size: 0.88rem; color: var(--color-gray-600); line-height: 1.5;">${ws.description || ''}</p>
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

      // Bind events to the newly created buttons
      document.querySelectorAll('.btn-register-workshop').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const title = btn.getAttribute('data-workshop');
          const wsTitle = title || 'Taller Honatu';
          currentWorkshopId = e.target.getAttribute('data-id');
          
          if(selectedName) selectedName.textContent = wsTitle;
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
    .catch(err => console.error('Error fetching workshops:', err));

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

    setTimeout(() => {
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
      if (window.showToast) window.showToast('Error: No se pudo identificar el taller.', 'error');
      else alert('Error: No se pudo identificar el taller.');
      return;
    }

    const name = document.getElementById('wsName').value;
    const email = document.getElementById('wsEmail').value;
    const phone = document.getElementById('wsPhone').value;

    try {
      // Intentar obtener el token por si el usuario sí está logueado
      const token = localStorage.getItem('honatu_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/api/workshops/enroll', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          workshopId: currentWorkshopId,
          guestName: name,
          guestEmail: email,
          guestPhone: phone
        })
      });

      const data = await response.json();

      if (response.ok) {
        closeModal();
        if (window.showToast) {
          window.showToast('¡Te has registrado con éxito! Te contactaremos pronto.');
        } else {
          alert('¡Te has registrado con éxito!');
        }
        form.reset();
      } else {
        if (window.showToast) {
          window.showToast(data.message || 'Error al registrar', 'error');
        } else {
          alert(data.message || 'Error al registrar');
        }
      }

    } catch (error) {
      console.error('Error en inscripción:', error);
      if (window.showToast) {
        window.showToast('Error de red al intentar registrarse.', 'error');
      } else {
        alert('Error de red al intentar registrarse.');
      }
    }
  });
}
