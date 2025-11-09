import React, { useState } from 'react';
import { useBanking } from '../../../core/application/useBanking';

export default function BankingTab(): JSX.Element {
  const { snapshot, banked, load, bank, apply, loading, error } = useBanking();
  const [shipId, setShipId] = useState('R001');
  const [year, setYear] = useState(2024);
  const [amount, setAmount] = useState<number>(0);

  async function onLoad() {
    await load(shipId, year);
  }

  async function onBank() {
    await bank(shipId, year, amount);
  }

  async function onApply() {
    await apply(shipId, year, amount);
  }

  return (
    <div>
      <div className="flex gap-2 items-end mb-4">
        <input value={shipId} onChange={(e) => setShipId(e.target.value)} className="p-2 border rounded" />
        <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="p-2 border rounded" />
        <button onClick={onLoad} className="px-3 py-1 bg-slate-700 text-white rounded">Load</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 border rounded">
          <h3 className="font-semibold">Compliance</h3>
          <div>CB before: {snapshot?.cbBeforeTonnes ?? '—'} t</div>
          <div>Computed at: {snapshot?.computedAt ?? '—'}</div>
        </div>
        <div className="bg-white p-4 border rounded">
          <h3 className="font-semibold">Banked</h3>
          <div>{banked ?? 0} t</div>
        </div>
        <div className="bg-white p-4 border rounded">
          <h3 className="font-semibold">Actions</h3>
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="p-2 border rounded w-full mb-2" />
          <button onClick={onBank} className="px-3 py-1 bg-green-600 text-white rounded mr-2">Bank</button>
          <button onClick={onApply} className="px-3 py-1 bg-indigo-600 text-white rounded">Apply</button>
        </div>
      </div>
    </div>
  );
}
