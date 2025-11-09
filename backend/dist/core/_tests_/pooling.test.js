"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/core/__tests__/pooling.test.ts
const pooling_1 = require("../application/pooling");
describe('createPool', () => {
    test('valid pool simple allocation', () => {
        const members = [
            { shipId: 'S1', cbBefore: 100 },
            { shipId: 'S2', cbBefore: -60 },
            { shipId: 'S3', cbBefore: -40 },
        ];
        const res = (0, pooling_1.createPool)(members);
        expect(res.valid).toBe(true);
        // after allocation everyone should be zero
        const m1 = res.members.find((m) => m.shipId === 'S1');
        const m2 = res.members.find((m) => m.shipId === 'S2');
        const m3 = res.members.find((m) => m.shipId === 'S3');
        expect(m1.cbAfter).toBeCloseTo(0, 6);
        expect(m2.cbAfter).toBeCloseTo(0, 6);
        expect(m3.cbAfter).toBeCloseTo(0, 6);
    });
    test('invalid pool when sum negative', () => {
        const members = [
            { shipId: 'A', cbBefore: -10 },
            { shipId: 'B', cbBefore: -5 },
        ];
        const res = (0, pooling_1.createPool)(members);
        expect(res.valid).toBe(false);
        expect(res.details).toMatch(/Pool sum negative/);
    });
    test('surplus not becoming negative', () => {
        const members = [
            { shipId: 'S1', cbBefore: 50 },
            { shipId: 'S2', cbBefore: -30 },
            { shipId: 'S3', cbBefore: -10 },
        ];
        const res = (0, pooling_1.createPool)(members);
        expect(res.valid).toBe(true);
        const s1 = res.members.find((m) => m.shipId === 'S1');
        expect(s1.cbAfter).toBeGreaterThanOrEqual(0);
    });
});
