"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolsRouter = void 0;
// backend/src/adapters/inbound/http/poolsController.ts
const express_1 = __importDefault(require("express"));
const pooling_1 = require("../../../core/application/pooling");
const complianceRepositoryPostgres_1 = require("../../outbound/postgres/complianceRepositoryPostgres");
const prismaClient_1 = require("../../outbound/postgres/prismaClient");
exports.poolsRouter = express_1.default.Router();
const complianceRepo = new complianceRepositoryPostgres_1.ComplianceRepositoryPostgres();
// POST /pools { year, members: [ "R001", "R002", ... ] }
exports.poolsRouter.post('/', async (req, res, next) => {
    try {
        const { year, members } = req.body;
        if (!year || !Array.isArray(members) || members.length === 0)
            return res.status(400).json({ error: 'year and members required' });
        const memberSnapshots = [];
        for (const shipId of members) {
            const snap = await complianceRepo.getCompliance(shipId, year);
            if (!snap)
                return res.status(400).json({ error: `Missing compliance snapshot for ${shipId}` });
            memberSnapshots.push({ shipId, cbBefore: snap.cbBeforeTonnes });
        }
        const result = (0, pooling_1.createPool)(memberSnapshots);
        if (!result.valid) {
            return res.status(400).json({ error: result.details || 'Invalid pool' });
        }
        // persist pool + members
        const pool = await prismaClient_1.prisma.pool.create({ data: { year } });
        for (const m of result.members) {
            await prismaClient_1.prisma.poolMember.create({
                data: {
                    poolId: pool.id,
                    shipId: m.shipId,
                    cbBefore: m.cbBefore,
                    cbAfter: m.cbAfter,
                },
            });
            // update compliance snapshot to cbAfter
            await prismaClient_1.prisma.shipCompliance.create({
                data: {
                    shipId: m.shipId,
                    year,
                    cbBeforeTonnes: m.cbAfter,
                },
            });
        }
        res.json({ poolId: pool.id, members: result.members, poolSum: result.poolSum });
    }
    catch (err) {
        next(err);
    }
});
