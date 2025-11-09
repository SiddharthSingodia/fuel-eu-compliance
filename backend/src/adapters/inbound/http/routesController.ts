// backend/src/adapters/inbound/http/routesController.ts
import express from 'express';
import { RouteRepositoryPostgres } from '../../outbound/postgres/routeRepositoryPostgres';

export const routesRouter = express.Router();
const repo = new RouteRepositoryPostgres();

routesRouter.get('/', async (req, res, next) => {
  try {
    const routes = await repo.getAllRoutes();
    res.json(routes);
  } catch (err) {
    next(err);
  }
});

routesRouter.post('/:routeId/baseline', async (req, res, next) => {
  try {
    const { routeId } = req.params;
    const updated = await repo.setBaseline(routeId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});
