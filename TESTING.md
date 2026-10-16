# Testing Guide - Honatu Hydroponics

## Backend Tests

### Setup

The backend uses Jest as the testing framework and Supertest for HTTP assertions.

### Installation

Tests dependencies are already included in `package.json`. To install them:

```bash
cd backend
npm install
```

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode (re-run on file changes):**
```bash
npm run test:watch
```

**Run tests with coverage report:**
```bash
npm run test:coverage
```

### Test Structure

Tests are located in `src/__tests__/` directory with the naming convention:
- `*.test.js` for unit tests
- `*.spec.js` for integration tests

Example:
```
backend/
├── src/
│   ├── __tests__/
│   │   ├── health.test.js
│   │   ├── auth.test.js
│   │   └── service-requests.test.js
│   ├── controllers/
│   ├── models/
│   └── routes/
```

### Example Test

```javascript
import request from 'supertest';
import app from '../app.js';

describe('Health Endpoint', () => {
  describe('GET /api/health', () => {
    it('should return 200 with status ok', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
    });
  });
});
```

### Writing Tests

#### Unit Tests (Controllers)

Test individual controller functions:

```javascript
import { getProducts } from '../controllers/products.controller.js';

describe('Products Controller', () => {
  describe('getProducts', () => {
    it('should return active products', async () => {
      const req = { user: null };
      const res = {
        json: jest.fn()
      };

      await getProducts(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });
});
```

#### Integration Tests (Routes)

Test complete request/response cycles:

```javascript
import request from 'supertest';
import app from '../app.js';

describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return list of active products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
```

### Current Tests

- `health.test.js` - Tests the `/api/health` endpoint

### Planned Tests

Tests should be added for:
- Authentication endpoints (`/api/auth/*`)
- Service requests (`/api/service-requests`)
- Products (`/api/products`)
- Orders (`/api/orders`)
- Cart (`/api/cart`)
- Workshops (`/api/workshops`)

## Frontend Tests

Frontend testing setup is pending. When implemented, it will use:
- **Framework**: Vitest (Vue/Vite compatible)
- **Component Testing**: Vue Test Utils
- **E2E Testing**: Playwright or Cypress

### Running Frontend Tests (When Available)

```bash
cd frontend
npm test
```

## CI/CD Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Backend Tests
  run: cd backend && npm test

- name: Run Frontend Tests
  run: cd frontend && npm test
```

## Best Practices

1. **Test Coverage**: Aim for at least 80% code coverage
2. **Test Isolation**: Each test should be independent
3. **Descriptive Names**: Use clear, descriptive test names
4. **Mock External Services**: Mock database and API calls
5. **Test Both Success and Failure Cases**: Test happy paths and error scenarios

## Troubleshooting

### Tests Timeout

If tests timeout, increase the timeout in `jest.config.js`:

```javascript
testTimeout: 30000 // 30 seconds
```

### Database Connection Issues

Tests should use a test database. Configure in test setup:

```javascript
beforeAll(async () => {
  // Connect to test database
});

afterAll(async () => {
  // Disconnect from test database
});
```

### Port Already in Use

If port 5000 is already in use during tests, configure a different port:

```javascript
const testPort = process.env.TEST_PORT || 5001;
```
