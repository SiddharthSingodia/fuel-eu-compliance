import React, { useMemo, useState } from 'react';
import { useRoutes } from '../../../core/application/useRoutes';
import type { Route } from '../../core/domain/types';

export default function RoutesTab(): JSX.Element {
  const { routes, loading, error, reload, setAsBaseline } = useRoutes();
  const [filters, setFilters] = useState({ vesselType: '', fuelType: '', year: '' });

  const vesselTypes = useMemo(() => Array.from(new Set((routes ?? []).map((r) => r.vesselType))), [routes]);
  const fuelTypes = useMemo(() => Array.from(new Set((routes ?? []).map((r) => r.fuelType))), [routes]);
  const years = useMemo(() => Array.from(new Set((routes ?? []).map((r) => r.year))), [routes]);

  const filtered = (routes ?? []).filter((r) => {
    if (filters.vesselType && r.vesselType !== filters.vesselType) return false;
    if (filters.fuelType && r.fuelType !== filters.fuelType) return false;
    if (filters.year && String(r.year) !== filters.year) return false;
    return true;
  });

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <select value={filters.vesselType} onChange={(e) => setFilters({ ...filters, vesselType: e.target.value })} className="p-2 border rounded">
          <option value="">All Vessel Types</option>
          {vesselTypes.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select value={filters.fuelType} onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })} className="p-2 border rounded">
          <option value="">All Fuel Types</option>
          {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} className="p-2 border rounded">
          <option value="">All Years</option>
          {years.map((y) => <option key={y} value={String(y)}>{y}</option>)}
        </select>
        <button onClick={reload} className="ml-auto btn bg-slate-700 text-white px-3 py-1 rounded">Reload</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="overflow-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">routeId</th>
              <th>vesselType</th>
              <th>fuelType</th>
              <th>year</th>
              <th>ghgIntensity</th>
              <th>fuelConsumption (t)</th>
              <th>distance (km)</th>
              <th>totalEmissions (t)</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r: Route) => (
              <tr key={r.routeId} className="border-t">
                <td className="p-2">{r.routeId}</td>
                <td>{r.vesselType}</td>
                <td>{r.fuelType}</td>
                <td>{r.year}</td>
                <td>{r.ghgIntensity}</td>
                <td>{r.fuelConsumption}</td>
                <td>{r.distance}</td>
                <td>{r.totalEmissions}</td>
                <td>
                  <button className="mr-2 px-2 py-1 bg-blue-600 text-white rounded" onClick={() => setAsBaseline(r.routeId)}>Set Baseline</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={9} className="p-4 text-center">No routes</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
