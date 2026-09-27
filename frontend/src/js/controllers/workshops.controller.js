export function initWorkshops() {
  const overlay = document.getElementById('workshopOverlay');
  const modal = document.getElementById('workshopModal');
  const closeBtn = document.getElementById('workshopClose');
  const selectedName = document.getElementById('workshopSelectedName');
  const form = document.getElementById('workshopForm');

  if (!form) return; // We are not on the workshops page

  // Current selected workshop ID
  let currentWorkshopId = null;
  let workshopsData = [];

  // 1. Fetch workshops to get their IDs
  fetch('http://localhost:5000/api/workshops')
    .then(res => res.json())
    .then(data => {
      workshopsData = data;
      
      // Bind data-workshop dynamically based on title matching
      // (En producción se haría renderizando todo dinámicamente)
      document.querySelectorAll('.btn-register-workshop').forEach(btn => {
        const title = btn.getAttribute('data-workshop');
        const dbWorkshop = workshopsData.find(w => w.title === title);
        
        if (dbWorkshop) {
          btn.setAttribute('data-id', dbWorkshop.id);
        }

        btn.addEventListener('click', (e) => {
          const wsTitle = title || 'Taller Honatu';
          currentWorkshopId = e.target.getAttribute('data-id');
          
          selectedName.textContent = wsTitle;
          overlay.classList.add('active');
          modal.classList.add('active');
          modal.setAttribute('aria-hidden', 'false');
        });
      });
    })
    .catch(err => console.error('Error fetching workshops:', err));

  const closeModal = () => {
    overlay.classList.remove('active');
    modal.classList.remove('active');
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
