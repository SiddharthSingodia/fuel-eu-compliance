"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteRepositoryPostgres = void 0;
const prismaClient_1 = require("./prismaClient");
class RouteRepositoryPostgres {
    async getAllRoutes() {
        const rows = await prismaClient_1.prisma.route.findMany();
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
    async getRouteById(routeId) {
        const r = await prismaClient_1.prisma.route.findUnique({ where: { routeId } });
        if (!r)
            return null;
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
    async setBaseline(routeId) {
        // unset previous baselines for same year (simple approach)
        const route = await prismaClient_1.prisma.route.findUnique({ where: { routeId } });
        if (!route)
            throw new Error('Route not found');
        await prismaClient_1.prisma.$transaction([
            prismaClient_1.prisma.route.updateMany({
                where: { year: route.year },
                data: { isBaseline: false },
            }),
            prismaClient_1.prisma.route.update({
                where: { routeId },
                data: { isBaseline: true },
            }),
        ]);
        const updated = await prismaClient_1.prisma.route.findUnique({ where: { routeId } });
        if (!updated)
            throw new Error('Route not found after update');
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
exports.RouteRepositoryPostgres = RouteRepositoryPostgres;
