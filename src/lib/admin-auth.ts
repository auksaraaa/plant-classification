import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  createdAt?: Date;
  [key: string]: any;
}

/**
 * Check if a user has admin role in Firestore
 * @param email - The user's email to check admin status
 * @returns Boolean indicating if user is admin
 */
export const checkAdminStatus = async (email: string): Promise<boolean> => {
  try {
    console.log('🔍 Checking admin status for email:', email);
    
    // Query users collection by email (email is used as document ID)
    const userDoc = await getDoc(doc(db, 'users', email));
    console.log('📄 Firestore doc exists:', userDoc.exists());
    console.log('📋 Firestore doc data:', userDoc.data());
    
    if (!userDoc.exists()) {
      console.warn(`⚠️  Document not found at users/${email}`);
      console.warn('✅ Make sure:');
      console.warn('   1. Collection name is "users" (lowercase)');
      console.warn('   2. Document ID is:', email);
      console.warn('   3. Field "role" has value "admin"');
      console.warn('📍 Expected path: /users/' + email);
      return false;
    }
    
    const data = userDoc.data();
    const isAdmin = data?.role === 'admin';
    
    console.log('✅ Admin check result:', isAdmin);
    console.log('   - Role value:', data?.role);
    
    return isAdmin;
  } catch (err) {
    console.error('❌ Error checking admin status:', err);
    if (err instanceof Error) {
      console.error('   Error message:', err.message);
      console.error('   Error code:', (err as any).code);
    }
    return false;
  }
};

/**
 * Get user details from Firestore
 * @param email - The user's email
 * @returns AdminUser object or null if not found
 */
export const getUser = async (email: string): Promise<AdminUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', email));

    if (!userDoc.exists()) {
      return null;
    }

    return {
      id: userDoc.id,
      email: userDoc.id,
      ...userDoc.data(),
    } as AdminUser;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};
