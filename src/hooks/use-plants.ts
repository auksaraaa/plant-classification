import { useEffect, useState } from 'react';
import { getAllPlants, getPlant } from '@/lib/firestore';
import { plants as localPlants } from '@/data/plants';
import type { Plant } from '@/data/plants';

/**
 * Hook for fetching all plants from Firebase, with fallback to local data
 */
export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>(localPlants);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      setLoading(true);
      setError(null);
      const firebasePlants = await getAllPlants();
      
      // If Firebase has data, use it; otherwise use local data
      if (firebasePlants && firebasePlants.length > 0) {
        setPlants(firebasePlants as Plant[]);
      } else {
        setPlants(localPlants);
      }
    } catch (err) {
      console.warn('Failed to load from Firebase, using local data:', err);
      // Use local plants as fallback
      setPlants(localPlants);
      setError(null);
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
 * Hook for fetching a single plant by ID from Firebase or local data
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
      
      // Try to get from Firebase first
      try {
        const firebasePlant = await getPlant(id);
        if (firebasePlant) {
          setPlant(firebasePlant as Plant);
          return;
        }
      } catch (err) {
        console.warn('Failed to load from Firebase:', err);
      }

      // Fallback to local data
      const localPlant = localPlants.find((p) => p.id === id);
      if (localPlant) {
        setPlant(localPlant);
      } else {
        setPlant(null);
      }
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

