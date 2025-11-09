"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
const server = http_1.default.createServer(app);
const port = process.env.PORT ?? 4000;
server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend dev server listening on http://localhost:${port}`);
});
exports.default = server;
