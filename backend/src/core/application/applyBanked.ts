// backend/src/core/application/applyBanked.ts
/**
 * applyBanked
 * - Apply bankedAmount (available) to a requiredAmount (deficit), returns applied and remaining
 *
 * Pure function; DB changes performed by adapters.
 */

export function applyBanked(availableBanked: number, requiredAmount: number): { applied: number; remainingBanked: number; remainingRequired: number } {
  if (!Number.isFinite(availableBanked) || !Number.isFinite(requiredAmount)) {
    throw new Error('Invalid numeric inputs');
  }
  if (availableBanked < 0 || requiredAmount <= 0) {
    // nothing to apply if requiredAmount <= 0
    return { applied: 0, remainingBanked: availableBanked, remainingRequired: requiredAmount };
  }

  const applied = Math.min(availableBanked, requiredAmount);
  const remainingBanked = +(availableBanked - applied);
  const remainingRequired = +(requiredAmount - applied);

  return { applied, remainingBanked, remainingRequired };
}
