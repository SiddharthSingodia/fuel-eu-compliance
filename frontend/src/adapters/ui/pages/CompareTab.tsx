import React from 'react';
import { useCompare } from '../../../core/application/useCompare';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line
} from 'recharts';

export default function CompareTab(): JSX.Element {
  const { rows, loading, error, reload } = useCompare();
  const target = 89.3368; // per spec

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Comparison (target {target} gCO₂e/MJ)</h2>
        <button onClick={reload} className="btn px-3 py-1 bg-slate-700 text-white rounded">Reload</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 border rounded">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">routeId</th>
                <th>baseline GHG</th>
                <th>compare GHG</th>
                <th>% diff</th>
                <th>compliant</th>
              </tr>
            </thead>
            <tbody>
              {rows?.map((r) => (
                <tr key={r.routeId} className="border-t">
                  <td className="p-2">{r.routeId}</td>
                  <td>{r.baselineGhg}</td>
                  <td>{r.compareGhg}</td>
                  <td>{r.percentDiff.toFixed(2)}%</td>
                  <td>{r.compliant ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 border rounded">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rows ?? []} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="routeId" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="baselineGhg" name="Baseline (g/MJ)" />
              <Bar dataKey="compareGhg" name="Comparison (g/MJ)" />
              {/* optionally overlay line to show target */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
