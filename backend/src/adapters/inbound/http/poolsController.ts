// backend/src/adapters/inbound/http/poolsController.ts
import express from 'express';
import { createPool } from '../../../core/application/pooling';
import { ComplianceRepositoryPostgres } from '../../outbound/postgres/complianceRepositoryPostgres';
import { prisma } from '../../outbound/postgres/prismaClient';

export const poolsRouter = express.Router();
const complianceRepo = new ComplianceRepositoryPostgres();

// POST /pools { year, members: [ "R001", "R002", ... ] }
poolsRouter.post('/', async (req, res, next) => {
  try {
    const { year, members } = req.body;
    if (!year || !Array.isArray(members) || members.length === 0) return res.status(400).json({ error: 'year and members required' });

    const memberSnapshots = [];
    for (const shipId of members) {
      const snap = await complianceRepo.getCompliance(shipId, year);
      if (!snap) return res.status(400).json({ error: `Missing compliance snapshot for ${shipId}` });
      memberSnapshots.push({ shipId, cbBefore: snap.cbBeforeTonnes });
    }

    const result = createPool(memberSnapshots);

    if (!result.valid) {
      return res.status(400).json({ error: result.details || 'Invalid pool' });
    }

    // persist pool + members
    const pool = await prisma.pool.create({ data: { year } });
    for (const m of result.members) {
      await prisma.poolMember.create({
        data: {
          poolId: pool.id,
          shipId: m.shipId,
          cbBefore: m.cbBefore,
          cbAfter: m.cbAfter,
        },
      });
      // update compliance snapshot to cbAfter
      await prisma.shipCompliance.create({
        data: {
          shipId: m.shipId,
          year,
          cbBeforeTonnes: m.cbAfter,
        },
      });
    }

    res.json({ poolId: pool.id, members: result.members, poolSum: result.poolSum });
  } catch (err) {
    next(err);
  }
});
