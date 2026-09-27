/* ============================================
   HONATU – Admin Workshops & Geolocation Controller
   Workshop CRUD, Registered Attendees & State Demographics
   ============================================ */

import { getAdminWorkshops, saveAdminWorkshops, getAttendeeStateDistribution, MEXICAN_STATES } from '../data/admin-mock-data.js';
import { showToast } from '../../middleware/toast.middleware.js';

let currentEditingWorkshopId = null;

export function initAdminWorkshops() {
  renderWorkshopsTable();
  renderGeoDistribution();
  bindWorkshopEvents();
}

export function renderWorkshopsTable() {
  const tableBody = document.getElementById('adminWorkshopsTableBody');
  if (!tableBody) return;

  const workshops = getAdminWorkshops();

  tableBody.innerHTML = workshops.map(w => {
    const regs = w.registrations || [];
    const count = regs.length;
    const max = w.maxCapacity || 1;
    const pct = Math.min(100, Math.round((count / max) * 100));

    return `
      <tr>
        <td>
          <strong>${w.title}</strong>
          <div style="font-size: 0.75rem; color: var(--color-gray-500);">${w.date} • ${w.time}</div>
        </td>
        <td>
          <span class="status-pill" style="background: ${w.type === 'ONLINE' ? 'rgba(184, 115, 51, 0.12)' : 'rgba(35, 78, 40, 0.12)'}; color: ${w.type === 'ONLINE' ? 'var(--color-terracotta)' : 'var(--color-forest)'};">
            ${w.type === 'ONLINE' ? 'Online Zoom' : 'Presencial Invernadero'}
          </span>
        </td>
        <td><strong>$${w.price.toLocaleString('es-MX')}</strong></td>
        <td style="min-width: 140px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; margin-bottom: 4px;">
            <span>${count} / ${max} cupos</span>
            <span style="color: ${pct >= 85 ? 'var(--color-terracotta)' : 'var(--color-forest)'};">${pct}%</span>
          </div>
          <div class="state-bar-track" style="height: 6px;">
            <div class="state-bar-fill" style="width: ${pct}%; background: ${pct >= 85 ? 'var(--color-terracotta)' : 'var(--color-forest)'};"></div>
          </div>
        </td>
        <td>
          <button type="button" class="btn-admin-pill btn-view-attendees" data-id="${w.id}">
            Ver Asistentes (${count})
          </button>
        </td>
        <td>
          <div class="action-btn-group">
            <button type="button" class="btn-action-icon btn-edit-workshop" data-id="${w.id}" title="Editar taller">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button type="button" class="btn-action-icon btn-action-delete btn-delete-workshop" data-id="${w.id}" title="Eliminar taller">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

export function renderGeoDistribution() {
  const container = document.getElementById('geoDistributionList');
  if (!container) return;

  const distribution = getAttendeeStateDistribution();

  if (distribution.length === 0) {
    container.innerHTML = `<p style="color: var(--color-gray-500); font-size: 0.85rem;">No hay registros de asistentes todavía.</p>`;
    return;
  }

  container.innerHTML = distribution.map(item => `
    <div class="state-bar-item">
      <div class="state-bar-header">
        <span>${item.state}</span>
        <span>${item.count} participantes (${item.percentage}%)</span>
      </div>
      <div class="state-bar-track">
        <div class="state-bar-fill" style="width: ${item.percentage}%;"></div>
      </div>
    </div>
  `).join('');
}

function bindWorkshopEvents() {
  const btnNew = document.getElementById('btnNewWorkshop');
  const modal = document.getElementById('workshopModal');
  const form = document.getElementById('workshopForm');
  const closeBtn = document.getElementById('closeWorkshopModal');
  const attendeesModal = document.getElementById('attendeesModal');
  const closeAttendeesBtn = document.getElementById('closeAttendeesModal');

  btnNew?.addEventListener('click', () => {
    currentEditingWorkshopId = null;
    form?.reset();
    document.getElementById('workshopModalTitle').textContent = 'Publicar Nuevo Taller';
    modal?.classList.add('active');
  });

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('active');
  });

  closeAttendeesBtn?.addEventListener('click', () => {
    attendeesModal?.classList.remove('active');
  });

  document.getElementById('adminWorkshopsTableBody')?.addEventListener('click', (e) => {
    const viewAttendeesBtn = e.target.closest('.btn-view-attendees');
    const editBtn = e.target.closest('.btn-edit-workshop');
    const deleteBtn = e.target.closest('.btn-delete-workshop');

    if (viewAttendeesBtn) {
      const id = parseInt(viewAttendeesBtn.dataset.id, 10);
      openAttendeesModal(id);
    } else if (editBtn) {
      const id = parseInt(editBtn.dataset.id, 10);
      openEditWorkshopModal(id);
    } else if (deleteBtn) {
      const id = parseInt(deleteBtn.dataset.id, 10);
      deleteWorkshop(id);
    }
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveWorkshopFromForm();
  });
}

function openAttendeesModal(workshopId) {
  const workshops = getAdminWorkshops();
  const workshop = workshops.find(w => w.id === workshopId);
  if (!workshop) return;

  const modal = document.getElementById('attendeesModal');
  document.getElementById('attendeesModalTitle').textContent = `Participantes: ${workshop.title}`;
  document.getElementById('attendeesWorkshopSubtitle').textContent = `${workshop.type === 'ONLINE' ? 'En línea' : 'Presencial'} • ${workshop.date} • ${workshop.registrations?.length || 0} registrados`;

  const tbody = document.getElementById('attendeesTableBody');
  const regs = workshop.registrations || [];

  if (regs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 24px; color: var(--color-gray-500);">Aún no hay clientes registrados a este taller.</td></tr>`;
  } else {
    tbody.innerHTML = regs.map((r, i) => `
      <tr>
        <td><strong>#${i + 1}</strong></td>
        <td>
          <strong>${r.fullName}</strong>
          <div style="font-size: 0.75rem; color: var(--color-gray-500);">${r.email} • ${r.phone}</div>
        </td>
        <td><span style="font-weight: 600; color: var(--color-forest);">${r.stateName || 'N/D'}</span></td>
        <td><span style="font-size: 0.8rem; color: var(--color-gray-500);">${r.registeredAt}</span></td>
        <td>
          <span class="status-pill ${r.paymentStatus === 'PAID' ? 'paid' : 'pending'}">
            ${r.paymentStatus === 'PAID' ? '✓ Pagado' : 'Pendiente'}
          </span>
        </td>
      </tr>
    `).join('');
  }

  modal?.classList.add('active');
}

function openEditWorkshopModal(workshopId) {
  const workshops = getAdminWorkshops();
  const w = workshops.find(item => item.id === workshopId);
  if (!w) return;

  currentEditingWorkshopId = workshopId;
  const modal = document.getElementById('workshopModal');
  document.getElementById('workshopModalTitle').textContent = 'Editar Taller';

  document.getElementById('workshopTitle').value = w.title;
  document.getElementById('workshopType').value = w.type;
  document.getElementById('workshopDate').value = w.date;
  document.getElementById('workshopTime').value = w.time;
  document.getElementById('workshopLocation').value = w.location;
  document.getElementById('workshopPrice').value = w.price;
  document.getElementById('workshopCapacity').value = w.maxCapacity;
  document.getElementById('workshopDesc').value = w.description;

  modal?.classList.add('active');
}

function saveWorkshopFromForm() {
  const workshops = getAdminWorkshops();
  const title = document.getElementById('workshopTitle').value.trim();
  const type = document.getElementById('workshopType').value;
  const date = document.getElementById('workshopDate').value;
  const time = document.getElementById('workshopTime').value.trim();
  const location = document.getElementById('workshopLocation').value.trim();
  const price = parseFloat(document.getElementById('workshopPrice').value) || 0;
  const maxCapacity = parseInt(document.getElementById('workshopCapacity').value, 10) || 20;
  const description = document.getElementById('workshopDesc').value.trim();

  if (currentEditingWorkshopId) {
    const index = workshops.findIndex(w => w.id === currentEditingWorkshopId);
    if (index !== -1) {
      workshops[index].title = title;
      workshops[index].type = type;
      workshops[index].date = date;
      workshops[index].time = time;
      workshops[index].location = location;
      workshops[index].price = price;
      workshops[index].maxCapacity = maxCapacity;
      workshops[index].description = description;
      saveAdminWorkshops(workshops);
      showToast("Taller actualizado exitosamente.");
    }
  } else {
    const newWorkshop = {
      id: Date.now(),
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type,
      date,
      time,
      location,
      price,
      maxCapacity,
      description,
      status: 'PUBLISHED',
      registrations: []
    };
    workshops.unshift(newWorkshop);
    saveAdminWorkshops(workshops);
    showToast("¡Nuevo taller publicado en la plataforma!");
  }

  document.getElementById('workshopModal')?.classList.remove('active');
  renderWorkshopsTable();
  renderGeoDistribution();
}

function deleteWorkshop(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este taller?")) {
    const workshops = getAdminWorkshops().filter(w => w.id !== id);
    saveAdminWorkshops(workshops);
    showToast("Taller eliminado.");
    renderWorkshopsTable();
    renderGeoDistribution();
  }
}
