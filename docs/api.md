# API Reference

This document provides a comprehensive overview of the RESTful API endpoints exposed by the Honatu backend service.

## Interactive Documentation

The service integrates OpenAPI 3.0 with interactive documentation interfaces:

- **Swagger UI**: `http://localhost:5000/api/docs`
- **OpenAPI 3.0 JSON Specification**: `http://localhost:5000/api/docs.json`

Developers and API consumers can test endpoints directly within Swagger UI or import the JSON specification into Postman, Insomnia, or client code generators.

---

## Authentication & Authorization

All authenticated requests must include the JSON Web Token (JWT) in the `Authorization` HTTP header:

```http
Authorization: Bearer <jwt_token>
```

### Access Levels
- **Public**: Accessible without credentials.
- **Guest / Authenticated**: Endpoints that support optional token injection. If a token is provided, the request is associated with the user account; otherwise, guest contact parameters are required.
- **Admin**: Requires a valid JWT where the user's role equals `ADMIN`. Unauthorized requests yield `401 Unauthorized` or `403 Forbidden`.

---

## Standard Error Response Format

Errors return standard HTTP status codes accompanied by a consistent JSON payload:

```json
{
  "message": "Descriptive error message"
}
```

| HTTP Status | Meaning | Typical Scenario |
|---|---|---|
| `200 OK` | Success | Successful resource retrieval or standard mutation |
| `201 Created` | Created | Resource successfully created (registration, new workshop) |
| `400 Bad Request` | Validation Failure | Missing required fields, invalid payloads, capacity reached |
| `401 Unauthorized` | Authentication Error | Missing, malformed, or expired JWT |
| `403 Forbidden` | Authorization Error | Valid token, but insufficient permissions (e.g., non-admin) |
| `404 Not Found` | Resource Missing | Workshop ID does not match any existing record |
| `500 Server Error` | Internal Failure | Unhandled database or runtime exceptions |

---

## Endpoints

### 1. Health & Diagnostics

#### `GET /api/health`
Returns the operational status of the API server.

- **Access**: Public
- **Response `200 OK`**:
```json
{
  "status": "ok",
  "message": "Honatu Backend is running!"
}
```

---

### 2. Authentication

#### `POST /api/auth/register`
Creates a new client account and initializes the corresponding `ClientProfile` record.

- **Access**: Public
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "Maria Gonzalez",
  "phone": "+52 55 1234 5678"
}
```
- **Responses**:
  - `201 Created`:
    ```json
    {
      "message": "Usuario creado exitosamente",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "7fa84d12-bf9e-4e31-893c-fa58913d9641",
        "email": "user@example.com",
        "role": "CLIENT",
        "fullName": "Maria Gonzalez"
      }
    }
    ```
  - `400 Bad Request`: Missing fields or email already registered.

#### `POST /api/auth/login`
Authenticates an existing user and returns a signed JWT valid for 30 days.

- **Access**: Public
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "message": "Login exitoso",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "7fa84d12-bf9e-4e31-893c-fa58913d9641",
        "email": "user@example.com",
        "role": "CLIENT"
      }
    }
    ```
  - `401 Unauthorized`: Invalid credentials.

#### `GET /api/auth/me`
Retrieves currently authenticated user information and associated client/admin profiles.

- **Access**: Authenticated (`requireAuth`)
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:
```json
{
  "user": {
    "id": "7fa84d12-bf9e-4e31-893c-fa58913d9641",
    "email": "user@example.com",
    "role": "CLIENT",
    "fullName": "Maria Gonzalez",
    "phone": "+52 55 1234 5678",
    "shippingAddress": "Av. Universidad 120, Queretaro",
    "createdAt": "2026-09-20T10:00:00.000Z"
  }
}
```
- **Response `401 Unauthorized`**: Token missing, malformed, or expired.

#### `PUT /api/auth/profile`
Updates contact information and shipping preferences for the active user.

- **Access**: Authenticated (`requireAuth`)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "fullName": "Maria Gonzalez Perez",
  "phone": "+52 442 987 6543",
  "shippingAddress": "Av. Universidad 120, Col. Centro, Queretaro, Qro. CP 76000"
}
```
- **Response `200 OK`**:
```json
{
  "message": "Perfil actualizado exitosamente",
  "user": {
    "id": "7fa84d12-bf9e-4e31-893c-fa58913d9641",
    "email": "user@example.com",
    "role": "CLIENT",
    "fullName": "Maria Gonzalez Perez",
    "phone": "+52 442 987 6543",
    "shippingAddress": "Av. Universidad 120, Col. Centro, Queretaro, Qro. CP 76000"
  }
}
```

#### `PUT /api/auth/change-password`
Modifies the account password after verifying current credentials.

- **Access**: Authenticated (`requireAuth`)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
```json
{
  "currentPassword": "SecurePassword123!",
  "newPassword": "NewStrongPassword456!"
}
```
- **Responses**:
  - `200 OK`: Password updated successfully.
  - `400 Bad Request`: Incorrect current password or invalid new password length.

---

### 3. Workshops

#### `GET /api/workshops`
Retrieves all registered workshops ordered chronologically by scheduled date.

- **Access**: Public
- **Response `200 OK`**:
```json
[
  {
    "id": "4ba3fc67-937d-41ae-8f3a-c322b7a9debf",
    "title": "Introduccion a la Hidroponia Casera",
    "description": "Fundamentos y sistemas NFT para el hogar.",
    "scheduledDate": "2026-10-15T16:00:00.000Z",
    "capacity": 20,
    "price": "350.00",
    "imageUrl": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae",
    "modality": "Presencial",
    "agenda": [
      "Principios basicos de hidroponia",
      "Sistemas NFT y Raiz Flotante",
      "Nutrientes y pH",
      "Practica de siembra"
    ],
    "createdAt": "2026-09-20T12:00:00.000Z",
    "updatedAt": "2026-09-20T12:00:00.000Z"
  }
]
```

#### `GET /api/workshops/my-enrollments`
Retrieves workshop enrollments for the logged-in user with nested workshop details.

- **Access**: Authenticated (`requireAuth`)
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:
```json
[
  {
    "id": "e305e552-3fb3-4f99-a86d-3e2840bfa120",
    "workshopId": "4ba3fc67-937d-41ae-8f3a-c322b7a9debf",
    "paymentStatus": "PENDING",
    "Workshop": {
      "id": "4ba3fc67-937d-41ae-8f3a-c322b7a9debf",
      "title": "Introduccion a la Hidroponia Casera",
      "description": "Fundamentos y sistemas NFT para el hogar.",
      "scheduledDate": "2026-10-15T16:00:00.000Z",
      "price": "350.00",
      "imageUrl": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae",
      "modality": "Presencial"
    }
  }
]
```

#### `POST /api/workshops/enroll`
Registers a participant in a workshop. Supports authenticated users and guest submissions.

- **Access**: Public / Authenticated (`optionalAuth`)
- **Headers**: `Authorization: Bearer <token>` (Optional)
- **Request Body (Guest Mode)**:
```json
{
  "workshopId": "4ba3fc67-937d-41ae-8f3a-c322b7a9debf",
  "guestName": "Juan Perez",
  "guestEmail": "juan.perez@example.com",
  "guestPhone": "+52 55 9876 5432"
}
```
- **Request Body (Authenticated Mode)**:
```json
{
  "workshopId": "4ba3fc67-937d-41ae-8f3a-c322b7a9debf"
}
```
- **Responses**:
  - `201 Created`:
    ```json
    {
      "message": "Inscripcion exitosa!",
      "enrollment": {
        "id": "e305e552-3fb3-4f99-a86d-3e2840bfa120",
        "workshopId": "4ba3fc67-937d-41ae-8f3a-c322b7a9debf",
        "paymentStatus": "PENDING",
        "guestName": "Juan Perez",
        "guestEmail": "juan.perez@example.com",
        "guestPhone": "+52 55 9876 5432",
        "userId": null,
        "createdAt": "2026-09-27T18:00:00.000Z",
        "updatedAt": "2026-09-27T18:00:00.000Z"
      }
    }
    ```
  - `400 Bad Request`: Workshop is full, participant already enrolled, or guest contact details missing.
  - `404 Not Found`: Workshop does not exist.

#### `POST /api/workshops`
Creates a new workshop record.

- **Access**: Admin (`requireAuth`, `requireAdmin`)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
```json
{
  "title": "Manejo Avanzado de Soluciones Nutritivas",
  "description": "Formulacion quimica y control de electroconductividad (EC).",
  "scheduledDate": "2026-11-10T10:00:00.000Z",
  "capacity": 15,
  "price": 499.00,
  "imageUrl": "https://images.unsplash.com/photo-1558449028-b53a39d100fc",
  "modality": "Online",
  "agenda": [
    "Calculo de sales fertilizantes",
    "Sistemas de recirculacion y desinfeccion",
    "Automatizacion con sensores IoT"
  ]
}
```
- **Responses**:
  - `201 Created`: Workshop created.
  - `401 Unauthorized`: Token missing or invalid.
  - `403 Forbidden`: User does not possess `ADMIN` privileges.
