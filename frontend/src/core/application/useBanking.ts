import { useState } from 'react';
import * as api from '../../adapters/infrastructure/apiClient';
import type { ComplianceSnapshot } from '../domain/types';

export function useBanking() {
  const [snapshot, setSnapshot] = useState<ComplianceSnapshot | null>(null);
  const [banked, setBanked] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(shipId: string, year: number) {
    try {
      setLoading(true);
      const res = await api.getBankingRecords(shipId, year);
      // expected { banked, compliance }
      setBanked(res.banked ?? 0);
      setSnapshot(res.compliance ?? null);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load banking records');
    } finally {
      setLoading(false);
    }
  }

  async function bank(shipId: string, year: number, amount: number) {
    try {
      setLoading(true);
      const res = await api.postBank(shipId, year, amount);
      // res expected: { cb_before, applied, cb_after }
      await load(shipId, year);
      return res;
    } catch (e: any) {
      setError(e?.message ?? 'Banking failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function apply(shipId: string, year: number, amount: number) {
    try {
      setLoading(true);
      const res = await api.postApplyBank(shipId, year, amount);
      await load(shipId, year);
      return res;
    } catch (e: any) {
      setError(e?.message ?? 'Apply failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { snapshot, banked, loading, error, load, bank, apply };
}
