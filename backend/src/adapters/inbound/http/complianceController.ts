// backend/src/adapters/inbound/http/complianceController.ts
import express from 'express';
import { RouteRepositoryPostgres } from '../../outbound/postgres/routeRepositoryPostgres';
import { ComplianceRepositoryPostgres } from '../../outbound/postgres/complianceRepositoryPostgres';
import { computeCB, ENERGY_PER_TONNE_MJ } from '../../../core/application/computeCB';

export const complianceRouter = express.Router();
const routeRepo = new RouteRepositoryPostgres();
const complianceRepo = new ComplianceRepositoryPostgres();

// GET /compliance/cb?shipId=R001&year=2024
complianceRouter.get('/cb', async (req, res, next) => {
  try {
    const shipId = String(req.query.shipId);
    const year = Number(req.query.year);
    if (!shipId || Number.isNaN(year)) {
      return res.status(400).json({ error: 'shipId and year query params required' });
    }
    const route = await routeRepo.getRouteById(shipId);
    if (!route) return res.status(404).json({ error: 'route not found' });

    const { cbTonnes } = computeCB(89.3368, route.ghgIntensity, route.fuelConsumption);
    // save snapshot
    await complianceRepo.saveCompliance({ shipId, year, cbBeforeTonnes: cbTonnes });
    const snapshot = await complianceRepo.getCompliance(shipId, year);
    res.json(snapshot);
  } catch (err) {
    next(err);
  }
});
