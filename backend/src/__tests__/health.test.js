import request from 'supertest';
import app from '../app.js';

describe('Health Endpoint', () => {
  describe('GET /api/health', () => {
    it('should return 200 with status ok', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('message');
    });

    it('should return correct message', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.body.message).toBe('Honatu Backend is running!');
    });
  });
});
