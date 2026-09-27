/* ============================================
   HONATU – Filters Controller
   Product category filtering
   ============================================ */

export function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const filter = this.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      productCards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'todos' || category === filter;

        if (show) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
