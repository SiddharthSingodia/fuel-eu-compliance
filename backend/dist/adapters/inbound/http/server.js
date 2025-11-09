"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/adapters/inbound/http/server.ts
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const port = process.env.PORT ?? 4000;
const server = http_1.default.createServer(app_1.app);
server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening at http://localhost:${port}`);
});
