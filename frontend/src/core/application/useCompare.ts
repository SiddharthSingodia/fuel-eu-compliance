import { useEffect, useState } from 'react';
import * as api from '../../adapters/infrastructure/apiClient';

export type CompareRow = {
  routeId: string;
  baselineGhg: number;
  compareGhg: number;
  percentDiff: number;
  compliant: boolean;
};

export function useCompare() {
  const [rows, setRows] = useState<CompareRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await api.getComparison();
      setRows(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load comparison');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { rows, loading, error, reload: load };
}
