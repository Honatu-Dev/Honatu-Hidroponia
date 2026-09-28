# Database Schema & Data Models

The Honatu platform uses PostgreSQL as its primary relational datastore, managed programmatically through Sequelize ORM.

---

## 1. Design Principles

- **UUID Primary Keys**: Every table uses a Version 4 Universally Unique Identifier (`UUIDv4`) as its primary key. This avoids enumeration attacks, eases data replication, and permits client-side ID pre-generation when necessary.
- **Normalized Schema**: Products and product variants are decoupled to accommodate multiple package sizes, nutrient volumes, and system dimensions without schema churn.
- **Referential Integrity**: Cascading deletes (`CASCADE`) and nullification (`SET NULL`) rules are explicitly defined on foreign keys to prevent orphaned records.
- **Audit Timestamps**: All tables track record lifecycle automatically via `createdAt` and `updatedAt` timestamps.

---

## 2. Entity Descriptions

### Identity & Access

#### `Users`
Central credential and identity store.
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique, Indexed, Not Null)
- `passwordHash` (VARCHAR, Not Null)
- `role` (ENUM: `'CLIENT'`, `'ADMIN'`, Default: `'CLIENT'`)
- `createdAt`, `updatedAt` (TIMESTAMP)

#### `ClientProfiles`
Stores profile data specific to retail and residential customers.
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key -> `Users.id`, Unique, Cascade on Delete)
- `fullName` (VARCHAR, Not Null)
- `phone` (VARCHAR)
- `shippingAddress` (VARCHAR)
- `createdAt`, `updatedAt` (TIMESTAMP)

#### `AdminProfiles`
Stores administrative metadata and department assignments.
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key -> `Users.id`, Unique, Cascade on Delete)
- `department` (VARCHAR)
- `createdAt`, `updatedAt` (TIMESTAMP)

---

### Education & Workshops

#### `Workshops`
Educational courses and training sessions.
- `id` (UUID, Primary Key)
- `title` (VARCHAR, Not Null)
- `description` (TEXT)
- `scheduledDate` (TIMESTAMP WITH TIME ZONE, Not Null)
- `capacity` (INTEGER, Not Null)
- `price` (DECIMAL(10, 2), Not Null)
- `imageUrl` (VARCHAR)
- `modality` (ENUM: `'Presencial'`, `'Online'`, `'Hibrido'`, Default: `'Presencial'`)
- `agenda` (JSONB) - Structured list of syllabus modules.
- `createdAt`, `updatedAt` (TIMESTAMP)

#### `WorkshopEnrollments`
Registration ledger tracking course participants. Supports both registered users and unauthenticated guests.
- `id` (UUID, Primary Key)
- `workshopId` (UUID, Foreign Key -> `Workshops.id`, Cascade on Delete)
- `userId` (UUID, Nullable, Foreign Key -> `Users.id`, Set Null on Delete)
- `guestName` (VARCHAR, Nullable) - Populated when `userId` is null.
- `guestEmail` (VARCHAR, Nullable) - Populated when `userId` is null.
- `guestPhone` (VARCHAR, Nullable)
- `paymentStatus` (ENUM: `'PENDING'`, `'PAID'`, Default: `'PENDING'`)
- `createdAt`, `updatedAt` (TIMESTAMP)

---

### Commerce & Orders

#### `Products`
Catalog definitions for systems, nutrients, and supplies.
- `id` (UUID, Primary Key)
- `name` (VARCHAR, Not Null)
- `description` (TEXT)
- `category` (VARCHAR, Not Null)
- `imageUrl` (VARCHAR)
- `isActive` (BOOLEAN, Default: `true`)
- `createdAt`, `updatedAt` (TIMESTAMP)

#### `ProductVariants`
Specific SKUs for a product (e.g., 1L vs 5L nutrients, 4-tier vs 6-tier vertical towers).
- `id` (UUID, Primary Key)
- `productId` (UUID, Foreign Key -> `Products.id`, Cascade on Delete)
- `sku` (VARCHAR, Unique, Not Null)
- `attributeName` (VARCHAR) - e.g., "Size", "Volume"
- `attributeValue` (VARCHAR) - e.g., "5 Liters", "36 Plant Sites"
- `price` (DECIMAL(10, 2), Not Null)
- `stock` (INTEGER, Default: 0)
- `createdAt`, `updatedAt` (TIMESTAMP)

#### `CartItems`
Persistent cart items for registered users.
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key -> `Users.id`, Cascade on Delete)
- `productVariantId` (UUID, Foreign Key -> `ProductVariants.id`, Cascade on Delete)
- `quantity` (INTEGER, Default: 1)
- `createdAt`, `updatedAt` (TIMESTAMP)

#### `Orders` & `OrderItems`
Finalized purchases capturing historic snapshots of pricing and item configuration.
- `Orders`: Stores `userId`, `totalAmount`, `shippingAddress`, and `status` (`'PENDING'`, `'PAID'`, `'SHIPPED'`, `'DELIVERED'`, `'CANCELLED'`).
- `OrderItems`: Records `orderId`, `productVariantId`, historical `unitPrice`, and `quantity`.

---

### Services

#### `ServiceRequests`
Tracks inquiries for technical maintenance, water analysis, and residential installation.
- `id` (UUID, Primary Key)
- `userId` (UUID, Nullable, Foreign Key -> `Users.id`)
- `serviceType` (VARCHAR, Not Null)
- `preferredDate` (TIMESTAMP)
- `status` (ENUM: `'PENDING'`, `'CONFIRMED'`, `'COMPLETED'`, Default: `'PENDING'`)
- `notes` (TEXT)
- `createdAt`, `updatedAt` (TIMESTAMP)

---

## 3. Relationships Summary Table

| Source Entity | Relationship | Target Entity | Foreign Key | Constraint |
|---|---|---|---|---|
| `User` | HasOne | `ClientProfile` | `userId` | `ON DELETE CASCADE` |
| `User` | HasOne | `AdminProfile` | `userId` | `ON DELETE CASCADE` |
| `User` | HasMany | `WorkshopEnrollment` | `userId` | `ON DELETE SET NULL` |
| `Workshop` | HasMany | `WorkshopEnrollment` | `workshopId` | `ON DELETE CASCADE` |
| `Product` | HasMany | `ProductVariant` | `productId` | `ON DELETE CASCADE` |
| `User` | HasMany | `CartItem` | `userId` | `ON DELETE CASCADE` |
| `ProductVariant` | HasMany | `CartItem` | `productVariantId` | `ON DELETE CASCADE` |
| `User` | HasMany | `Order` | `userId` | `ON DELETE RESTRICT` |
| `Order` | HasMany | `OrderItem` | `orderId` | `ON DELETE CASCADE` |
| `ProductVariant` | HasMany | `OrderItem` | `productVariantId` | `ON DELETE RESTRICT` |

---

## 4. DDL & Migrations

The full SQL schema definition is maintained in `backend/schema.sql`. You can initialize or restore the schema directly using the PostgreSQL command-line tool:

```bash
psql -h <host> -U <user> -d <database> -f backend/schema.sql
```
