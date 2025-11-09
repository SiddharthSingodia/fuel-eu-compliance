// backend/src/adapters/outbound/postgres/complianceRepositoryPostgres.ts
import type { ShipCompliance } from '../../../core/domain/types';
import { prisma } from './prismaClient';
import type { ComplianceRepositoryPort } from '../../../core/ports/repositoryPorts';

export class ComplianceRepositoryPostgres implements ComplianceRepositoryPort {
  async saveCompliance(sc: ShipCompliance): Promise<void> {
    await prisma.shipCompliance.create({
      data: {
        shipId: sc.shipId,
        year: sc.year,
        cbBeforeTonnes: sc.cbBeforeTonnes,
      },
    });
  }

  async getCompliance(shipId: string, year: number): Promise<ShipCompliance | null> {
    const row = await prisma.shipCompliance.findFirst({
      where: { shipId, year },
      orderBy: { computedAt: 'desc' },
    });
    if (!row) return null;
    return {
      shipId: row.shipId,
      year: row.year,
      cbBeforeTonnes: row.cbBeforeTonnes,
      computedAt: row.computedAt.toISOString(),
    };
  }
}
