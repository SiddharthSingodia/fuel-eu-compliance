import { useEffect, useState } from 'react';
import type { Route } from '../domain/types';
import * as api from '../../adapters/infrastructure/apiClient';

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const rs = await api.getRoutes();
      setRoutes(rs);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  }

  async function setAsBaseline(routeId: string) {
    try {
      setLoading(true);
      await api.setBaseline(routeId);
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to set baseline');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return { routes, loading, error, reload: load, setAsBaseline };
}
