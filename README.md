<div align="center">

  <img src="frontend/src/assets/logo/Logo.png" alt="Honatu Logo" width="110px">

# Honatu Hidroponia

### Full-Stack Residential Hydroponics & Workshop Platform

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white)](https://sequelize.org/)
[![Swagger](https://img.shields.io/badge/OpenAPI_3.0-85EA2D?style=flat-square&logo=swagger&logoColor=black)](https://swagger.io/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/ES_Modules-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

<p align="center">
  A production-ready e-commerce, service scheduling, and educational workshop platform built for Honatu in Queretaro, Mexico.
</p>

</div>

---

## Executive Summary

Honatu is an end-to-end digital platform designed for a residential hydroponics venture. It integrates an e-commerce catalog for modular farming systems, a real-time reservation engine for hands-on horticultural workshops, a customer service request portal, and an administrative back-office.

The project is structured as an **npm workspaces monorepo**, pairing a lightweight vanilla front-end architecture with an Express 5 and PostgreSQL REST backend.

---

## Engineering Highlights

- **Monorepo Architecture**: Clean separation of frontend and backend applications with unified dependency resolution and parallel development execution.
- **RESTful API with OpenAPI 3.0**: Fully documented backend using Swagger JSDoc and Swagger UI (`/api/docs`), providing interactive endpoint testing and a live JSON specification.
- **Relational Data Modeling**: Normalized PostgreSQL schema powered by Sequelize ORM, utilizing UUIDv4 primary keys, JSONB columns for flexible curricula, and explicit referential cascades.
- **Stateless Authentication & RBAC**: JWT-based authentication featuring salted bcrypt password hashing and tiered middleware guards (`CLIENT`, `ADMIN`, and optional guest checkout flows).
- **Zero-Framework Frontend**: Built with modern web standards (HTML5, Vanilla CSS design tokens, and native ES Modules) bundled through Vite for optimal performance and near-zero runtime overhead.

---

## Technology Stack

| Layer | Technologies | Purpose |
|---|---|---|
| **Frontend** | HTML5, CSS3, JavaScript (ESM), Vite 5, Chart.js | Multi-page UI, custom design system, and client-side charts |
| **Backend** | Node.js, Express 5, Sequelize 6 ORM | RESTful API, validation pipelines, and business logic |
| **Database** | PostgreSQL | Relational storage for users, catalog variants, orders, and workshops |
| **Security** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` | Stateless session management and password hashing |
| **Documentation** | OpenAPI 3.0, `swagger-ui-express`, `swagger-jsdoc` | Living, interactive API documentation |

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/dferram/Honatu-Hidroponia.git
cd Honatu-Hidroponia
npm install
```

### 2. Configure Environment
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your PostgreSQL credentials
```

### 3. Initialize Database
```bash
psql -U postgres -d honatu -f backend/schema.sql
```

### 4. Run Development Stack
```bash
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Interactive Swagger Docs**: `http://localhost:5000/api/docs`

---

## Detailed Documentation

For in-depth technical documentation, refer to the dedicated guides in the [`docs/`](./docs) directory:

- [System Architecture](./docs/architecture.md): Architectural topology, frontend module patterns, backend layering, and security flows.
- [API Reference](./docs/api.md): Complete endpoint listings, payload contracts, authentication headers, and error codes.
- [Database & Data Models](./docs/database.md): Schema design, entity descriptions, relationship mappings, and foreign key rules.
- [Local Setup Guide](./docs/setup-guide.md): Comprehensive developer onboarding, database provisioning, and build instructions.

---

## Author & Contact

**Fernando Ramirez** — Software Engineer
- **GitHub**: [@dferram](https://github.com/dferram)
- **Instagram**: [@honatu_hidroponia](https://instagram.com/honatu_hidroponia)
