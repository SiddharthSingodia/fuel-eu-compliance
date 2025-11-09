"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingRepositoryPostgres = void 0;
// backend/src/adapters/outbound/postgres/bankingRepositoryPostgres.ts
const prismaClient_1 = require("./prismaClient");
class BankingRepositoryPostgres {
    async addBankEntry(entry) {
        await prismaClient_1.prisma.bankEntry.create({
            data: {
                shipId: entry.shipId,
                year: entry.year,
                amountTonnes: entry.amountTonnes,
            },
        });
    }
    async getBankedAmount(shipId, year) {
        const rows = await prismaClient_1.prisma.bankEntry.findMany({
            where: { shipId, year },
        });
        return rows.reduce((s, r) => s + r.amountTonnes, 0);
    }
    async consumeBankedAmount(shipId, year, amount) {
        // naive approach: create a negative bank entry to mark consumption
        await prismaClient_1.prisma.bankEntry.create({
            data: {
                shipId,
                year,
                amountTonnes: -Math.abs(amount),
            },
        });
    }
}
exports.BankingRepositoryPostgres = BankingRepositoryPostgres;
