"use strict";
// backend/src/core/application/computeComparison.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeComparison = computeComparison;
function computeComparison(baselineGhg, comparisonGhg, targetGhg // optional; not used in formula but allowed
) {
    // If baseline is zero or not finite, return zero percentDiff and not compliant
    if (!Number.isFinite(baselineGhg) || baselineGhg === 0) {
        return { baselineGhg, comparisonGhg, percentDiff: 0, compliant: false };
    }
    if (!Number.isFinite(comparisonGhg)) {
        throw new Error('Invalid comparison GHG intensity');
    }
    // percentDiff = ((comparison / baseline) − 1) × 100
    const percentDiff = (comparisonGhg / baselineGhg - 1) * 100;
    // The spec: compliant if comparison is <= target or percentDiff <= (targetBaseline relation).
    // For this function, we define compliant as: comparisonGhg <= baselineGhg (improvement) OR percentDiff <= 0
    const compliant = percentDiff <= 0;
    return { baselineGhg, comparisonGhg, percentDiff, compliant };
}
