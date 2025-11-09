"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    // eslint-disable-next-line no-console
    console.error(err);
    if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
    }
    res.status(500).json({ error: 'Unknown error' });
}
