"use strict";
// backend/src/core/application/computeCB.ts
/**
 * Pure function to compute Compliance Balance (CB).
 *
 * Units:
 * - ghgTarget and ghgActual are in gCO2e/MJ
 * - fuelTonnes in t
 * - ENERGY_PER_TONNE = 41,000 MJ/t
 * - cbGrams = (target - actual) * energyMJ
 * - cbTonnes = cbGrams / 1,000,000
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENERGY_PER_TONNE_MJ = exports.ENERGY_PER_TONNE = void 0;
exports.computeCB = computeCB;
exports.ENERGY_PER_TONNE = 41000; // MJ / t
exports.ENERGY_PER_TONNE_MJ = exports.ENERGY_PER_TONNE;
function computeCB(targetGPerMJ, actualGPerMJ, fuelTonnes) {
    // If target or actual are not finite numbers, return zeros gracefully so
    // callers/tests don't need to handle thrown exceptions.
    if (!Number.isFinite(targetGPerMJ) || !Number.isFinite(actualGPerMJ)) {
        return { energyMJ: 0, cbGrams: 0, cbTonnes: 0 };
    }
    if (!Number.isFinite(fuelTonnes) || fuelTonnes <= 0) {
        return { energyMJ: 0, cbGrams: 0, cbTonnes: 0 };
    }
    const energyMJ = fuelTonnes * exports.ENERGY_PER_TONNE;
    const cbGrams = (targetGPerMJ - actualGPerMJ) * energyMJ;
    const cbTonnes = cbGrams / 1000000;
    return { energyMJ, cbGrams, cbTonnes };
}
