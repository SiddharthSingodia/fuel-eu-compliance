// backend/src/core/__tests__/banking.test.ts
import { bankSurplus } from '../application/banking';
import { applyBanked } from '../application/applyBanked';

describe('banking', () => {
  test('bankSurplus basic', () => {
    const { entry, cbAfter } = bankSurplus('R002', 2024, 100, 25);
    expect(entry.shipId).toBe('R002');
    expect(entry.amountTonnes).toBe(25);
    expect(cbAfter).toBe(75);
  });

  test('bankSurplus cannot bank more than available', () => {
    expect(() => bankSurplus('R001', 2024, 10, 20)).toThrow();
  });

  test('applyBanked basic', () => {
    const res = applyBanked(100, 30);
    expect(res.applied).toBe(30);
    expect(res.remainingBanked).toBe(70);
    expect(res.remainingRequired).toBe(0);
  });

  test('applyBanked when bank less than required', () => {
    const res = applyBanked(10, 50);
    expect(res.applied).toBe(10);
    expect(res.remainingBanked).toBe(0);
    expect(res.remainingRequired).toBe(40);
  });
});
