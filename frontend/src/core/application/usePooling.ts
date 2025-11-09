import { useState } from 'react';
import * as api from '../../adapters/infrastructure/apiClient';
import type { PoolMember } from '../domain/types';

export function usePooling() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(year: number, members: string[]) {
    try {
      setLoading(true);
      const res = await api.createPool(year, members);
      setResult(res);
      return res;
    } catch (e: any) {
      setError(e?.message ?? 'Create pool failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, create };
}
