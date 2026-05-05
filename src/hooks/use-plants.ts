import { useEffect, useState } from 'react';
import { plants as localPlants } from '@/data/plants';
import type { Plant } from '@/data/plants';

/**
 * Hook for fetching all plants from local data
 */
export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>(localPlants);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      setLoading(true);
      setError(null);
      // Using local plants data only
      setPlants(localPlants);
    } catch (err) {
      console.error('Error loading plants:', err);
      setError('Failed to load plants');
    } finally {
      setLoading(false);
    }
  };

  const removePlant = (id: string) => {
    setPlants((prev) => prev.filter((plant) => plant.id !== id));
  };

  const updatePlant = (updatedPlant: Plant) => {
    setPlants((prev) => prev.map((plant) => (plant.id === updatedPlant.id ? updatedPlant : plant)));
  };

  const refresh = async () => {
    await loadPlants();
  };

  return { plants, loading, error, refresh, removePlant, updatePlant };
}

/**
 * Hook for fetching a single plant by ID from local data
 */
export function usePlant(plantId?: string) {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (plantId) {
      loadPlant(plantId);
    } else {
      setPlant(null);
      setLoading(false);
    }
  }, [plantId]);

  const loadPlant = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      let foundPlant: Plant | null = null;
      
      console.log('Looking for plant with ID:', id);
      
      // Get from local data
      const localPlant = localPlants.find((p) => p.id === id);
      console.log('Local search result:', localPlant);
      if (localPlant) {
        foundPlant = localPlant;
        console.log('Using local plant:', foundPlant);
      }

      if (foundPlant) {
        setPlant(foundPlant);
      } else {
        console.warn('Plant not found:', id);
        setError('Plant not found');
        setPlant(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load plant';
      setError(errorMessage);
      console.error('Error loading plant:', err);
      setPlant(null);
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

