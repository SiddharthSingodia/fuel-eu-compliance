export type Route = {
  id?: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline?: boolean;
};

export type ComplianceSnapshot = {
  shipId: string;
  year: number;
  cbBeforeTonnes: number;
  computedAt?: string;
};

export type BankRecord = {
  shipId: string;
  year: number;
  amountTonnes: number;
  createdAt?: string;
};

export type PoolMember = {
  shipId: string;
  cbBefore: number;
  cbAfter?: number;
};
