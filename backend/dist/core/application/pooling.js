"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPool = createPool;
function createPool(input) {
    // Accept both legacy array input (members with cbBefore) and the new object input
    let year = 0;
    let membersInputRaw = [];
    if (Array.isArray(input)) {
        membersInputRaw = input;
    }
    else {
        year = input.year;
        membersInputRaw = input.members;
    }
    // Normalize to internal PoolMember shape
    const membersInput = membersInputRaw.map((m) => ({ shipId: m.shipId, cbBeforeTonnes: m.cbBefore ?? m.cbBeforeTonnes }));
    const sum = membersInput.reduce((s, m) => s + m.cbBeforeTonnes, 0);
    const pool = {
        id: undefined,
        year,
        members: membersInput.map((m) => ({ ...m })),
        poolSum: round(sum),
        valid: sum >= -1e-12,
    };
    if (!pool.valid) {
        // invalid pool, cannot allocate
        pool.members = pool.members.map((m) => ({ ...m, cbAfterTonnes: m.cbBeforeTonnes }));
        // add details for backward compatibility with tests
        return { ...pool, details: 'Pool sum negative' };
    }
    // separate surplus and deficit lists
    const surpluses = pool.members
        .filter((m) => m.cbBeforeTonnes > 0)
        .map((m) => ({ ...m }));
    const deficits = pool.members
        .filter((m) => m.cbBeforeTonnes <= 0)
        .map((m) => ({ ...m }));
    // sort: largest surplus first
    surpluses.sort((a, b) => b.cbBeforeTonnes - a.cbBeforeTonnes);
    // sort deficits: most negative first (largest absolute deficit)
    deficits.sort((a, b) => a.cbBeforeTonnes - b.cbBeforeTonnes);
    // initialize cbAfter to cbBefore
    const afterMap = new Map();
    pool.members.forEach((m) => afterMap.set(m.shipId, m.cbBeforeTonnes));
    // iterate surpluses and cover deficits greedily
    for (const s of surpluses) {
        let available = afterMap.get(s.shipId) ?? 0;
        // available should be positive
        if (available <= 0)
            continue;
        for (const d of deficits) {
            const deficitBefore = afterMap.get(d.shipId) ?? d.cbBeforeTonnes;
            if (deficitBefore >= 0)
                continue; // already covered
            const need = -deficitBefore; // positive amount needed to bring to zero
            const transfer = Math.min(available, need);
            if (transfer <= 0)
                continue;
            // apply transfer
            afterMap.set(d.shipId, round(deficitBefore + transfer));
            available = round(available - transfer);
            afterMap.set(s.shipId, round(available));
            if (available <= 1e-12)
                break;
        }
    }
    // write cbAfter to pool.members
    pool.members = pool.members.map((m) => ({
        ...m,
        cbAfterTonnes: round(afterMap.get(m.shipId) ?? m.cbBeforeTonnes),
    }));
    // validation checks:
    // - No surplus ship that started positive should be negative now
    const surplusSafe = pool.members.every((m) => {
        if (m.cbBeforeTonnes > 0) {
            return m.cbAfterTonnes >= -1e-12;
        }
        return true;
    });
    // - No deficit should be worse than before
    const deficitSafe = pool.members.every((m) => {
        if (m.cbBeforeTonnes < 0) {
            return m.cbAfterTonnes >= m.cbBeforeTonnes - 1e-12;
        }
        return true;
    });
    pool.valid = pool.valid && surplusSafe && deficitSafe;
    // round the poolSum again
    pool.poolSum = round(pool.poolSum ?? pool.members.reduce((s, m) => s + (m.cbAfterTonnes ?? 0), 0));
    // For backward compatibility with tests, return members with cbBefore/cbAfter and details when invalid
    const out = {
        id: pool.id,
        year: pool.year,
        poolSum: pool.poolSum,
        valid: !!pool.valid,
        members: pool.members.map((m) => ({ shipId: m.shipId, cbBefore: m.cbBeforeTonnes, cbAfter: m.cbAfterTonnes })),
    };
    return out;
}
function round(n, places = 6) {
    const p = Math.pow(10, places);
    return Math.round(n * p) / p;
}
