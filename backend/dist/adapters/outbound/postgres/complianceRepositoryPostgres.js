"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceRepositoryPostgres = void 0;
const prismaClient_1 = require("./prismaClient");
class ComplianceRepositoryPostgres {
    async saveCompliance(sc) {
        await prismaClient_1.prisma.shipCompliance.create({
            data: {
                shipId: sc.shipId,
                year: sc.year,
                cbBeforeTonnes: sc.cbBeforeTonnes,
            },
        });
    }
    async getCompliance(shipId, year) {
        const row = await prismaClient_1.prisma.shipCompliance.findFirst({
            where: { shipId, year },
            orderBy: { computedAt: 'desc' },
        });
        if (!row)
            return null;
        return {
            shipId: row.shipId,
            year: row.year,
            cbBeforeTonnes: row.cbBeforeTonnes,
            computedAt: row.computedAt.toISOString(),
        };
    }
}
exports.ComplianceRepositoryPostgres = ComplianceRepositoryPostgres;
