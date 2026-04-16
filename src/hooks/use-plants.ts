import { useEffect, useState } from 'react';
import { getAllPlants, getPlant } from '@/lib/firestore';
import { plants as localPlants } from '@/data/plants';
import type { Plant } from '@/data/plants';

/**
 * Hook for fetching all plants from Firebase and local data combined
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
      
      try {
        const firebasePlants = await getAllPlants();
        
        // Merge Firebase and local plants, with Firebase taking priority
        if (firebasePlants && Array.isArray(firebasePlants) && firebasePlants.length > 0) {
          const fbIds = new Set(firebasePlants.map((p: any) => p.id));
          const localOnly = localPlants.filter((p) => !fbIds.has(p.id));
          const combined = [...firebasePlants, ...localOnly];
          setPlants(combined as Plant[]);
        } else {
          setPlants(localPlants);
        }
      } catch (fbErr) {
        console.warn('Failed to load from Firebase, using local data:', fbErr);
        setPlants(localPlants);
      }
    } catch (err) {
      console.error('Error loading plants:', err);
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
      let foundPlant: Plant | null = null;
      
      // Try to get from Firebase first
      try {
        const firebasePlant = await getPlant(id);
        if (firebasePlant && typeof firebasePlant === 'object') {
          // Ensure characteristics is a proper object
          if (!('characteristics' in firebasePlant)) {
            firebasePlant.characteristics = {
              leaf: '',
              flower: '',
              fruit: '',
              height: '',
              care: ''
            };
          }
          foundPlant = firebasePlant as Plant;
        }
      } catch (fbErr) {
        console.warn('Failed to load from Firebase:', fbErr);
      }

      // Fallback to local data if not found in Firebase
      if (!foundPlant) {
        const localPlant = localPlants.find((p) => p.id === id);
        if (localPlant) {
          foundPlant = localPlant;
        }
      }

      setPlant(foundPlant || null);
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

