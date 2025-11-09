"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
// Simple Express error handler middleware used by the app and tests.
function errorHandler(err, _req, res, _next) {
    // In tests we prefer a JSON error with message and optional status
    const status = err?.status || 500;
    const message = err?.message || 'Internal Server Error';
    // keep minimal logging
    // eslint-disable-next-line no-console
    console.error('Unhandled error in request pipeline:', err);
    res.status(status).json({ error: message });
}
