import { useEffect, useState } from 'react';
import { getAllPlants, getPlant } from '@/lib/firestore';
import type { Plant } from '@/data/plants';

/**
 * Hook for fetching all plants from Firebase
 */
export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPlants();
      setPlants(data as Plant[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load plants';
      setError(errorMessage);
      console.error('Error loading plants:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await loadPlants();
  };

  return { plants, loading, error, refresh };
}

/**
 * Hook for fetching a single plant by ID from Firebase
 */
export function usePlant(plantId?: string) {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(!!plantId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (plantId) {
      loadPlant(plantId);
    }
  }, [plantId]);

  const loadPlant = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPlant(id);
      setPlant(data as Plant | null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load plant';
      setError(errorMessage);
      console.error('Error loading plant:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    if (plantId) {
      await loadPlant(plantId);
    }
  };

  return { plant, loading, error, refresh };
}
