import React, { createContext, useContext, ReactNode } from 'react';
import { useLineAuth } from '@/hooks/use-line-auth';
import { useFirebaseLineProfile } from '@/hooks/use-firebase-line-profile';
import { lineConfig } from '@/config/line-config';

interface LineContextType {
  isLoading: boolean;
  isLoggedIn: boolean;
  profile: {
    userId: string;
    displayName: string;
    pictureUrl?: string;
    statusMessage?: string;
  } | null;
  error: string | null;
  login: () => Promise<void>;
  logout: () => void;
  firebaseProfileSynced: boolean;
}

const LineContext = createContext<LineContextType | undefined>(undefined);

export const LineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const lineAuth = useLineAuth(lineConfig.liffId);
  const { firebaseProfile, isLoading: isFirebaseLoading } = useFirebaseLineProfile(lineAuth.profile);

  return (
    <LineContext.Provider
      value={{
        ...lineAuth,
        firebaseProfileSynced: !!firebaseProfile && !isFirebaseLoading,
      }}
    >
      {children}
    </LineContext.Provider>
  );
};

export const useLineContext = (): LineContextType => {
  const context = useContext(LineContext);
  if (!context) {
    throw new Error('useLineContext must be used within LineProvider');
  }
  return context;
};
