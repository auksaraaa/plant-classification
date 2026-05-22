import { useEffect, useState } from 'react';
import { plants as localPlants } from '@/data/plants';
import type { Plant } from '@/data/plants';
import { getDocuments, setDocument, deleteDocument as deleteFirestoreDocument, updateDocument as updateFirestoreDocument } from '@/lib/firestore';

/**
 * Hook for fetching all plants from local data and Firestore
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
      
      // Try to load from Firestore
      try {
        const firestorePlants = await getDocuments('plants');
        if (firestorePlants && firestorePlants.length > 0) {
          setPlants(firestorePlants as Plant[]);
        } else {
          // Fallback to local plants if Firestore is empty
          setPlants(localPlants);
        }
      } catch (firestoreError) {
        console.warn('Failed to load from Firestore, using local plants:', firestoreError);
        // Fallback to local plants if Firestore fails
        setPlants(localPlants);
      }
    } catch (err) {
      console.error('Error loading plants:', err);
      setError('Failed to load plants');
      setPlants(localPlants);
    } finally {
      setLoading(false);
    }
  };

  const addPlant = async (plant: Plant) => {
    try {
      // Prepare data - filter out undefined values from images
      const plantData: any = {
        id: plant.id,
        name: plant.name,
        scientificName: plant.scientificName,
        description: plant.description,
        shortDescription: plant.shortDescription,
        image: plant.image,
        category: plant.category,
        characteristics: plant.characteristics,
      };

      // Add reference if provided
      if (plant.reference) {
        plantData.reference = plant.reference;
      }

      // Add ecology if provided
      if (plant.ecology) {
        plantData.ecology = plant.ecology;
      }

      // Add benefits if provided
      if (plant.benefits) {
        plantData.benefits = plant.benefits;
      }

      // Add iucnStatus if provided
      if (plant.iucnStatus) {
        plantData.iucnStatus = plant.iucnStatus;
      }

      // Only add images if they have actual values
      if (plant.images) {
        const filteredImages = Object.entries(plant.images).reduce((acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        }, {} as any);
        if (Object.keys(filteredImages).length > 0) {
          plantData.images = filteredImages;
        }
      }

      // Save to Firestore
      await setDocument('plants', plant.id, plantData);
      
      // Update local state
      setPlants((prev) => [...prev, plant]);
      return { success: true };
    } catch (err) {
      console.error('Error adding plant:', err);
      throw err;
    }
  };

  const removePlant = async (id: string) => {
    try {
      // Delete from Firestore
      await deleteFirestoreDocument('plants', id);
      
      // Update local state
      setPlants((prev) => prev.filter((plant) => plant.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error removing plant:', err);
      throw err;
    }
  };

  const updatePlant = async (updatedPlant: Plant) => {
    try {
      // Prepare data - filter out undefined values from images
      const plantData: any = {
        name: updatedPlant.name,
        scientificName: updatedPlant.scientificName,
        description: updatedPlant.description,
        shortDescription: updatedPlant.shortDescription,
        image: updatedPlant.image,
        category: updatedPlant.category,
        characteristics: updatedPlant.characteristics,
      };

      // Add reference if provided
      if (updatedPlant.reference) {
        plantData.reference = updatedPlant.reference;
      }

      // Add ecology if provided
      if (updatedPlant.ecology) {
        plantData.ecology = updatedPlant.ecology;
      }

      // Add benefits if provided
      if (updatedPlant.benefits) {
        plantData.benefits = updatedPlant.benefits;
      }

      // Add iucnStatus if provided
      if (updatedPlant.iucnStatus) {
        plantData.iucnStatus = updatedPlant.iucnStatus;
      }

      // Only add images if they have actual values
      if (updatedPlant.images) {
        const filteredImages = Object.entries(updatedPlant.images).reduce((acc, [key, value]) => {
          if (value) acc[key] = value;
          return acc;
        }, {} as any);
        if (Object.keys(filteredImages).length > 0) {
          plantData.images = filteredImages;
        }
      }

      // Update in Firestore
      await updateFirestoreDocument('plants', updatedPlant.id, plantData);
      
      // Update local state
      setPlants((prev) => prev.map((plant) => (plant.id === updatedPlant.id ? updatedPlant : plant)));
      return { success: true };
    } catch (err) {
      console.error('Error updating plant:', err);
      throw err;
    }
  };

  const refresh = async () => {
    await loadPlants();
  };

  return { plants, loading, error, refresh, removePlant, updatePlant, addPlant };
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
      
      // Get from local data first
      const localPlant = localPlants.find((p) => p.id === id);
      console.log('Local search result:', localPlant);
      if (localPlant) {
        foundPlant = localPlant;
        console.log('Using local plant:', foundPlant);
      }

      // If not found in local data, try Firestore
      if (!foundPlant) {
        console.log('Plant not found in local data, trying Firestore...');
        try {
          const firestorePlants = await getDocuments('plants');
          const firestorePlant = firestorePlants?.find((p: any) => p.id === id);
          if (firestorePlant) {
            foundPlant = firestorePlant as Plant;
            console.log('Found plant in Firestore:', foundPlant);
          }
        } catch (firestoreError) {
          console.warn('Failed to search Firestore:', firestoreError);
        }
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

