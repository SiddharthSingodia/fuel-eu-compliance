"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.complianceRouter = void 0;
// backend/src/adapters/inbound/http/complianceController.ts
const express_1 = __importDefault(require("express"));
const routeRepositoryPostgres_1 = require("../../outbound/postgres/routeRepositoryPostgres");
const complianceRepositoryPostgres_1 = require("../../outbound/postgres/complianceRepositoryPostgres");
const computeCB_1 = require("../../../core/application/computeCB");
exports.complianceRouter = express_1.default.Router();
const routeRepo = new routeRepositoryPostgres_1.RouteRepositoryPostgres();
const complianceRepo = new complianceRepositoryPostgres_1.ComplianceRepositoryPostgres();
// GET /compliance/cb?shipId=R001&year=2024
exports.complianceRouter.get('/cb', async (req, res, next) => {
    try {
        const shipId = String(req.query.shipId);
        const year = Number(req.query.year);
        if (!shipId || Number.isNaN(year)) {
            return res.status(400).json({ error: 'shipId and year query params required' });
        }
        const route = await routeRepo.getRouteById(shipId);
        if (!route)
            return res.status(404).json({ error: 'route not found' });
        const { cbTonnes } = (0, computeCB_1.computeCB)(89.3368, route.ghgIntensity, route.fuelConsumption);
        // save snapshot
        await complianceRepo.saveCompliance({ shipId, year, cbBeforeTonnes: cbTonnes });
        const snapshot = await complianceRepo.getCompliance(shipId, year);
        res.json(snapshot);
    }
    catch (err) {
        next(err);
    }
});
