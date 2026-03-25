import { useState, useEffect, useCallback } from 'react';
import type { GardenPlot } from '../types';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function buildHeaders(token: string | null): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function useGarden(token: string | null) {
  const [plots, setPlots] = useState<GardenPlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlots = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/garden`, { headers: buildHeaders(token) });
      if (!res.ok) throw new Error('Failed to fetch garden');
      const data: GardenPlot[] = await res.json();
      setPlots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPlots();
  }, [fetchPlots]);

  const plantSeed = async (slot_index: number, plant_id: number) => {
    const res = await fetch(`${API}/api/garden/plant`, {
      method: 'POST',
      headers: buildHeaders(token),
      body: JSON.stringify({ slot_index, plant_id }),
    });
    if (!res.ok) throw new Error('Failed to plant seed');
    await fetchPlots();
  };

  const waterPlant = async (plotId: number) => {
    const res = await fetch(`${API}/api/garden/water/${plotId}`, {
      method: 'POST',
      headers: buildHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to water plant');
    await fetchPlots();
  };

  const getWisdom = async (plotId: number): Promise<{ plant: string; wisdom: string }> => {
    const res = await fetch(`${API}/api/garden/wisdom/${plotId}`, { headers: buildHeaders(token) });
    if (!res.ok) throw new Error('Wisdom not yet available');
    return res.json();
  };

  return { plots, loading, error, plantSeed, waterPlant, getWisdom, refetch: fetchPlots };
}
