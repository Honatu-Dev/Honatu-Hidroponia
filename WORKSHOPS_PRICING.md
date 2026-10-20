# Workshops Pricing

## Current Workshop Prices

All workshops now have pricing configured in the database:

| Workshop Title | Price | Date | Capacity | Modality |
|---|---|---|---|---|
| Introducción a la Hidroponía | $100.00 | 2023-11-15 | 30 | Presencial |
| De la duda a la cosecha: Hablemos de hidroponía | $120.00 | 2026-09-30 | 100 | Online |
| Huertos Hidropónicos en casa (Nivel I) | $150.00 | 2026-10-05 | 30 | Presencial |
| Hidroponia General (Nivel II) | $180.00 | 2026-10-10 | 30 | Presencial |
| Nivel 1 - Fundamentos de Hidroponía | $150.00 | 2026-11-17 | 30 | Presencial |
| Nivel 2 - Sistemas Avanzados de Hidroponía | $200.00 | 2026-11-19 | 25 | Presencial |
| Introducción a la Hidroponía Comercial | $250.00 | 2026-12-05 | 20 | Presencial |

## Price Updates Applied

The following workshops had their prices updated from $0.00 to actual values:

1. **Introducción a la Hidroponía** - Updated to $100.00
2. **De la duda a la cosecha: Hablemos de hidroponía** - Updated to $120.00
3. **Huertos Hidropónicos en casa (Nivel I)** - Updated to $150.00
4. **Hidroponia General (Nivel II)** - Updated to $180.00

## API Endpoint

To view all workshops with pricing:

```bash
GET http://localhost:5000/api/workshops
```

Response includes price for each workshop:
```json
{
  "id": "39da957e-33ee-4142-b78d-6505c22cd45c",
  "title": "Introducción a la Hidroponía",
  "price": "100.00",
  "scheduledDate": "2023-11-15T10:00:00.000Z"
}
```

## Updating Workshop Prices

To update a workshop price via API:

```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@honatu.com",
    "password": "Admin123!"
  }' | jq -r '.token')

curl -X PUT http://localhost:5000/api/workshops/{WORKSHOP_ID} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"price": 150}'
```

## Notes

- All prices are stored in the PostgreSQL database
- Prices are displayed in the workshop listing and enrollment pages
- Prices are used in the order calculation when users enroll in workshops
- Workshop prices can be updated through the admin panel or API
