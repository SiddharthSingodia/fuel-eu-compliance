"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesRouter = void 0;
// backend/src/adapters/inbound/http/routesController.ts
const express_1 = __importDefault(require("express"));
const routeRepositoryPostgres_1 = require("../../outbound/postgres/routeRepositoryPostgres");
exports.routesRouter = express_1.default.Router();
const repo = new routeRepositoryPostgres_1.RouteRepositoryPostgres();
exports.routesRouter.get('/', async (req, res, next) => {
    try {
        const routes = await repo.getAllRoutes();
        res.json(routes);
    }
    catch (err) {
        next(err);
    }
});
exports.routesRouter.post('/:routeId/baseline', async (req, res, next) => {
    try {
        const { routeId } = req.params;
        const updated = await repo.setBaseline(routeId);
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
});
