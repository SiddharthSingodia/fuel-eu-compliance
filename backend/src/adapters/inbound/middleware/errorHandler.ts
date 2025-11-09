// backend/src/adapters/inbound/http/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // eslint-disable-next-line no-console
  console.error(err);
  if (err instanceof Error) {
    return res.status(500).json({ error: err.message });
  }
  res.status(500).json({ error: 'Unknown error' });
}
