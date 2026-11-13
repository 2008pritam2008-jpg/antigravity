// server/tests/integration/healthAndApi.test.js
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app.js';

describe('API Integration Endpoints', () => {
  it('GET /api/v1/health returns healthy operational status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
  });

  it('GET /api/v1/crops returns active crop catalog items', async () => {
    const res = await request(app).get('/api/v1/crops');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/crops/categories returns standard crop groupings', async () => {
    const res = await request(app).get('/api/v1/crops/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.some((c) => c.id === 'cereals')).toBe(true);
  });

  it('blocks unauthenticated access to protected /api/v1/farms', async () => {
    const res = await request(app).get('/api/v1/farms');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('allows authenticated access via demo bearer token', async () => {
    const res = await request(app)
      .get('/api/v1/farms')
      .set('Authorization', 'Bearer demo-token-farmer-001');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('creates a farm and verifies ownership', async () => {
    const newFarm = {
      farmName: 'Godavari Basin Plot 4',
      state: 'Maharashtra',
      district: 'Nashik',
      landArea: 4.2,
      areaUnit: 'acre',
      soilType: 'black soil',
      soilPh: 7.2,
      irrigationType: 'drip_system',
      waterAvailability: 'medium',
    };

    const res = await request(app)
      .post('/api/v1/farms')
      .set('Authorization', 'Bearer demo-token-farmer-001')
      .send(newFarm);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.farm_name).toBe(newFarm.farmName);
  });
});
