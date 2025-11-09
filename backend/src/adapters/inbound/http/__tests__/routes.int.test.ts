// backend/src/adapters/inbound/http/__tests__/routes.int.test.ts
import request from 'supertest';
import { app } from '../app';
import { prisma } from '../../../outbound/postgres/prismaClient';

beforeAll(async () => {
  // optional: ensure test DB seeded (call seed script programmatically)
  // Or assume you ran npm run seed earlier
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /routes', () => {
  it('returns array of routes', async () => {
    const res = await request(app).get('/routes').expect(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    const ids = res.body.map((r: any) => r.routeId);
    expect(ids).toEqual(expect.arrayContaining(['R001','R002','R003','R004','R005']));
  });
});
