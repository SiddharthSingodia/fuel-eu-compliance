// backend/src/core/__tests__/computeCB.test.ts
import { computeCB, ENERGY_PER_TONNE_MJ } from '../application/computeCB';

describe('computeCB', () => {
  test('returns zeros for invalid fuel', () => {
    const r = computeCB(89.3368, 91.0, 0);
    expect(r.energyMJ).toBe(0);
    expect(r.cbGrams).toBe(0);
    expect(r.cbTonnes).toBe(0);
  });

  test('R001 calculation matches manual digits (seed data)', () => {
    // R001: target 89.3368, actual 91.0, fuel 5000
    const { energyMJ, cbGrams, cbTonnes } = computeCB(89.3368, 91.0, 5000);
    // energy = 5000 * 41000 = 205000000
    expect(energyMJ).toBe(5000 * ENERGY_PER_TONNE_MJ);
    // cb grams = (89.3368 - 91.0) * 205000000 = -1.6632 * 205000000 = -340956000
    expect(cbGrams).toBeCloseTo(-340956000, 0);
    // cb tonnes = -340.956
    expect(cbTonnes).toBeCloseTo(-340.956, 3);
  });

  test('positive CB example (R002 seed)', () => {
    // R002: target 89.3368, actual 88.0, fuel 4800
    const { cbTonnes } = computeCB(89.3368, 88.0, 4800);
    // (89.3368 - 88.0) = 1.3368; energy = 4800 * 41000 = 196800000
    // cb grams = 1.3368 * 196800000 = 263082240 -> tonnes = 263.08224
    expect(cbTonnes).toBeCloseTo(263.08224, 5);
  });

  test('handles non-finite input gracefully', () => {
    // @ts-ignore
    const r = computeCB(NaN, 90, 1000);
    expect(r.cbTonnes).toBe(0);
  });
});
