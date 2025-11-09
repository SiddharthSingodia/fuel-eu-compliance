// backend/src/adapters/inbound/http/app.ts
import express from 'express';
import { json } from 'body-parser';
import { routesRouter } from './routesController';
import { complianceRouter } from './complianceController';
import { bankingRouter } from './bankingController';
import { poolsRouter } from './poolsController';
import { errorHandler } from './middleware/errorHandler';

export const app = express();
app.use(json());
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/routes', routesRouter);
app.use('/compliance', complianceRouter);
app.use('/banking', bankingRouter);
app.use('/pools', poolsRouter);

// last: error handler
app.use(errorHandler);
