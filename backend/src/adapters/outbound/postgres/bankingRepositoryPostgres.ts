// backend/src/adapters/outbound/postgres/bankingRepositoryPostgres.ts
import { prisma } from './prismaClient';
import type { BankingRepositoryPort } from '../../../core/ports/repositoryPorts';
import type { BankEntry } from '../../../core/domain/types';

export class BankingRepositoryPostgres implements BankingRepositoryPort {
  async addBankEntry(entry: BankEntry): Promise<void> {
    await prisma.bankEntry.create({
      data: {
        shipId: entry.shipId,
        year: entry.year,
        amountTonnes: entry.amountTonnes,
      },
    });
  }

  async getBankedAmount(shipId: string, year: number): Promise<number> {
    const rows = await prisma.bankEntry.findMany({
      where: { shipId, year },
    });
    return rows.reduce((s, r) => s + r.amountTonnes, 0);
  }

  async consumeBankedAmount(shipId: string, year: number, amount: number): Promise<void> {
    // naive approach: create a negative bank entry to mark consumption
    await prisma.bankEntry.create({
      data: {
        shipId,
        year,
        amountTonnes: -Math.abs(amount),
      },
    });
  }
}
