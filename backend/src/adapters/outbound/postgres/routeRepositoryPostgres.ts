// backend/src/adapters/outbound/postgres/routeRepositoryPostgres.ts
import type { Route } from '../../../core/domain/types';
import type { RouteRepositoryPort } from '../../../core/ports/repositoryPorts';
import { prisma } from './prismaClient';

export class RouteRepositoryPostgres implements RouteRepositoryPort {
  async getAllRoutes(): Promise<Route[]> {
    const rows = await prisma.route.findMany();
    // map prisma types to core Route
    return rows.map((r) => ({
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: r.ghgIntensity,
      fuelConsumption: r.fuelConsumption,
      distance: r.distance,
      totalEmissions: r.totalEmissions,
      isBaseline: r.isBaseline,
    }));
  }

  async getRouteById(routeId: string): Promise<Route | null> {
    const r = await prisma.route.findUnique({ where: { routeId } });
    if (!r) return null;
    return {
      id: r.id,
      routeId: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: r.ghgIntensity,
      fuelConsumption: r.fuelConsumption,
      distance: r.distance,
      totalEmissions: r.totalEmissions,
      isBaseline: r.isBaseline,
    };
  }

  async setBaseline(routeId: string): Promise<Route> {
    // unset previous baselines for same year (simple approach)
    const route = await prisma.route.findUnique({ where: { routeId } });
    if (!route) throw new Error('Route not found');

    await prisma.$transaction([
      prisma.route.updateMany({
        where: { year: route.year },
        data: { isBaseline: false },
      }),
      prisma.route.update({
        where: { routeId },
        data: { isBaseline: true },
      }),
    ]);
    const updated = await prisma.route.findUnique({ where: { routeId } });
    if (!updated) throw new Error('Route not found after update');
    return {
      id: updated.id,
      routeId: updated.routeId,
      vesselType: updated.vesselType,
      fuelType: updated.fuelType,
      year: updated.year,
      ghgIntensity: updated.ghgIntensity,
      fuelConsumption: updated.fuelConsumption,
      distance: updated.distance,
      totalEmissions: updated.totalEmissions,
      isBaseline: updated.isBaseline,
    };
  }
}
