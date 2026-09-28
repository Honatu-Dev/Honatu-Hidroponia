# System Architecture

This document describes the high-level architecture, design decisions, and operational structure of the Honatu digital platform.

---

## 1. Architectural Overview

The platform uses a decoupled client-server architecture organized within an npm workspaces monorepo:

```text
[ Client (Browser) ]
       │
       ▼  HTTP / JSON (REST)
[ Express 5 API Gateway / Router ]
       │
       ├── Middleware Pipeline (CORS, JSON Body Parser, JWT Auth Guards)
       │
       ├── Controllers (Business Logic & Request Orchestration)
       │
       └── Sequelize ORM Layer (Data Access & Relational Modeling)
              │
              ▼  SQL (Connection Pool)
       [ PostgreSQL Database ]
```

---

## 2. Monorepo Organization

The project uses npm workspaces declared in the root `package.json`:

```json
{
  "name": "honatu-hidroponia-monorepo",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ]
}
```

### Benefits of this structure:
- **Unified Dependency Management**: A single top-level `package-lock.json` ensures consistent dependency locking across environments.
- **Concurrent Local Execution**: Root scripts leverage parallel execution (`npm run dev:backend & npm run dev:frontend`) to spin up the entire development stack with a single command.
- **Isolated Deployments**: The frontend can be built and shipped as static artifacts (`dist/`), while the backend is deployed as an independent container or Node.js service.

---

## 3. Frontend Architecture

The frontend is intentionally built with vanilla web standards (HTML5, CSS3, and modern ECMAScript modules) bundled by Vite:

```text
frontend/
├── index.html                 # Landing page & core showcase
├── vite.config.js             # Build target definitions
└── src/
    ├── css/                   # Design system and layout definitions
    │   ├── base.css           # Global typography, CSS reset, and variables
    │   ├── components.css     # Buttons, cards, modals, and form controls
    │   └── pages/             # View-specific stylesheet overrides
    ├── js/                    # Client logic and DOM controllers
    │   ├── api.js             # Fetch wrappers and backend HTTP clients
    │   ├── auth.js            # Token storage and session state management
    │   └── pages/             # Event listeners and page-specific logic
    └── pages/                 # Multi-page modular views
        ├── auth/              # Login and registration forms
        ├── education/         # Workshops listings and checkout modals
        ├── shop/              # Product browsing and shopping cart
        ├── services/          # Consultation requests
        └── admin/             # Operations dashboard
```

### Key Frontend Principles:
- **Zero-Dependency CSS Architecture**: Uses native CSS variables (`--color-primary`, `--spacing-md`, etc.) for theme consistency without the build overhead of preprocessors.
- **Progressive Enhancement**: Pages load with semantic HTML structure first, then attach interactive behaviors using native ES modules (`<script type="module">`).
- **Telemetry & Visualization**: Employs Chart.js for data visualization without requiring bulky UI frameworks.

---

## 4. Backend Architecture

The backend is built on Node.js using native ES Modules (`"type": "module"`). It follows a clean layered pattern:

```text
backend/
├── server.js                  # App bootstrap, middleware binding, and port listener
└── src/
    ├── config/
    │   ├── db.js              # Database connection and pool configuration
    │   └── swagger.js         # OpenAPI specification and UI middleware setup
    ├── routes/                # Endpoint routing and OpenAPI JSDoc documentation
    ├── middlewares/           # Authentication guards and role checkers
    ├── controllers/           # HTTP handling, input validation, and business logic
    └── models/                # Data models and relationship definitions
```

### Layer Responsibilities:

1. **Routing Layer (`src/routes/`)**:
   - Declares URI paths and HTTP verbs.
   - Attaches relevant middleware guards (`requireAuth`, `requireAdmin`, `optionalAuth`).
   - Serves as the single source of truth for OpenAPI annotations.

2. **Middleware Layer (`src/middlewares/`)**:
   - `auth.middleware.js`: Validates bearer tokens, resolves the active user from the database, and enforces role policies before requests reach controllers.

3. **Controller Layer (`src/controllers/`)**:
   - Extracts and sanitizes request parameters.
   - Enforces business rules (e.g., checking workshop seat capacity before creating an enrollment).
   - Coordinates model queries and returns standardized JSON responses.

4. **Persistence Layer (`src/models/`)**:
   - Sequelize ORM handles table mapping, associations (e.g., `Workshop.hasMany(WorkshopEnrollment)`), and transaction integrity.

---

## 5. Security Architecture

### Authentication Mechanism
- **Password Security**: Passwords are never stored in plaintext. They are salted with a factor of 10 and hashed using `bcryptjs`.
- **Stateless Tokens**: Authentication generates signed JSON Web Tokens (JWT) using HMAC-SHA256 (`HS256`).
- **Role-Based Access Control (RBAC)**:
  - `CLIENT`: Allowed to manage their personal profile, place orders, and enroll in workshops.
  - `ADMIN`: Granted privilege to mutate product catalogs, schedule workshops, and inspect user enrollments.

### Data Protection
- Sensitive configuration items (database credentials, JWT secret keys) are injected exclusively via environment variables (`.env`).
- Primary keys across all business entities use UUIDv4 to eliminate sequential enumeration vulnerabilities.
