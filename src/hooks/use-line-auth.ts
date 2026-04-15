import { useEffect, useState, useCallback } from 'react';
import liff from '@line/liff';

interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

interface UseLineAuthReturn {
  isLoading: boolean;
  isLoggedIn: boolean;
  profile: LineProfile | null;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

export const useLineAuth = (liffId: string): UseLineAuthReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<LineProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize LIFF
  useEffect(() => {
    const initializeLiff = async () => {
      try {
        setIsLoading(true);
        await liff.init({ liffId });

        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          const profile = await liff.getProfile();
          setProfile({
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            statusMessage: profile.statusMessage,
          });
        } else {
          setIsLoggedIn(false);
        }
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize LIFF';
        setError(errorMessage);
        console.error('LIFF initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (liffId) {
      initializeLiff();
    }
  }, [liffId]);

  const login = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      liff.logout();
      setIsLoggedIn(false);
      setProfile(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }, []);

  return {
    isLoading,
    isLoggedIn,
    profile,
    error,
    login,
    logout,
  };
};
