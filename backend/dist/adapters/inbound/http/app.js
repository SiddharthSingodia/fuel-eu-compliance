"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// backend/src/adapters/inbound/http/app.ts
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const routesController_1 = require("./routesController");
const complianceController_1 = require("./complianceController");
const bankingController_1 = require("./bankingController");
const poolsController_1 = require("./poolsController");
const errorHandler_1 = require("./middleware/errorHandler");
exports.app = (0, express_1.default)();
exports.app.use((0, body_parser_1.json)());
exports.app.get('/health', (_req, res) => res.json({ status: 'ok' }));
exports.app.use('/routes', routesController_1.routesRouter);
exports.app.use('/compliance', complianceController_1.complianceRouter);
exports.app.use('/banking', bankingController_1.bankingRouter);
exports.app.use('/pools', poolsController_1.poolsRouter);
// last: error handler
exports.app.use(errorHandler_1.errorHandler);
