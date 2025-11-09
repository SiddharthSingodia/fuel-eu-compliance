import React, { useState } from 'react';
import { usePooling } from '../../../core/application/usePooling';

export default function PoolingTab(): JSX.Element {
  const [year, setYear] = useState(2024);
  const [membersText, setMembersText] = useState('R001,R002');
  const { result, create, loading, error } = usePooling();

  async function onCreate() {
    const members = membersText.split(',').map((s) => s.trim()).filter(Boolean);
    await create(year, members);
  }

  return (
    <div>
      <div className="flex gap-2 items-center mb-4">
        <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="p-2 border rounded" />
        <input value={membersText} onChange={(e) => setMembersText(e.target.value)} className="p-2 border rounded flex-1" />
        <button onClick={onCreate} className="px-3 py-1 bg-slate-700 text-white rounded">Create Pool</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {result && (
        <div className="bg-white p-4 border rounded">
          <div>Pool ID: {result.poolId}</div>
          <div>Pool Sum: {result.poolSum}</div>
          <table className="min-w-full mt-2">
            <thead>
              <tr className="bg-gray-100"><th>Ship</th><th>Before</th><th>After</th></tr>
            </thead>
            <tbody>
              {result.members.map((m: any) => (
                <tr key={m.shipId}>
                  <td className="p-2">{m.shipId}</td>
                  <td>{m.cbBefore}</td>
                  <td>{m.cbAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
