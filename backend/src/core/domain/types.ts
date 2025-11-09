// backend/src/core/domain/types.ts
export type Route = {
  id?: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; // gCO2e / MJ
  fuelConsumption: number; // tonnes
  distance: number; // km
  totalEmissions: number; // tonnes CO2
  isBaseline?: boolean;
};

export type ShipCompliance = {
  shipId: string;
  year: number;
  cbBeforeTonnes: number; // positive => surplus, negative => deficit (tonnes CO2e)
  cbAfterTonnes?: number;
  appliedTonnes?: number;
};

export type BankEntry = {
  id?: string;
  shipId: string;
  year: number;
  amountTonnes: number; // banked amount in tonnes CO2e
  createdAt?: string;
};

export type PoolMember = {
  shipId: string;
  cbBeforeTonnes: number;
  cbAfterTonnes?: number;
};

export type Pool = {
  id?: string;
  year: number;
  members: PoolMember[];
  poolSum?: number;
  valid?: boolean;
};
