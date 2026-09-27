# Entity-Relationship (E-R) Model — Honatu Hidroponía

This document specifies the complete **Entity-Relationship (E-R) Model** for the relational database of **Honatu Hidroponía**. The design follows the platform's unified architecture, allowing both **Clients** (purchases, workshop registrations, service requests, guide browsing) and **Administrators** (catalog management, inventory, workshop moderation, quote tracking, and auditing) to interact securely through a single system.

> **Changelog vs. previous version:** added `PERMISSION` / `ROLE_PERMISSION` (referenced in the text but never modeled), added `PRODUCT_REVIEW` (referenced in the global diagram but never defined), added the `STATE_MX` catalog (Mexican states) to replace the free-text `state` field, and renamed every entity/attribute to English.

---

## 1. System Overview

The database is structured into **8 main modules**:

1. **Users, Roles & Authentication**: Unified identity management (`USER`, `CLIENT_PROFILE`, `ADMIN_PROFILE`, `ROLE`, `PERMISSION`, `ROLE_PERMISSION`).
2. **Address Catalog**: Normalized reference data for shipping and profiles (`STATE_MX`).
3. **Store Catalog (E-Commerce)**: Separation of master product and variants (`PRODUCT_MASTER`, `PRODUCT_VARIANT`, `CATEGORY`, `PRODUCT_IMAGE`, `PRODUCT_REVIEW`).
4. **Sales & Transactions**: Purchases, favorites and carts (`ORDER`, `ORDER_ITEM`, `CART_ITEM`, `FAVORITE`).
5. **Workshops & Training**: Educational offerings and registrations (`WORKSHOP`, `WORKSHOP_REGISTRATION`).
6. **Specialized Services**: Technical projects and consultations (`SERVICE_REQUEST`, `GREENHOUSE_CONSTRUCTION`, `TECHNICAL_ADVISORY`, `SERVICE_QUOTE`).
7. **Education & Guides**: Content portal (`EDUCATIONAL_GUIDE`, `GUIDE_RESOURCE`).
8. **Administration & Audit**: Traceability and control (`AUDIT_LOG`).

---

## 2. Global Entity-Relationship Diagram

```mermaid
erDiagram
    %% --- USERS, ROLES & PERMISSIONS ---
    ROLE ||--|{ USER : "assigned to"
    ROLE ||--o{ ROLE_PERMISSION : "grants"
    PERMISSION ||--o{ ROLE_PERMISSION : "granted via"
    USER ||--o| CLIENT_PROFILE : "extends with"
    USER ||--o| ADMIN_PROFILE : "extends with"

    %% --- ADDRESS CATALOG ---
    STATE_MX ||--o{ CLIENT_PROFILE : "located in"

    %% --- PRODUCT CATALOG ---
    CATEGORY ||--o{ PRODUCT_MASTER : "classifies"
    PRODUCT_MASTER ||--|{ PRODUCT_VARIANT : "contains variants"
    PRODUCT_MASTER ||--o{ PRODUCT_IMAGE : "has gallery"
    PRODUCT_MASTER ||--o{ PRODUCT_REVIEW : "receives reviews"
    CLIENT_PROFILE ||--o{ PRODUCT_REVIEW : "writes"

    %% --- SALES & CART ---
    CLIENT_PROFILE ||--o{ CART_ITEM : "keeps in cart"
    PRODUCT_VARIANT ||--o{ CART_ITEM : "is in cart"
    CLIENT_PROFILE ||--o{ FAVORITE : "marks as favorite"
    PRODUCT_MASTER ||--o{ FAVORITE : "is favorited"

    CLIENT_PROFILE ||--o{ ORDER : "places"
    ORDER ||--|{ ORDER_ITEM : "is made up of"
    PRODUCT_VARIANT ||--o{ ORDER_ITEM : "is sold as"

    %% --- WORKSHOPS & EVENTS ---
    ADMIN_PROFILE ||--o{ WORKSHOP : "creates/organizes"
    WORKSHOP ||--o{ WORKSHOP_REGISTRATION : "receives registrations"
    CLIENT_PROFILE ||--o{ WORKSHOP_REGISTRATION : "enrolls in"

    %% --- SPECIALIZED SERVICES ---
    CLIENT_PROFILE ||--o{ SERVICE_REQUEST : "submits"
    SERVICE_REQUEST ||--o| GREENHOUSE_CONSTRUCTION : "specifies project"
    SERVICE_REQUEST ||--o| TECHNICAL_ADVISORY : "specifies consultation"
    ADMIN_PROFILE ||--o{ SERVICE_QUOTE : "issues"
    SERVICE_REQUEST ||--o{ SERVICE_QUOTE : "receives"

    %% --- EDUCATION & GUIDES ---
    ADMIN_PROFILE ||--o{ EDUCATIONAL_GUIDE : "writes/publishes"
    EDUCATIONAL_GUIDE ||--o{ GUIDE_RESOURCE : "attaches material"

    %% --- ADMINISTRATIVE AUDIT ---
    ADMIN_PROFILE ||--o{ AUDIT_LOG : "generates event"
```

---

## 3. E-R Diagrams by Module

### Module 1: Users, Roles, Permissions & Profiles

Allows administrators and clients to share the same credential engine while differentiating permissions and profile information. `PERMISSION` and `ROLE_PERMISSION` were added so access control is actually modeled instead of only relying on a fixed `role_id` per user.

```mermaid
erDiagram
    ROLE {
        bigint id PK
        string name UK "ADMIN, CLIENT, TECHNICIAN"
        string description
    }
    PERMISSION {
        bigint id PK
        string code UK "MANAGE_PRODUCTS, MANAGE_ORDERS, MANAGE_WORKSHOPS, ..."
        string description
    }
    ROLE_PERMISSION {
        bigint role_id PK, FK
        bigint permission_id PK, FK
    }
    USER {
        bigint id PK
        string email UK
        string password_hash
        bigint role_id FK
        boolean is_active
        timestamp last_login_at
        timestamp created_at
    }
    CLIENT_PROFILE {
        bigint id PK
        bigint user_id FK, UK
        string full_name
        string phone
        string street_address
        string city
        bigint state_id FK
        string postal_code
    }
    ADMIN_PROFILE {
        bigint id PK
        bigint user_id FK, UK
        string full_name
        string department
        string corporate_phone
    }

    ROLE ||--|{ USER : "assigned to"
    ROLE ||--o{ ROLE_PERMISSION : "grants"
    PERMISSION ||--o{ ROLE_PERMISSION : "granted via"
    USER ||--o| CLIENT_PROFILE : "extends with"
    USER ||--o| ADMIN_PROFILE : "extends with"
```

---

### Module 2: Address Catalog (Mexican States)

New module. Normalizes `CLIENT_PROFILE.state`, which previously was a free-text field with no referential integrity. Also enables consistent shipping-cost rules and sales-by-region reporting.

```mermaid
erDiagram
    STATE_MX {
        tinyint id PK "INEGI code, 1-32"
        string name UK
    }
    CLIENT_PROFILE {
        bigint id PK
        bigint state_id FK
    }

    STATE_MX ||--o{ CLIENT_PROFILE : "located in"
```

---

### Module 3: Store Catalog (Master Product & Variant)

Supports products with multiple configurations (e.g. A+B Nutrient Solution in 1L, 5L, 20L presentations; coconut fiber in 10L or 50L bags). `PRODUCT_REVIEW` was added — it appeared in the global diagram before but was never actually defined.

```mermaid
erDiagram
    CATEGORY {
        bigint id PK
        string name UK
        string slug UK
        string description
        bigint parent_category_id FK
    }
    PRODUCT_MASTER {
        bigint id PK
        string name
        string slug UK
        text description
        bigint category_id FK
        boolean is_active
        timestamp created_at
    }
    PRODUCT_VARIANT {
        bigint id PK
        bigint product_master_id FK
        string sku UK
        string variant_name "e.g. 1 Liter, 5 Liters"
        decimal price
        decimal discount_price
        int stock_available
        decimal weight_kg
        boolean is_default
        boolean is_active
    }
    PRODUCT_IMAGE {
        bigint id PK
        bigint product_master_id FK
        string cloudinary_url
        string cloudinary_public_id
        int display_order
        boolean is_cover
    }
    PRODUCT_REVIEW {
        bigint id PK
        bigint product_master_id FK
        bigint client_id FK
        tinyint rating "1 to 5"
        text comment
        boolean is_approved
        timestamp created_at
    }

    CATEGORY ||--o{ PRODUCT_MASTER : "belongs to"
    PRODUCT_MASTER ||--|{ PRODUCT_VARIANT : "has"
    PRODUCT_MASTER ||--o{ PRODUCT_IMAGE : "has images"
    PRODUCT_MASTER ||--o{ PRODUCT_REVIEW : "receives"
```

---

### Module 4: Sales, Orders, Cart & Favorites

```mermaid
erDiagram
    CART_ITEM {
        bigint id PK
        bigint client_id FK
        bigint product_variant_id FK
        int quantity
        timestamp updated_at
    }
    FAVORITE {
        bigint id PK
        bigint client_id FK
        bigint product_master_id FK
        timestamp added_at
    }
    ORDER {
        bigint id PK
        bigint client_id FK
        string order_number UK
        decimal subtotal
        decimal shipping_cost
        decimal total
        string order_status "PENDING, PAID, SHIPPED, DELIVERED, CANCELLED"
        string payment_status "PENDING, APPROVED, REJECTED"
        string payment_method "CARD, MERCADOPAGO, TRANSFER"
        json shipping_address_snapshot "includes state_id/name at time of order"
        timestamp ordered_at
    }
    ORDER_ITEM {
        bigint id PK
        bigint order_id FK
        bigint product_variant_id FK
        string product_name_snapshot
        string sku_snapshot
        decimal unit_price
        int quantity
        decimal subtotal
    }

    CLIENT_PROFILE ||--o{ CART_ITEM : "keeps in cart"
    PRODUCT_VARIANT ||--o{ CART_ITEM : "referenced by"
    CLIENT_PROFILE ||--o{ FAVORITE : "marks as favorite"
    PRODUCT_MASTER ||--o{ FAVORITE : "referenced by"
    CLIENT_PROFILE ||--o{ ORDER : "places"
    ORDER ||--|{ ORDER_ITEM : "contains"
    PRODUCT_VARIANT ||--o{ ORDER_ITEM : "sold as"
```

---

### Module 5: Workshops & Training

Allows administrators to publish workshops (in-person or online) and clients to register and manage their seats.

```mermaid
erDiagram
    WORKSHOP {
        bigint id PK
        string title
        string slug UK
        text description
        string type "IN_PERSON, ONLINE"
        datetime start_date
        datetime end_date
        string location_or_link
        decimal price
        int max_capacity
        int reserved_slots
        string status "DRAFT, PUBLISHED, FINISHED, CANCELLED"
        bigint creator_admin_id FK
        timestamp created_at
    }
    WORKSHOP_REGISTRATION {
        bigint id PK
        bigint workshop_id FK
        bigint client_id FK
        string registration_status "CONFIRMED, WAITLISTED, CANCELLED"
        string payment_status "PENDING, PAID, REFUNDED"
        string payment_proof_url
        timestamp registered_at
    }

    ADMIN_PROFILE ||--o{ WORKSHOP : "creates/organizes"
    WORKSHOP ||--o{ WORKSHOP_REGISTRATION : "receives registrations"
    CLIENT_PROFILE ||--o{ WORKSHOP_REGISTRATION : "enrolls in"
```

---

### Module 6: Specialized Services (Greenhouse Construction & Advisory)

```mermaid
erDiagram
    SERVICE_REQUEST {
        bigint id PK
        bigint client_id FK
        string service_type "ADVISORY, CONSTRUCTION, WHOLESALE_SUPPLIES"
        string status "PENDING, IN_REVIEW, QUOTED, ACCEPTED, REJECTED, FINISHED"
        string contact_name
        string contact_email
        string contact_phone
        text additional_notes
        timestamp requested_at
    }
    GREENHOUSE_CONSTRUCTION {
        bigint id PK
        bigint service_request_id FK, UK
        decimal surface_m2
        string structure_type "TUNNEL, MULTI-SPAN, MESH_CROP, CUSTOM"
        string target_crop "TOMATO, LETTUCE, BERRIES, OTHER"
        string project_location
        decimal estimated_budget
    }
    TECHNICAL_ADVISORY {
        bigint id PK
        bigint service_request_id FK, UK
        string modality "ONLINE, ON_SITE"
        string main_topic "NUTRITION, PEST_CONTROL, SYSTEM_DESIGN, DIAGNOSIS"
        text problem_description
        datetime suggested_date
        bigint assigned_admin_id FK
    }
    SERVICE_QUOTE {
        bigint id PK
        bigint service_request_id FK
        bigint issuing_admin_id FK
        decimal total_amount
        json breakdown_detail
        datetime valid_until
        string status "ISSUED, ACCEPTED, EXPIRED"
        timestamp issued_at
    }

    SERVICE_REQUEST ||--o| GREENHOUSE_CONSTRUCTION : "has detail"
    SERVICE_REQUEST ||--o| TECHNICAL_ADVISORY : "has detail"
    SERVICE_REQUEST ||--o{ SERVICE_QUOTE : "receives quotes"
```

---

### Module 7: Education & Guides

```mermaid
erDiagram
    EDUCATIONAL_GUIDE {
        bigint id PK
        string title
        string slug UK
        string summary
        text markdown_content
        string category "NUTRIENTS, SUBSTRATES, SYSTEMS, PESTS"
        string cover_image_url
        boolean is_published
        int read_count
        bigint author_admin_id FK
        timestamp published_at
    }
    GUIDE_RESOURCE {
        bigint id PK
        bigint guide_id FK
        string file_name
        string download_url
        string file_type "PDF, EXCEL_CALCULATOR, INFOGRAPHIC"
    }

    EDUCATIONAL_GUIDE ||--o{ GUIDE_RESOURCE : "attaches downloadable material"
```

---

### Module 8: Admin Panel & Audit

```mermaid
erDiagram
    AUDIT_LOG {
        bigint id PK
        bigint admin_id FK
        string action "CREATE_PRODUCT, UPDATE_STOCK, CHANGE_ORDER_STATUS, ISSUE_QUOTE"
        string affected_table
        bigint affected_record_id
        json previous_data
        json new_data
        string ip_address
        timestamp created_at
    }
```

---

## 4. Summary of Changes From the Original Diagram

| Change | Reason |
| :--- | :--- |
| Added `PERMISSION` and `ROLE_PERMISSION` | Referenced in the module description but never modeled — access control was only a single fixed `role_id`. |
| Added `PRODUCT_REVIEW` | Appeared in the original global diagram (linked to `PRODUCT_MASTER` and `CLIENT_PROFILE`) but was never defined as an entity. |
| Added `STATE_MX` catalog and `CLIENT_PROFILE.state_id` (FK) | Replaces the free-text `state` field, which allowed inconsistent values (e.g. "Qro", "Querétaro", "QUERETARO") and broke reporting/filtering by region. Also needed for shipping-cost rules by state in `ORDER`. |
| Renamed all entities/attributes to English | Per request. |
| Noted `ORDER.shipping_address_snapshot` should carry `state_id` | Keeps historical orders reportable by state even though the snapshot is denormalized on purpose (address may change after the order is placed). |