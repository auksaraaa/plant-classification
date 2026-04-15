import { useEffect, useState, useCallback, useRef } from 'react';
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

// Direct environment variable reading for debugging
const getLiffIdFromEnv = (): string => {
  const liffId = import.meta.env.VITE_LINE_LIFF_ID;
  console.log('getLiffIdFromEnv:', { 
    liffId, 
    isDefined: liffId !== undefined, 
    isEmpty: liffId === '' 
  });
  return liffId || '';
};

export const useLineAuth = (liffId: string): UseLineAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<LineProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const initPromiseRef = useRef<Promise<void> | null>(null);

  // Initialize LIFF
  useEffect(() => {
    const initializeLiff = async () => {
      try {
        // Use liffId from props, fallback to reading from env
        const finalLiffId = liffId && liffId.trim() ? liffId : getLiffIdFromEnv();
        
        console.log('Attempting LIFF initialization with ID:', { 
          finalLiffId, 
          length: finalLiffId?.length,
          isEmpty: finalLiffId === '' 
        });

        // Ensure liffId is not empty
        if (!finalLiffId || finalLiffId.trim() === '') {
          const errorMsg = 'VITE_LINE_LIFF_ID is not configured. Please check your .env.local file.';
          console.error(errorMsg, { env: import.meta.env.VITE_LINE_LIFF_ID });
          setError(errorMsg);
          return;
        }

        console.log('Initializing LIFF with ID:', finalLiffId);
        await liff.init({ liffId: finalLiffId });
        console.log('LIFF initialized successfully');

        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          const profile = await liff.getProfile();
          setProfile({
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            statusMessage: profile.statusMessage,
          });
          console.log('User is logged in:', profile.displayName);
        } else {
          setIsLoggedIn(false);
          console.log('User is not logged in');
        }
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize LIFF';
        setError(errorMessage);
        console.error('LIFF initialization error:', err);
      }
    };

    // Cache the initialization promise
    if (!initPromiseRef.current) {
      initPromiseRef.current = initializeLiff();
    }
  }, [liffId]);

  const login = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Ensure LIFF is initialized
      if (!liff.isLoggedIn && !liff.isInClient()) {
        // Wait for initialization to complete
        if (initPromiseRef.current) {
          await initPromiseRef.current;
        }
      }

      if (!error && liff.isInClient && !liff.isLoggedIn()) {
        console.log('Initiating LINE login...');
        liff.login({ redirectUri: window.location.href });
      } else if (error) {
        throw new Error(error);
      }
      // Loading state will be cleared when page redirects
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
      setIsLoading(false);
    }
  }, [error]);

  const logout = useCallback(() => {
    try {
      if (liff.isInClient && liff.isLoggedIn()) {
        liff.logout();
      }
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