# Plan de Implementación — Honatu Hidroponia

> Documento generado tras una auditoría completa del código (2026-10-01).
> Diseñado para ejecutarse fase por fase. Cada tarea incluye archivos afectados y criterio de aceptación.
> Prioridades: 🔴 crítico (seguridad/bugs) · 🟠 alto (funcionalidad rota) · 🟡 medio (robustez) · 🟢 bajo (deuda).

---

## Contexto del proyecto

- Monorepo npm workspaces: `backend/` (Express 5 + Sequelize 6 + PostgreSQL) y `frontend/` (HTML/CSS/JS vanilla + Vite 5, multi-page).
- Solo **Auth** y **Workshops** tienen backend real. Productos, carrito, órdenes, service requests, guías y todo el panel admin son frontend-only (localStorage / mock).
- BD: `backend/schema.sql` existe localmente pero está en `.gitignore` → un clone nuevo no puede seguir el setup. `sequelize.sync` está deshabilitado en `db.js` (comentado por bug con ENUMs). No hay migraciones ni seeds.
- No hay tests, ni validación de entrada, ni error handler global.

---

## FASE 0 — Correcciones críticas (seguridad y bugs) 🔴

### 0.1 Eliminar secreto JWT hardcodeado
- Archivos: `backend/src/controllers/auth.controller.js` (líneas ~44 y ~99), `backend/src/middlewares/auth.middleware.js` (líneas ~20 y ~34).
- El fallback `'secret_honatu_123'` aparece 4 veces. Eliminarlo.
- En `backend/src/config/db.js` o `server.js`, al arrancar: si `!process.env.JWT_SECRET` → `throw new Error('JWT_SECRET is required')` y no levantar el servidor.
- Actualizar `backend/.env.example` con un comentario indicando que es obligatorio.
- **Criterio**: el servidor no arranca sin `JWT_SECRET`; no queda ningún string `'secret_honatu_123'` en el código.

### 0.2 Arreglar `backend/.gitignore` y commitear `schema.sql`
- `backend/.gitignore` contiene literalmente `node_modules/\n.env` (el `\n` no es un salto de línea) → reescribir como líneas separadas: `node_modules/` y `.env`.
- Quitar `schema.sql` del `.gitignore` (está en línea 2) y commitearlo: el README y `docs/setup-guide.md` dependen de él.
- **Criterio**: `git check-ignore backend/schema.sql` no devuelve nada; `git status` muestra `schema.sql` como nuevo archivo; `backend/.env` sigue ignorado (lo cubre el `.gitignore` raíz).

### 0.3 Hardening de Express
- `backend/server.js`:
  - CORS restringido: `cors({ origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173' })`.
  - `express.json({ limit: '100kb' })`.
  - Añadir `helmet` (npm i helmet en workspace backend).
  - Añadir `express-rate-limit`: límite general (p. ej. 300 req/15min) y uno estricto para `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/workshops/enroll` (p. ej. 20 req/15min por IP).
- **Criterio**: login rechaza tras N intentos con 429; requests con `Origin` no permitido reciben error CORS.

### 0.4 Error handler global + 404
- `backend/server.js`: middleware 404 (`res.status(404).json({message:'Ruta no encontrada'})`) y error handler de 4 parámetros al final (no exponer `error.stack` salvo `NODE_ENV==='development'`).
- **Criterio**: rutas inexistentes devuelven JSON 404; un error no controlado devuelve 500 JSON sin stack en producción.

### 0.5 Bugs del frontend
- `frontend/src/pages/shop/checkout.html` (~línea 253): `window.location.href = 'gracias.html'` → el archivo real es `thanks.html`. Corregir a `'thanks.html'`.
- `frontend/vite.config.js`: añadir `register: resolve(__dirname, 'src/pages/auth/register.html')` a `rollupOptions.input` (hoy no se genera en el build).
- `frontend/src/js/controllers/workshops.controller.js` (~líneas 180-199): el `setTimeout` que pinta el empty-state de talleres pasados se ejecuta aunque el fetch ya resolvió → mover el empty-state dentro del `then/catch` del fetch o cancelar el timeout cuando llegan datos.
- **Criterio**: checkout redirige a thanks.html; `dist/pages/auth/register.html` existe tras `npm run build:frontend`; talleres pasados reales no desaparecen.

### 0.6 Eliminar backdoors de auth en frontend
- `frontend/src/js/controllers/auth.controller.js`: eliminar `window.loginAsClient` y `window.loginAsAdmin` (~líneas 466-484 y exportación ~585-586) y el comentario con credenciales de prueba en el modal (~línea 287-289).
- `frontend/src/js/admin/admin.js` `requireAdminAuth()` (~línea 16): hoy solo lee flags de localStorage → bypass trivial con `localStorage.setItem('honatu-auth-role','ADMIN')`. Cambiar a: leer `honatu_token`, llamar `GET /api/auth/me`, exigir `user.role === 'ADMIN'`; si falla → `logout()` + redirect a login.
- **Criterio**: no es posible entrar a `/admin` manipulando localStorage sin un token ADMIN válido.

### 0.7 Centralizar URL de la API
- `http://localhost:5000` está hardcodeado en ≥10 lugares (`auth.controller.js` líneas ~104, 375, 410; `workshops.controller.js` ~23, 235; `account.html` ~563, 601, 689, 735; `login.html` ~371; `register.html` ~381).
- Crear `frontend/src/js/config.js`: `export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';` y un helper `apiFetch(path, options)` que adjunte `Authorization: Bearer` automáticamente y maneje 401 → logout.
- Crear `frontend/.env` con `VITE_API_URL=http://localhost:5000` (ya existe `.env.example`).
- Reemplazar todos los fetch hardcodeados.
- **Criterio**: grep de `localhost:5000` en `frontend/src` devuelve 0 resultados fuera de config; cambiar `.env` cambia el target sin tocar código.

---

## FASE 1 — Validación y sanitización 🟠

### 1.1 Capa de validación backend
- Instalar `express-validator` (o `zod` + middleware propio) en `backend/`.
- Crear `backend/src/middlewares/validate.js` con un helper que ejecute la cadena y devuelva `400` con `{ message, errors: [...] }` en español.
- Validaciones requeridas:
  - `POST /api/auth/register`: `email` isEmail + normalizar (`toLowerCase().trim()` — hoy `User@x.com` y `user@x.com` crean cuentas duplicadas porque la columna UNIQUE de PG es case-sensitive); `password` mínimo 8 chars; `fullName` trim, 2-255 chars; `phone` opcional, máx 50 chars.
  - `POST /api/auth/login`: email normalizado igual que register.
  - `PUT /api/auth/profile`: `fullName`/`phone`/`shippingAddress` opcionales pero si vienen deben ser string con límites (255/50/sin límite razonable).
  - `PUT /api/auth/change-password`: `newPassword` ≥ 8 (hoy acepta 6).
  - `POST /api/workshops/enroll`: `workshopId` `isUUID()` (hoy un string inválido produce 500 por error de sintaxis UUID de PG); si es guest: `guestName` trim required, `guestEmail` isEmail + lowercase, `guestPhone` máx 50.
  - `POST /api/workshops` (admin): `title` required ≤255; `scheduledDate` `isISO8601()` y fecha futura; `capacity` entero ≥1; `price` decimal ≥0; `modality` `isIn(['Presencial','Online','Híbrido'])` (ENUM del modelo `Workshop.js:12`); `imageUrl` `isURL()` opcional; `agenda` array opcional.
- **Criterio**: payloads inválidos devuelven 400 con mensaje claro, nunca 500.

### 1.2 Constraint de inscripciones + race condition
- `enrollWorkshop` (`workshops.controller.js:28-31`) hace `count` + `create` sin transacción → sobreinscripción posible.
- En `schema.sql`, añadir a `WorkshopEnrollments`: `UNIQUE (workshopId, userId)` y `UNIQUE (workshopId, guestEmail)` (parciales si es necesario por NULLs: `CREATE UNIQUE INDEX ... WHERE "userId" IS NOT NULL`).
- Envolver count+create en `sequelize.transaction` con lock (`SELECT ... FOR UPDATE` del Workshop) o capturar el error de constraint y devolver 400.
- **Criterio**: dos requests simultáneas no pueden superar `capacity` ni crear duplicados.

### 1.3 Sanitización / XSS en frontend
- No existe ninguna función de escape; hay `innerHTML` con datos de API y localStorage.
- Crear `frontend/src/js/utils/dom.js` con `escapeHtml(str)` (o usar `textContent`/`createElement` donde sea posible).
- Reemplazar interpolaciones riesgosas:
  - `controllers/workshops.controller.js` (~líneas 50-72 y 100-107): `ws.title`, `ws.description`, `ws.modality`, `ws.imageUrl`, `ws.agenda[]`.
  - `pages/auth/account.html` (~líneas 622-649): datos de `/api/workshops/my-enrollments`.
  - `controllers/cart.controller.js` (~líneas 43-59) y `pages/shop/cart.html` (~119-130): `item.name`, `item.img`, `item.id`.
  - `middleware/toast.middleware.js` (~línea 83): `${message}` interpolado en innerHTML (mensajes incluyen respuestas del backend).
  - `admin/controllers/*.js`: tablas renderizadas desde localStorage (productos, servicios, talleres, guías).
- Validar URLs de imagen (o al menos escapar comillas en atributos `src`).
- **Criterio**: insertar `<img src=x onerror=alert(1)>` como título de taller o nombre de producto no ejecuta JS en ninguna vista.

### 1.4 Validación de formularios frontend
- Añadir `required` a `modalLoginEmail`/`modalLoginPassword` (auth.controller.js ~280-284).
- Añadir `minlength="8"` a `regPass` (register.html ~línea 323), `newPass` (account.html ~línea 476) y `modalRegPassword`.
- Añadir `pattern`/`maxlength` a teléfonos (`regPhone`, `wsPhone`, `book-phone`, `accPhone`) y `inputmode="numeric" pattern="[0-9]{5}"` al CP de checkout.
- `checkout.html` `#shippingForm` (~línea 98): los inputs no tienen `id`/`name`/`type=email` → darles atributos o el form es decorativo (se resuelve en Fase 3 al implementar checkout real).
- **Criterio**: ningún form permite submit de datos vacíos o mal formateados que el backend rechazaría.

---

## FASE 2 — Backend faltante 🟠

Los modelos Sequelize y las tablas SQL ya existen; faltan controllers + routes. Patrón a seguir: `workshops.routes.js` + `workshops.controller.js`, con validación de la Fase 1 y `requireAuth`/`requireAdmin` según corresponda.

### 2.1 Products
- `backend/src/routes/products.routes.js` + `controllers/products.controller.js`:
  - `GET /api/products` (público): lista productos `isActive` con sus `ProductVariants` (include).
  - `GET /api/products/:id` (público): detalle + variantes.
  - `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` (requireAuth+requireAdmin): CRUD. Soft-delete preferido (`isActive=false`) para no romper OrderItems históricos.
  - Variantes: `POST/PUT/DELETE /api/products/:id/variants`.
  - Validaciones: `price` decimal ≥0, `stock` entero ≥0, `sku` unique required, `name` required.
- Descomentar el mount en `server.js` (líneas 10 y 29 — decidir path `/api/products`, el comentado dice `/api/productos`; alinear con docs/api.md).
- **Criterio**: catálogo CRUD funcional documentado en Swagger.

### 2.2 Service Requests
- `service-requests.routes.js` + controller:
  - `POST /api/service-requests` (`optionalAuth`): `{serviceType, details, requestedDate}` + datos de contacto guest si no hay user (considerar añadir `guestName`/`guestEmail`/`guestPhone` al modelo, igual que WorkshopEnrollment).
  - `GET /api/service-requests` (admin): lista con filtros por status.
  - `PATCH /api/service-requests/:id` (admin): cambiar `status` dentro del ENUM `('PENDING','REVIEW','ACCEPTED','COMPLETED','REJECTED')`.
- **Criterio**: los forms `#contactForm`, `#servicioForm` y `#bookingForm` del frontend pueden enviar datos reales.

### 2.3 Cart + Orders + Checkout
- `cart.routes.js`: `GET /api/cart`, `POST /api/cart` (upsert por `userId`+`productVariantId`), `PUT /api/cart/:id`, `DELETE /api/cart/:id`, `DELETE /api/cart` (vaciar). Todo `requireAuth`.
- `orders.routes.js`:
  - `POST /api/orders` (requireAuth): crea `Order` + `OrderItems` desde el carrito en una **transacción**: calcular `totalAmount` desde precios de DB (nunca del cliente), verificar `stock` de cada variante con lock, decrementar stock, vaciar carrito.
  - `GET /api/orders/my` (requireAuth): pedidos del usuario con items.
  - `GET /api/orders` (admin) + `PATCH /api/orders/:id/status` (admin, dentro del ENUM order_status).
- **Criterio**: flujo completo carrito → orden → "thanks" con número de orden real; stock decrementa; stock insuficiente devuelve 409/400.

### 2.4 Workshops admin
- `PUT /api/workshops/:id`, `DELETE /api/workshops/:id` (admin).
- `GET /api/workshops/:id/enrollments` (admin): lista de inscritos.
- `PATCH /api/workshops/enrollments/:id/payment` (admin): `paymentStatus` PENDING→PAID.
- **Criterio**: el panel admin puede gestionar talleres e inscripciones end-to-end.

### 2.5 Swagger
- Documentar todos los endpoints nuevos con JSDoc `@openapi` siguiendo el estilo de `auth.routes.js`/`workshops.routes.js`.
- **Criterio**: `/api/docs` refleja toda la API.

---

## FASE 3 — Conectar frontend con API real 🟠

### 3.1 Shop
- `shop.controller.js`: hoy pinta `products=[]` y "Próximamente" (líneas 36-52). Consumir `GET /api/products`, renderizar cards reales (escapando datos), mantener skeletons durante carga.
- `product.html`: página de detalle consumiendo `GET /api/products/:id` (leer `?id=` o slug de la URL).
- Filtros en `filters.controller.js`: aplicar sobre datos reales (categoría/precio).

### 3.2 Cart + Checkout
- `cart.controller.js`: hoy 100% localStorage. Si hay token → sincronizar con `/api/cart` (merge al login); guest puede seguir local hasta checkout.
- `checkout.html`: hacer funcionales los campos de envío (dar `id`/`name`), enviar `POST /api/orders`, y usar el número de orden real en `thanks.html` (hoy genera uno aleatorio en cliente, ~líneas 110-118).
- Decidir: pagos reales fuera de scope (marcar `paymentStatus`/`status` como PENDING) o integrar Stripe/MercadoPago como fase futura.

### 3.3 Contact / Booking / Services
- Conectar `#contactForm` (index.html ~línea 323), `#servicioForm` (services.html ~línea 46) y `#bookingForm` (booking.html ~línea 77) a `POST /api/service-requests`. Mapear `serviceType` según el form (asesoría, instalación, construcción de invernadero).
- Mantener el feedback de éxito actual (toast + reset) pero solo tras respuesta 201 real; manejar errores.

### 3.4 Panel Admin real
- Reemplazar `admin-mock-data.js` (localStorage) por llamadas a la API vía `apiFetch`, sección por sección:
  - Workshops → endpoints de la Fase 2.4. **Arreglar el contrato**: el form admin usa `type: 'IN_PERSON'|'ONLINE'` + `date`/`time`/`maxCapacity` separados (admin-workshops.controller.js ~197-244, admin.html ~661-671); el backend espera `{title, scheduledDate(ISO), capacity, price, modality: 'Presencial'|'Online'|'Híbrido', description, imageUrl, agenda}`. Actualizar el form.
  - Products → Fase 2.1.
  - Services → Fase 2.2.
  - Overview/KPIs → considerar `GET /api/admin/stats` (nuevo endpoint agregando counts) o calcular desde las listas.
  - Guides y "Modificar Front": no hay modelo backend; decidir si se crean tablas (`EducationalGuide`, `FrontendConfig`) o se retiran del panel hasta tener backend.
- `account.html`: conectar tabs "Mis Pedidos" (hardcodeados ~líneas 413-469) a `GET /api/orders/my`.
- **Criterio**: ninguna sección del admin lee/escribe `honatu-admin-*` en localStorage; guardar persiste en PostgreSQL.

---

## FASE 4 — Alineación del modelo de datos e infra 🟡

### 4.1 Discrepancias modelo ↔ SQL ↔ docs (decidir y alinear)
- `Workshop.modality`: ENUM en el modelo Sequelize (`Workshop.js:12`) vs `VARCHAR(50)` en `schema.sql:125` → unificar (recomendado: ENUM en SQL, dado que el modelo ya valida).
- `ServiceRequest.status`: modelo/SQL `('PENDING','REVIEW','ACCEPTED','COMPLETED','REJECTED')` vs docs/api.md `('PENDING','CONFIRMED','COMPLETED')` → actualizar docs o ENUM.
- `Product`: docs mencionan `imageUrl` que el modelo no tiene → decidir si se agrega columna (imagen principal) o solo `ProductVariants.imageUrls`.
- `Order`: docs mencionan `shippingAddress`; modelo/SQL no lo tienen → agregar (necesario para checkout real).
- `ServiceRequest`: docs `preferredDate`/`notes` vs modelo `requestedDate`/`details` → unificar nombres.
- `onDelete`: `index.js` no declara `onDelete` explícitos; docs piden CASCADE en Workshop→Enrollment, RESTRICT en User→Order y ProductVariant→OrderItem → declararlos.
- Hay **dos modelos de datos documentados divergentes**: `docs/database.md` (simple, ~11 tablas, refleja el código) vs `frontend/docs/diagramER.md` (rico: ROLE/PERMISSION, CATEGORY, PRODUCT_MASTER, GREENHOUSE_CONSTRUCTION, SERVICE_QUOTE, EDUCATIONAL_GUIDE, AUDIT_LOG…). **Decidir cuál es el target** y marcar el otro como histórico/aspiracional. El mock data del admin sigue el modelo rico → hay que mapear al integrar.

### 4.2 Migraciones y seeds
- Adoptar `sequelize-cli` o `umzug` para migraciones versionadas (hoy solo existe `schema.sql` y `sync` está deshabilitado por un bug con ENUMs — resolver la causa raíz o mantener SQL + migraciones manuales).
- Crear `backend/seed.js` (o SQL seed): usuario ADMIN inicial, productos/variantes demo, talleres demo.
- **Criterio**: `npm run db:setup` en un clone limpio crea esquema + seeds; README actualizado.

### 4.3 Limpieza de código muerto
- `frontend/src/js/main.js` (566 líneas): no lo referencia ningún HTML; duplica auth/carrito mock viejo → eliminar.
- `frontend/dist/` es un **build obsoleto** (27-sep, anterior al refactor `4a8ccb4`) con la estructura vieja en español (`pages/tienda/`, `pages/servicios/`, `pages/educacion/`, `pages/institucional/`, `favoritos.html`). Está gitignored; borrar y regenerar con `npm run build:frontend`. NO es código duplicado en el repo, solo artefacto local.
- Bloques `#loginForm`/`#registerForm` estáticos duplicados en el markup de index.html, workshops.html, shop.html, product.html, account.html, cart.html → `ensureAuthModalDOM` los sobrescribe; eliminar el markup muerto.
- `#adminBadgeContainer` comentado en account.html (~308-312) pero el JS lo busca → descomentar o eliminar el JS.
- `docs/architecture.md` describe una estructura de `js/` que ya no existe (`api.js`, `pages/`) → actualizar.
- **Criterio**: no hay archivos sin referenciar; docs reflejan el código.

### 4.3b Imágenes rotas 🔴(visible) / se perdieron en el refactor
- El refactor `4a8ccb4` eliminó las imágenes de galería: solo existen en disco `assets/images/FondoHero.jpeg` y `assets/logo/Logo.png`.
- **48 referencias rotas** a `assets/images/educacion/` (14), `assets/images/involucrate/` (18), `assets/images/acciones/` (8), `assets/images/home/` (8) en `index.html`, `education.html`, `get-involved.html`, `actions.html`.
- Opciones: (a) recuperar las imágenes de git history (`git show <commit-previo>:<path>` — existían antes de `4a8ccb4`), (b) migrarlas a Cloudinary (ya existe `cloudinary.service.js` con mapeos) y actualizar los `src`, o (c) reemplazar por placeholders.
- **Criterio**: `grep -r "assets/images/" frontend/src` solo devuelve rutas que existen en disco o se migraron a URLs de Cloudinary.

### 4.4 Calidad
- Tests: `backend/package.json` tiene el test stub por defecto. Añadir Vitest + Supertest: auth (register/login/guards), enroll (validaciones, cupo, duplicados), products CRUD con auth admin. Mínimo: tests de validación y de los endpoints existentes.
- CI: `.github/workflows/deploy.yml` está roto — corre `npm run build` (script inexistente en raíz; el real es `build:frontend`) y sube `./dist` (Vite emite `frontend/dist`). Arreglar paths o eliminar el workflow hasta que el frontend tenga backend desplegado.
- `NODE_ENV` en scripts del backend (`cross-env NODE_ENV=production` para start; añadir script `start` — hoy solo existe `dev`).
- Logging: reemplazar `console.error` dispersos por un logger mínimo (o al menos consistente).

---

## Orden sugerido de ejecución

1. **Fase 0** completa (1 sesión): son cambios pequeños con alto impacto en seguridad.
2. **Fase 1** (validación + XSS): protege lo que ya funciona end-to-end.
3. **Fase 4.1** (decisión del modelo de datos): conviene resolverla ANTES de Fase 2 para no construir sobre un esquema que va a cambiar.
4. **Fase 2 + 3** por vertical: products→shop, service-requests→forms, cart/orders→checkout, workshops-admin→panel.
5. **Fase 4.2-4.4** al final.

## Riesgos / notas

- `optionalAuth` trata tokens inválidos como guest silenciosamente (`auth.middleware.js:30-41`) — documentado como diseño, pero conviene loggear.
- JWT de 30 días sin refresh ni blacklist — aceptable para MVP; considerar reducir y/o refresh tokens más adelante.
- `cloudinary.service.js` (~líneas 16-18, 281-293) expone `apiKey` y un unsigned upload preset (`usn9paiw`/`honatu_preset`) — cualquiera puede subir imágenes a esa cuenta de Cloudinary. Restringir el preset (formatos/tamaño/carpeta) en el dashboard de Cloudinary o firmar uploads desde el backend.
- Swagger UI (`/api/docs`) es público sin auth — aceptable en dev; considerar protegerlo o deshabilitarlo en producción.
