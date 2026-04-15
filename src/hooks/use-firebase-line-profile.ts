import { useEffect, useState } from 'react';
import { setUserProfile, getUserProfile } from '@/lib/firestore';
import { uploadProfileImage } from '@/lib/storage';

interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

interface FirebaseLineProfile extends LineProfile {
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Hook for syncing LINE profile data with Firebase Firestore
 * Automatically saves/updates user profile when LINE login is successful
 */
export function useFirebaseLineProfile(lineProfile: LineProfile | null) {
  const [firebaseProfile, setFirebaseProfile] = useState<FirebaseLineProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save or sync LINE profile to Firebase
  useEffect(() => {
    if (!lineProfile || !lineProfile.userId) {
      setFirebaseProfile(null);
      return;
    }

    const syncProfileToFirebase = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Prepare profile data
        const profileData: FirebaseLineProfile = {
          userId: lineProfile.userId,
          displayName: lineProfile.displayName,
          pictureUrl: lineProfile.pictureUrl,
          statusMessage: lineProfile.statusMessage,
          updatedAt: new Date(),
        };

        // Check if profile exists in Firebase
        const existingProfile = await getUserProfile(lineProfile.userId);

        // If profile doesn't exist, add createdAt
        if (!existingProfile) {
          profileData.createdAt = new Date();
        }

        // Save/update profile in Firestore
        await setUserProfile(lineProfile.userId, profileData);

        setFirebaseProfile(profileData);
        console.log('Profile synced to Firebase:', profileData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to sync profile';
        setError(errorMessage);
        console.error('Error syncing profile to Firebase:', err);
      } finally {
        setIsLoading(false);
      }
    };

    syncProfileToFirebase();
  }, [lineProfile]);

  // Function to update profile picture
  const updateProfilePicture = async (imageFile: File): Promise<string | null> => {
    if (!lineProfile || !lineProfile.userId) {
      setError('No user logged in');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Upload image to Cloud Storage
      const pictureUrl = await uploadProfileImage(imageFile, lineProfile.userId);

      // Update profile with new picture URL
      const updatedProfile: FirebaseLineProfile = {
        ...firebaseProfile!,
        pictureUrl,
        updatedAt: new Date(),
      };

      await setUserProfile(lineProfile.userId, updatedProfile);
      setFirebaseProfile(updatedProfile);

      console.log('Profile picture updated:', pictureUrl);
      return pictureUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload picture';
      setError(errorMessage);
      console.error('Error updating profile picture:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update profile information
  const updateProfileInfo = async (updates: Partial<LineProfile>): Promise<boolean> => {
    if (!lineProfile || !lineProfile.userId) {
      setError('No user logged in');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const updatedProfile: FirebaseLineProfile = {
        ...firebaseProfile!,
        ...updates,
        updatedAt: new Date(),
      };

      await setUserProfile(lineProfile.userId, updatedProfile);
      setFirebaseProfile(updatedProfile);

      console.log('Profile info updated:', updatedProfile);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      console.error('Error updating profile info:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    firebaseProfile,
    isLoading,
    error,
    updateProfilePicture,
    updateProfileInfo,
  };
}
