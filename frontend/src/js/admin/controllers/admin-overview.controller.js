/* ============================================
   HONATU – Admin Overview Controller
   KPI calculations & Chart.js Visualizations
   ============================================ */

import { getAdminProducts, getAdminWorkshops, getAdminServices } from '../data/admin-mock-data.js';

let chartInstances = {};

export function initAdminOverview() {
  renderKPICards();
  renderOverviewCharts();
}

export function renderKPICards() {
  const products = getAdminProducts();
  const workshops = getAdminWorkshops();
  const services = getAdminServices();

  // 1. Calculate Workshop Stats
  let totalWorkshopSlots = 0;
  let totalRegisteredAttendees = 0;
  let workshopRevenue = 0;

  workshops.forEach(w => {
    totalWorkshopSlots += (w.maxCapacity || 0);
    const regs = w.registrations || [];
    totalRegisteredAttendees += regs.length;
    regs.forEach(r => {
      if (r.paymentStatus === 'PAID') {
        workshopRevenue += (r.amount || w.price || 0);
      }
    });
  });

  const occupancyRate = totalWorkshopSlots > 0 
    ? Math.round((totalRegisteredAttendees / totalWorkshopSlots) * 100) 
    : 0;

  // 2. Product Stats
  let totalProductVariants = 0;
  let lowStockCount = 0;
  products.forEach(p => {
    (p.variants || []).forEach(v => {
      totalProductVariants++;
      if (v.stock <= 5) lowStockCount++;
    });
  });

  // Estimated Product Monthly Sales
  const estimatedProductSales = 48650;
  const totalRevenue = estimatedProductSales + workshopRevenue;

  // 3. Service Requests Stats
  const pendingServices = services.filter(s => s.status === 'PENDING' || s.status === 'IN_REVIEW').length;

  // Inject into DOM
  const kpiRev = document.getElementById('kpiTotalRevenue');
  const kpiProducts = document.getElementById('kpiProductsSold');
  const kpiWorkshops = document.getElementById('kpiWorkshopOccupancy');
  const kpiServices = document.getElementById('kpiPendingServices');

  if (kpiRev) kpiRev.textContent = `$${totalRevenue.toLocaleString('es-MX')}`;
  if (kpiProducts) kpiProducts.textContent = `${totalProductVariants} variantes`;
  if (kpiWorkshops) kpiWorkshops.textContent = `${totalRegisteredAttendees} inscritos (${occupancyRate}%)`;
  if (kpiServices) kpiServices.textContent = `${pendingServices} solicitudes`;
}

export function renderOverviewCharts() {
  const ChartLib = window.Chart;
  if (!ChartLib) {
    console.warn('Chart.js is not loaded yet');
    return;
  }

  // Set global chart typography matching client design system
  ChartLib.defaults.font.family = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  ChartLib.defaults.color = '#556352';

  // Destroy previous instances to avoid canvas reuse issues
  Object.keys(chartInstances).forEach(key => {
    if (chartInstances[key]) chartInstances[key].destroy();
  });

  // 1. Sales & Revenue Trend Chart (Area Line)
  const ctxSales = document.getElementById('chartSalesTrend')?.getContext('2d');
  if (ctxSales) {
    chartInstances.sales = new ChartLib(ctxSales, {
      type: 'line',
      data: {
        labels: ['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago (Actual)'],
        datasets: [
          {
            label: 'Ingresos Totales ($)',
            data: [32000, 38500, 44200, 51000, 58400, 67150],
            borderColor: '#234E28',
            backgroundColor: 'rgba(35, 78, 40, 0.12)',
            fill: true,
            tension: 0.38,
            borderWidth: 2.5,
            pointBackgroundColor: '#234E28',
            pointRadius: 4,
          },
          {
            label: 'Talleres & Cursos ($)',
            data: [12000, 15000, 16500, 21000, 22000, 27400],
            borderColor: '#B87333',
            backgroundColor: 'rgba(184, 115, 51, 0.08)',
            fill: true,
            tension: 0.38,
            borderWidth: 2,
            borderDash: [4, 4],
            pointBackgroundColor: '#B87333',
            pointRadius: 3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 12 } } },
          tooltip: {
            callbacks: {
              label: (item) => `${item.dataset.label}: $${item.raw.toLocaleString('es-MX')}`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: (val) => `$${val / 1000}k`,
              font: { family: 'Plus Jakarta Sans' }
            },
            grid: { color: '#EDF1EA' }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 2. Sales by Product Category (Doughnut)
  const ctxCategory = document.getElementById('chartCategorySales')?.getContext('2d');
  if (ctxCategory) {
    chartInstances.category = new ChartLib(ctxCategory, {
      type: 'doughnut',
      data: {
        labels: ['Nutrientes A+B', 'Sistemas NFT', 'Sustratos & Perlita', 'Instrumentación'],
        datasets: [{
          data: [42, 28, 18, 12],
          backgroundColor: ['#234E28', '#5E8254', '#B87333', '#CAD7BA'],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 12 } } },
          tooltip: {
            callbacks: {
              label: (item) => ` ${item.label}: ${item.raw}% de ventas`
            }
          }
        },
        cutout: '70%'
      }
    });
  }

  // 3. Workshops Capacity vs Enrolled (Bar)
  const ctxWorkshops = document.getElementById('chartWorkshops')?.getContext('2d');
  if (ctxWorkshops) {
    const workshops = getAdminWorkshops();
    const labels = workshops.map(w => w.title.length > 22 ? w.title.substring(0, 20) + '...' : w.title);
    const capacityData = workshops.map(w => w.maxCapacity);
    const registeredData = workshops.map(w => (w.registrations || []).length);

    chartInstances.workshops = new ChartLib(ctxWorkshops, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Inscritos Confirmados',
            data: registeredData,
            backgroundColor: '#234E28',
            borderRadius: 6
          },
          {
            label: 'Cupo Total Ofertado',
            data: capacityData,
            backgroundColor: '#E2E7DE',
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 12 } } }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#EDF1EA' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 4. Advisory & Greenhouse Requests Status
  const ctxServices = document.getElementById('chartServices')?.getContext('2d');
  if (ctxServices) {
    chartInstances.services = new ChartLib(ctxServices, {
      type: 'pie',
      data: {
        labels: ['En Revisión', 'Pendientes', 'Aceptadas / Cotizadas'],
        datasets: [{
          data: [1, 1, 1],
          backgroundColor: ['#B87333', '#CF8A4A', '#234E28'],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 12 } } }
        }
      }
    });
  }
}
