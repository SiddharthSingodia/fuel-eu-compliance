// backend/src/core/application/banking.ts
import type { ShipCompliance, BankEntry } from '../domain/types';

/**
 * bankSurplus
 * - Validates that cbBefore is positive (surplus)
 * - Returns new ShipCompliance snapshot showing applied and cbAfter
 */
/**
 * Compatibility wrapper used by tests and adapters.
 *
 * Old test/API expects: bankSurplus(shipId, year, cbBefore, amountToBank)
 * to return { entry, cbAfter } where entry is a BankEntry and cbAfter is a number.
 */
export function bankSurplus(
  shipId: string,
  year: number,
  cbBeforeTonnes: number,
  amountToBankTonnes: number
): { entry: BankEntry; cbAfter: number } {
  if (!shipId) throw new Error('Missing shipId');
  if (!Number.isFinite(cbBeforeTonnes)) throw new Error('Invalid cbBefore');
  if (!Number.isFinite(amountToBankTonnes) || amountToBankTonnes <= 0) {
    throw new Error('Invalid bank amount (must be positive)');
  }

  const available = cbBeforeTonnes;
  if (available <= 0) {
    throw new Error('No surplus available to bank');
  }
  if (amountToBankTonnes > available + 1e-12) {
    throw new Error('Cannot bank more than available surplus');
  }

  const cbAfter = round(available - amountToBankTonnes);
  const entry: BankEntry = { shipId, year, amountTonnes: amountToBankTonnes };
  return { entry, cbAfter };
}

/**
 * applyBanked
 * - Applies banked amount (from bank) to a deficit snapshot.
 * - Validates amount <= banked available and snapshot deficit negative.
 */
export function applyBanked(
  snapshot: ShipCompliance,
  bankAvailableTonnes: number,
  amountApplyTonnes: number
): ShipCompliance {
  if (!snapshot) throw new Error('Missing snapshot');
  if (!Number.isFinite(bankAvailableTonnes) || bankAvailableTonnes < 0) {
    throw new Error('Invalid bank available amount');
  }
  if (!Number.isFinite(amountApplyTonnes) || amountApplyTonnes <= 0) {
    throw new Error('Invalid apply amount');
  }
  const deficit = snapshot.cbBeforeTonnes;
  // If CB before is positive (surplus), application is not needed
  if (deficit >= 0) {
    throw new Error('Snapshot is not in deficit; no need to apply banked amounts');
  }
  if (amountApplyTonnes > bankAvailableTonnes + 1e-12) {
    throw new Error('Cannot apply more than available banked amount');
  }

  const cbAfter = round(snapshot.cbBeforeTonnes + amountApplyTonnes); // add positive amount to reduce deficit
  return {
    ...snapshot,
    appliedTonnes: amountApplyTonnes,
    cbAfterTonnes: cbAfter,
  };
}

function round(n: number, places = 6) {
  const p = Math.pow(10, places);
  return Math.round(n * p) / p;
}
