import React from 'react';
import { BrowserRouter, Link, Routes, Route, Navigate } from 'react-router-dom';
import RoutesTab from './adapters/ui/pages/RoutesTab';
import CompareTab from './adapters/ui/pages/CompareTab';
import BankingTab from './adapters/ui/pages/BankingTab';
import PoolingTab from './adapters/ui/pages/PoolingTab';

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">FuelEU Compliance Dashboard</h1>
        </header>

        <nav className="mb-4">
          <ul className="flex gap-2">
            <li><Link to="/routes" className="px-3 py-1 bg-white border rounded">Routes</Link></li>
            <li><Link to="/compare" className="px-3 py-1 bg-white border rounded">Compare</Link></li>
            <li><Link to="/banking" className="px-3 py-1 bg-white border rounded">Banking</Link></li>
            <li><Link to="/pooling" className="px-3 py-1 bg-white border rounded">Pooling</Link></li>
          </ul>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/routes" replace />} />
            <Route path="/routes" element={<RoutesTab />} />
            <Route path="/compare" element={<CompareTab />} />
            <Route path="/banking" element={<BankingTab />} />
            <Route path="/pooling" element={<PoolingTab />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
