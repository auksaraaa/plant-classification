import { useEffect, useState } from 'react';
import { getDocuments, setDocument, deleteDocument as deleteFirestoreDocument, updateDocument as updateFirestoreDocument } from '@/lib/firestore';

/**
 * Hook for fetching and managing categories from Firestore
 */
export function useCategories() {
  const [categories, setCategories] = useState<string[]>(['ทั้งหมด']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from Firestore
      try {
        const firestoreCategories = await getDocuments('categories');
        if (firestoreCategories && firestoreCategories.length > 0) {
          // Sort by order field, then by name
          const sorted = firestoreCategories.sort((a: any, b: any) => {
            if (a.order !== undefined && b.order !== undefined) {
              return a.order - b.order;
            }
            return 0;
          });
          const categoryNames = sorted.map((cat: any) => cat.name);
          // Always add "ทั้งหมด" as first item
          if (!categoryNames.includes('ทั้งหมด')) {
            categoryNames.unshift('ทั้งหมด');
          }
          setCategories(categoryNames);
        } else {
          // Default categories
          setCategories(['ทั้งหมด', 'ไม้ดอก', 'ไม้ใบ', 'สมุนไพร', 'ไม้ยืนต้น', 'ไม้น้ำ']);
        }
      } catch (firestoreError) {
        console.warn('Failed to load from Firestore, using default categories:', firestoreError);
        setCategories(['ทั้งหมด', 'ไม้ดอก', 'ไม้ใบ', 'สมุนไพร', 'ไม้ยืนต้น', 'ไม้น้ำ']);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
      setCategories(['ทั้งหมด', 'ไม้ดอก', 'ไม้ใบ', 'สมุนไพร', 'ไม้ยืนต้น', 'ไม้น้ำ']);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryName: string) => {
    try {
      const docId = categoryName.toLowerCase().replace(/\s+/g, '-');
      const categoryData = {
        name: categoryName,
        order: categories.length,
        createdAt: new Date().toISOString(),
      };
      
      await setDocument('categories', docId, categoryData);
      
      // Update local state
      if (!categories.includes(categoryName)) {
        setCategories([...categories, categoryName]);
      }
      return { success: true };
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  const deleteCategory = async (categoryName: string) => {
    try {
      // Don't allow deleting "ทั้งหมด"
      if (categoryName === 'ทั้งหมด') {
        throw new Error('Cannot delete "ทั้งหมด" category');
      }

      const docId = categoryName.toLowerCase().replace(/\s+/g, '-');
      
      // Delete from Firestore
      await deleteFirestoreDocument('categories', docId);
      
      // Update local state
      setCategories(categories.filter(cat => cat !== categoryName));
      return { success: true };
    } catch (err) {
      console.error('Error deleting category:', err);
      throw err;
    }
  };

  const updateCategory = async (oldName: string, newName: string) => {
    try {
      // Don't allow renaming "ทั้งหมด"
      if (oldName === 'ทั้งหมด') {
        throw new Error('Cannot rename "ทั้งหมด" category');
      }

      const oldDocId = oldName.toLowerCase().replace(/\s+/g, '-');
      const newDocId = newName.toLowerCase().replace(/\s+/g, '-');
      
      // Delete old and create new
      await deleteFirestoreDocument('categories', oldDocId);
      
      const categoryData = {
        name: newName,
        order: categories.indexOf(oldName),
        createdAt: new Date().toISOString(),
      };
      
      await setDocument('categories', newDocId, categoryData);
      
      // Update local state
      const updated = categories.map(cat => cat === oldName ? newName : cat);
      setCategories(updated);
      return { success: true };
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    deleteCategory,
    updateCategory,
    refreshCategories: loadCategories,
  };
}
