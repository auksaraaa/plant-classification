import { useEffect, useState } from 'react';
import { setUserProfile, getUserProfile } from '@/lib/firestore';
import { uploadProfileImage } from '@/lib/storage';

/**
 * Example hook for handling user profile with Firestore
 * This can be integrated with LINE LIFF user data
 */
export function useFirebaseUserProfile(lineUserId?: string) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user profile from Firestore
  useEffect(() => {
    if (lineUserId) {
      loadUserProfile(lineUserId);
    }
  }, [lineUserId]);

  const loadUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      const data = await getUserProfile(userId);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save or update user profile
  const saveProfile = async (
    userId: string,
    profileData: any,
    imageFile?: File
  ) => {
    try {
      setLoading(true);
      let imageUrl = profileData.profileImageUrl;

      // Upload image if provided
      if (imageFile) {
        imageUrl = await uploadProfileImage(imageFile, userId);
      }

      await setUserProfile(userId, {
        ...profileData,
        profileImageUrl: imageUrl
      });

      setProfile({
        id: userId,
        ...profileData,
        profileImageUrl: imageUrl
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save profile';
      setError(errorMessage);
      console.error('Error saving profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    saveProfile,
    loadUserProfile
  };
}
