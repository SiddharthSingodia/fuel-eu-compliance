// backend/src/core/ports/repositoryPorts.ts
import type { Route, ShipCompliance, BankEntry } from '../domain/types';

export interface RouteRepositoryPort {
  getAllRoutes(): Promise<Route[]>;
  getRouteById(routeId: string): Promise<Route | null>;
  setBaseline(routeId: string): Promise<Route>;
}

export interface ComplianceRepositoryPort {
  saveCompliance(sc: ShipCompliance): Promise<void>;
  getCompliance(shipId: string, year: number): Promise<ShipCompliance | null>;
}

export interface BankingRepositoryPort {
  addBankEntry(entry: BankEntry): Promise<void>;
  getBankedAmount(shipId: string, year: number): Promise<number>;
  consumeBankedAmount(shipId: string, year: number, amount: number): Promise<void>;
}
