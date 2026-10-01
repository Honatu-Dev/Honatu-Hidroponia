-- ==========================================
-- Honatu PostgreSQL Schema Definition
-- ==========================================

-- NOTA: Como estás usando PostgreSQL 13+, podemos usar la función nativa gen_random_uuid() 
-- en lugar de la extensión uuid-ossp que tu servidor no tiene instalada.

-- ==========================================
-- DEFINICIÓN DE TIPOS DE DATOS (ENUMS)
-- ==========================================
CREATE TYPE user_role AS ENUM ('CLIENT', 'ADMIN');
CREATE TYPE order_status AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED');
CREATE TYPE service_status AS ENUM ('PENDING', 'REVIEW', 'ACCEPTED', 'COMPLETED', 'REJECTED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID');

-- ==========================================
-- 1. USUARIOS Y PERFILES (Autenticación)
-- ==========================================
CREATE TABLE "Users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" user_role DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ClientProfiles" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID UNIQUE REFERENCES "Users"("id") ON DELETE CASCADE,
    "fullName" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "shippingAddress" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AdminProfiles" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID UNIQUE REFERENCES "Users"("id") ON DELETE CASCADE,
    "fullName" VARCHAR(255) NOT NULL,
    "department" VARCHAR(100),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. CATÁLOGO Y E-COMMERCE
-- ==========================================
CREATE TABLE "Products" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(100),
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ProductVariants" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "productId" UUID REFERENCES "Products"("id") ON DELETE CASCADE,
    "sku" VARCHAR(100) UNIQUE NOT NULL,
    "attributes" JSONB, 
    "price" DECIMAL(10, 2) NOT NULL,
    "stock" INTEGER DEFAULT 0,
    "imageUrls" TEXT[], 
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. CARRITO DE COMPRAS Y PEDIDOS
-- ==========================================
CREATE TABLE "CartItems" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES "Users"("id") ON DELETE CASCADE,
    "productVariantId" UUID REFERENCES "ProductVariants"("id") ON DELETE CASCADE,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Orders" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES "Users"("id"),
    "totalAmount" DECIMAL(10, 2) NOT NULL,
    "status" order_status DEFAULT 'PENDING',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OrderItems" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "orderId" UUID REFERENCES "Orders"("id") ON DELETE CASCADE,
    "productVariantId" UUID REFERENCES "ProductVariants"("id"),
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10, 2) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. SERVICIOS Y TALLERES (EDUCACIÓN)
-- ==========================================
CREATE TABLE "ServiceRequests" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES "Users"("id"),
    "serviceType" VARCHAR(100) NOT NULL,
    "details" TEXT,
    "status" service_status DEFAULT 'PENDING',
    "requestedDate" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Workshops" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "scheduledDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "capacity" INTEGER NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL,
    "imageUrl" VARCHAR(255),
    "modality" VARCHAR(50) DEFAULT 'Presencial',
    "agenda" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "WorkshopEnrollments" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES "Users"("id") ON DELETE SET NULL, -- Nullable for guests
    "workshopId" UUID REFERENCES "Workshops"("id"),
    "paymentStatus" payment_status DEFAULT 'PENDING',
    "guestName" VARCHAR(255),
    "guestEmail" VARCHAR(255),
    "guestPhone" VARCHAR(50),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
