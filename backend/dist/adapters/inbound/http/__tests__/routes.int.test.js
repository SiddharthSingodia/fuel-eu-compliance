"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/adapters/inbound/http/__tests__/routes.int.test.ts
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const prismaClient_1 = require("../../../outbound/postgres/prismaClient");
beforeAll(async () => {
    // optional: ensure test DB seeded (call seed script programmatically)
    // Or assume you ran npm run seed earlier
});
afterAll(async () => {
    await prismaClient_1.prisma.$disconnect();
});
describe('GET /routes', () => {
    it('returns array of routes', async () => {
        const res = await (0, supertest_1.default)(app_1.app).get('/routes').expect(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        const ids = res.body.map((r) => r.routeId);
        expect(ids).toEqual(expect.arrayContaining(['R001', 'R002', 'R003', 'R004', 'R005']));
    });
});
