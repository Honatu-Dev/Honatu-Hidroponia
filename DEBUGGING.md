# Debugging Guide - Honatu Hydroponics

## Console Logs for Verifying Database Operations

The backend includes detailed `console.log` statements to verify that data is being correctly saved to the database without needing direct access to PostgreSQL.

### How to View Logs

When running the backend with:
```bash
npm run dev
```

Logs will appear in the terminal where the server is running. Look for messages with these prefixes:

### Log Prefixes

| Prefix | Meaning |
|--------|---------|
| [SERVICE_REQUEST] | Service requests (contact, quotes, advisory) |
| [ORDER] | Purchase orders |
| [CART] | Cart operations |
| [PRODUCT] | Product operations |
| [WORKSHOP] | Workshop enrollments |
| [AUTH] | Authentication and tokens |
| SUCCESS | Operation completed successfully |
| ERROR_* | Specific error type (see description) |

### Monitored Operations

#### 1. **Service Requests** (Contact, Quotes, Advisory)
```
[SERVICE_REQUEST] Creating request: { serviceType, details, requestedDate, location, guestName, guestEmail }
[SERVICE_REQUEST] SUCCESS: Authenticated user request: [userId]
[SERVICE_REQUEST] SUCCESS: Guest request: { guestName, guestEmail }
[SERVICE_REQUEST] SUCCESS: Saved to database: [requestId]
[SERVICE_REQUEST] ERROR_VALIDATION: Missing guest data
[SERVICE_REQUEST] ERROR_DATABASE: [error message]
```

#### 2. **Purchase Orders**
```
[ORDER] Creating order for user: [userId]
[ORDER] Items: [array of items]
[ORDER] Shipping address: [address]
[ORDER] SUCCESS: Stock updated: { product, newStock }
[ORDER] SUCCESS: Order created: { orderId, total }
[ORDER] SUCCESS: Order items saved: [quantity]
[ORDER] SUCCESS: Transaction completed
[ORDER] ERROR_PRODUCT_UNAVAILABLE: [productId]
[ORDER] ERROR_INSUFFICIENT_STOCK: { product, requested, available }
[ORDER] ERROR_DATABASE: [error message]
```

#### 3. **Shopping Cart**
```
[CART] Adding to cart: { userId, productVariantId, quantity }
[CART] SUCCESS: New item added: { itemId, quantity }
[CART] SUCCESS: Quantity updated: { itemId, newQuantity }
[CART] ERROR_PRODUCT_UNAVAILABLE: [productId]
[CART] ERROR_DATABASE: [error message]
```

#### 4. **Products**
```
[PRODUCT] Creating product: { name, category, isActive }
[PRODUCT] SUCCESS: Product created: [productId]
```

#### 5. **Workshops**
```
[WORKSHOP] Enrolling to workshop: { workshopId, guestName, userId }
[WORKSHOP] Enrollment count: [count] of [capacity]
[WORKSHOP] SUCCESS: Authenticated user enrollment: [userId]
[WORKSHOP] ERROR_NOT_FOUND: [workshopId]
[WORKSHOP] ERROR_FULL: Workshop is at capacity
[WORKSHOP] ERROR_ALREADY_ENROLLED: User already enrolled
[WORKSHOP] ERROR_VALIDATION: Missing guest data
```

#### 6. **Authentication**
```
[AUTH] SUCCESS: User authenticated: { email, role, path }
[AUTH] ERROR_NO_TOKEN: [METHOD] [PATH]
[AUTH] ERROR_INVALID_TOKEN: [error message]
```

### Complete Flow Example

When a user submits a contact form, you should see:

```
[SERVICE_REQUEST] Creating request: { serviceType: 'contacto', details: '...', guestName: 'Juan', guestEmail: 'juan@example.com' }
[SERVICE_REQUEST] SUCCESS: Guest request: { guestName: 'Juan', guestEmail: 'juan@example.com' }
[SERVICE_REQUEST] SUCCESS: Saved to database: 550e8400-e29b-41d4-a716-446655440000
```

If you see these logs, it means the data was saved correctly to the database.

### Troubleshooting

1. **No SUCCESS logs**: Check for an ERROR_* message before it
2. **ERROR_VALIDATION**: Verify that required fields are provided
3. **ERROR_INSUFFICIENT_STOCK**: Create products with stock from the admin panel
4. **ERROR_FULL**: Increase workshop capacity or create a new workshop
5. **ERROR_INVALID_TOKEN**: Make sure you are properly authenticated
6. **ERROR_DATABASE**: Check PostgreSQL connection

### Creating Test Data

To test the system without accessing the database:

```bash
# 1. Create an admin user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin Test",
    "email": "admin@test.com",
    "password": "Test123!"
  }'

# 2. Create a product (requires admin token)
TOKEN="[your_token_here]"
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "Description",
    "category": "Seeds",
    "isActive": true,
    "variants": [
      {
        "sku": "TEST-001",
        "price": "100.00",
        "stock": 50
      }
    ]
  }'

# 3. Submit a contact form
curl -X POST http://localhost:5000/api/service-requests \
  -H "Content-Type: application/json" \
  -d '{
    "serviceType": "contacto",
    "details": "Test message",
    "guestName": "Test User",
    "guestEmail": "test@example.com"
  }'
```

After each operation, check the backend terminal logs to confirm the data was saved correctly.

### Log Format

All logs follow this format:

```
[CATEGORY] ACTION: details
[CATEGORY] SUCCESS: operation_details
[CATEGORY] ERROR_TYPE: error_details
```

This makes it easy to:
- Filter logs by category (grep "[CATEGORY]")
- Identify successful operations (grep "SUCCESS")
- Identify failures (grep "ERROR_")
- Track specific operations (grep "Creating\|Saved\|Updated")
