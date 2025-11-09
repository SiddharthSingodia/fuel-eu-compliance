"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bankingRouter = void 0;
// backend/src/adapters/inbound/http/bankingController.ts
const express_1 = __importDefault(require("express"));
const bankingRepositoryPostgres_1 = require("../../outbound/postgres/bankingRepositoryPostgres");
const complianceRepositoryPostgres_1 = require("../../outbound/postgres/complianceRepositoryPostgres");
exports.bankingRouter = express_1.default.Router();
const bankingRepo = new bankingRepositoryPostgres_1.BankingRepositoryPostgres();
const complianceRepo = new complianceRepositoryPostgres_1.ComplianceRepositoryPostgres();
// GET /banking/records?shipId=R002&year=2024 -> banked amount and compliance snapshot
exports.bankingRouter.get('/records', async (req, res, next) => {
    try {
        const shipId = String(req.query.shipId);
        const year = Number(req.query.year);
        if (!shipId || Number.isNaN(year))
            return res.status(400).json({ error: 'shipId and year required' });
        const banked = await bankingRepo.getBankedAmount(shipId, year);
        const compliance = await complianceRepo.getCompliance(shipId, year);
        res.json({ banked, compliance });
    }
    catch (err) {
        next(err);
    }
});
// POST /banking/bank  { shipId, year, amount }
exports.bankingRouter.post('/bank', async (req, res, next) => {
    try {
        const { shipId, year, amount } = req.body;
        if (!shipId || !year || !Number.isFinite(amount))
            return res.status(400).json({ error: 'shipId, year, amount required' });
        // get latest compliance snapshot
        const snapshot = await complianceRepo.getCompliance(shipId, year);
        if (!snapshot)
            return res.status(400).json({ error: 'No compliance snapshot, run /compliance/cb first' });
        const currentCb = snapshot.cbBeforeTonnes;
        if (amount <= 0)
            return res.status(400).json({ error: 'amount must be positive' });
        if (amount > currentCb)
            return res.status(400).json({ error: 'Amount exceeds available CB' });
        // create entry and persist
        await bankingRepo.addBankEntry({ shipId, year, amountTonnes: amount });
        // record updated compliance snapshot (cbBefore decreased)
        await complianceRepo.saveCompliance({ shipId, year, cbBeforeTonnes: +(currentCb - amount) });
        const updated = await complianceRepo.getCompliance(shipId, year);
        res.json({ cb_before: currentCb, applied: amount, cb_after: updated?.cbBeforeTonnes ?? null });
    }
    catch (err) {
        next(err);
    }
});
// POST /banking/apply { shipId, year, amount, targetShipId? }
// Simple apply of banked to ship deficit
exports.bankingRouter.post('/apply', async (req, res, next) => {
    try {
        const { shipId, year, amount } = req.body;
        if (!shipId || !year || !Number.isFinite(amount))
            return res.status(400).json({ error: 'shipId, year, amount required' });
        const banked = await bankingRepo.getBankedAmount(shipId, year);
        if (amount > banked)
            return res.status(400).json({ error: 'Amount exceeds available banked' });
        // consume banked amount (create negative entry)
        await bankingRepo.consumeBankedAmount(shipId, year, amount);
        // apply to the ship's own compliance (simple apply)
        const snapshot = await complianceRepo.getCompliance(shipId, year);
        const cbBefore = snapshot?.cbBeforeTonnes ?? 0;
        const appliedTo = Math.min(amount, Math.abs(cbBefore)); // apply up to deficit
        const newCb = +(cbBefore + appliedTo); // note cbBefore negative for deficit; adding applied reduces deficit
        await complianceRepo.saveCompliance({ shipId, year, cbBeforeTonnes: newCb });
        const updated = await complianceRepo.getCompliance(shipId, year);
        res.json({ cb_before: cbBefore, applied: appliedTo, cb_after: updated?.cbBeforeTonnes ?? newCb });
    }
    catch (err) {
        next(err);
    }
});
