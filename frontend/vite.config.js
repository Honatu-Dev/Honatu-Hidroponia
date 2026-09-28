import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  base: '/Honatu-Hidroponia/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        servicios: resolve(__dirname, 'src/pages/services/services.html'),
        agendar: resolve(__dirname, 'src/pages/services/booking.html'),
        tienda: resolve(__dirname, 'src/pages/shop/shop.html'),
        nosotros: resolve(__dirname, 'src/pages/about/about.html'),
        educacion: resolve(__dirname, 'src/pages/education/education.html'),
        talleres: resolve(__dirname, 'src/pages/education/workshops.html'),
        cuenta: resolve(__dirname, 'src/pages/auth/account.html'),
        acciones: resolve(__dirname, 'src/pages/about/actions.html'),
        involucrate: resolve(__dirname, 'src/pages/about/get-involved.html'),
        producto: resolve(__dirname, 'src/pages/shop/product.html'),
        carrito: resolve(__dirname, 'src/pages/shop/cart.html'),
        checkout: resolve(__dirname, 'src/pages/shop/checkout.html'),
        gracias: resolve(__dirname, 'src/pages/shop/thanks.html'),
        admin: resolve(__dirname, 'src/pages/admin/admin.html'),
        login: resolve(__dirname, 'src/pages/auth/login.html'),
      },
    },
  },
});
