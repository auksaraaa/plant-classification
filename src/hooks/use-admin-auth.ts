import { useState, useCallback, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  getAuth,
} from 'firebase/auth';
import app from '@/config/firebase';
import { checkAdminStatus } from '@/lib/admin-auth';

interface AdminUser extends User {
  isAdmin?: boolean;
}

/**
 * Hook for handling admin authentication using Firebase Authentication
 * Only users with role: 'admin' in Firestore can access admin panel
 * Stores auth state in localStorage for persistence
 */
export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth(app);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin = await checkAdminStatus(firebaseUser.email || '');
        if (isAdmin) {
          const adminUser: AdminUser = {
            ...firebaseUser,
            isAdmin: true
          };
          setUser(adminUser);
          localStorage.setItem('adminToken', firebaseUser.uid);
          localStorage.setItem('adminEmail', firebaseUser.email || '');
        } else {
          // Not an admin, sign out
          await firebaseSignOut(auth);
          setUser(null);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminEmail');
          setError('ไม่มีสิทธิ์ในการเข้าถึงแอดมิน');
        }
      } else {
        setUser(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null);
        setLoading(true);

        console.log('🔐 Attempting login with:', email);

        // Sign in with Firebase Authentication
        const result = await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Firebase Auth Success - UID:', result.user.uid);

        // Check if user is admin in Firestore
        console.log('🔍 Checking admin status for email:', result.user.email);
        const isAdmin = await checkAdminStatus(result.user.email || '');
        console.log('📋 Admin check result:', isAdmin);

        if (!isAdmin) {
          // Not an admin, sign out immediately
          console.log('❌ User is not admin, signing out');
          await firebaseSignOut(auth);
          throw new Error('ไม่มีสิทธิ์ในการเข้าถึงแอดมิน');
        }

        console.log('✅ User is admin, setting session');
        const adminUser: AdminUser = {
          ...result.user,
          isAdmin: true
        };
        setUser(adminUser);
        localStorage.setItem('adminToken', result.user.uid);
        localStorage.setItem('adminEmail', result.user.email || '');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'เข้าสู่ระบบล้มเหลว';
        console.error('❌ Login Error:', message);
        if (err instanceof Error) {
          console.error('Full error:', err);
        }
        setError(message);
        setUser(null);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [auth]
  );

  const logout = useCallback(async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ออกจากระบบล้มเหลว';
      setError(message);
      throw err;
    }
  }, [auth]);

  const isAuthenticated = !!user && user.isAdmin === true;

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout
  };
}
