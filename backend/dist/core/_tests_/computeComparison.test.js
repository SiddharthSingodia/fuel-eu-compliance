"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/core/__tests__/computeComparison.test.ts
const computeComparison_1 = require("../application/computeComparison");
describe('computeComparison', () => {
    test('percentDiff and compliance with default threshold 0', () => {
        const base = 90;
        const comp = 88;
        const { percentDiff, compliant } = (0, computeComparison_1.computeComparison)(base, comp, 0);
        // ((88/90)-1)*100 = (-0.02222...)*100 = -2.222...
        expect(percentDiff).toBeCloseTo(((88 / 90) - 1) * 100, 6);
        expect(compliant).toBe(true); // percentDiff negative -> better -> compliant
    });
    test('handle zero baseline', () => {
        const r = (0, computeComparison_1.computeComparison)(0, 88);
        expect(r.percentDiff).toBe(0);
        expect(r.compliant).toBe(false);
    });
});
