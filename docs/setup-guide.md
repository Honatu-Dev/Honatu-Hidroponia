# Local Setup & Development Guide

This guide walks through configuring the local development environment for the Honatu platform.

---

## 1. Prerequisites

Verify that the following tools are installed on your host machine:

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **PostgreSQL**: `v14.0` or higher
- **Git**

Verify your environment by running:
```bash
node -v
npm -v
psql --version
```

---

## 2. Repository Installation

Clone the repository and install all dependencies across the monorepo:

```bash
git clone https://github.com/dferram/Honatu-Hidroponia.git
cd Honatu-Hidroponia

# Install root, frontend, and backend packages
npm install
```

---

## 3. Database Configuration

1. Start your local PostgreSQL service:
   ```bash
   # Systemd (Linux)
   sudo systemctl start postgresql

   # Homebrew (macOS)
   brew services start postgresql
   ```

2. Create a database instance and dedicated user:
   ```sql
   -- Access psql as postgres superuser
   sudo -u postgres psql

   -- Create database
   CREATE DATABASE honatu;

   -- Optional: Create user if needed
   CREATE USER honatu_user WITH ENCRYPTED PASSWORD 'local_dev_password';
   GRANT ALL PRIVILEGES ON DATABASE honatu TO honatu_user;
   \q
   ```

3. Initialize the schema using the DDL script:
   ```bash
   psql -U postgres -d honatu -f backend/schema.sql
   ```

---

## 4. Environment Variables

Create a `.env` file inside the `backend/` directory by copying `backend/.env.example`:

```bash
cp backend/.env.example backend/.env
```

Configure your credentials inside `backend/.env`:

```ini
PORT=5000
JWT_SECRET=super_secure_random_string_for_local_development

# PostgreSQL Connection Credentials
DB_HOST=localhost
DB_NAME=honatu
DB_USER=postgres
DB_PASS=your_postgres_password
```

---

## 5. Running the Application

### Option A: Run Both Services Concurrently (Recommended)
From the root directory, launch the unified dev script:

```bash
npm run dev
```
This boots:
- The backend API server on `http://localhost:5000` with Node.js file watching.
- The Vite frontend development server on `http://localhost:5173`.

### Option B: Run Services Independently
Open two separate terminal tabs:

**Terminal 1 (Backend)**:
```bash
npm run dev:backend
# Or directly from the subdirectory:
cd backend && npm run dev
```

**Terminal 2 (Frontend)**:
```bash
npm run dev:frontend
# Or directly from the subdirectory:
cd frontend && npm run dev
```

---

## 6. Verifying the Installation

1. **Verify Backend Health**:
   ```bash
   curl http://localhost:5000/api/health
   # Expected output: {"status":"ok","message":"Honatu Backend is running!"}
   ```

2. **Access Swagger UI**:
   Open `http://localhost:5000/api/docs` in your browser to interact with the API endpoints.

3. **Access Frontend**:
   Open `http://localhost:5173` to explore the client application.

---

## 7. Production Build

To test the production client build locally:

```bash
# Build the frontend bundle
npm run build:frontend

# Preview the built assets
cd frontend && npm run preview
```
Production assets are generated in `frontend/dist/`.
