import { useEffect, useState, useCallback } from 'react';
import { uploadImage, deleteImage } from '@/lib/storage';
import { setDocument, queryDocuments, deleteDocument } from '@/lib/firestore';
import { where } from 'firebase/firestore';
import { toast } from 'sonner';

export interface ImageHistoryItem {
  id: string;
  userId: string;
  imageUrl: string;
  storagePath: string;
  plantName?: string;
  confidence?: number;
  uploadedAt: Date;
  description?: string;
}

/**
 * Hook for managing user's plant image history
 * Handles uploading, retrieving, and deleting images from Firebase
 */
export function useImageHistory(userId: string | undefined) {
  const [images, setImages] = useState<ImageHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch image history from Firestore
  const fetchImageHistory = useCallback(async () => {
    if (!userId) {
      setImages([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const results = await queryDocuments('imageHistory', [
        where('userId', '==', userId)
      ]);
      
      // Convert Firestore timestamps to Date objects and sort by date
      const sortedImages = (results as any[])
        .map(doc => ({
          ...doc,
          uploadedAt: doc.uploadedAt?.toDate?.() || new Date(doc.uploadedAt)
        }))
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      
      setImages(sortedImages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch image history';
      setError(errorMessage);
      console.error('Error fetching image history:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Fetch on mount and when userId changes
  useEffect(() => {
    fetchImageHistory();
  }, [userId, fetchImageHistory]);

  // Upload image and save to history
  const uploadImageToHistory = useCallback(
    async (
      file: File,
      plantName?: string,
      confidence?: number,
      description?: string
    ): Promise<boolean> => {
      if (!userId) {
        setError('No user logged in');
        toast.error('กรุณาเข้าสู่ระบบก่อน');
        return false;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Generate storage path
        const timestamp = Date.now();
        const storagePath = `users/${userId}/images/${timestamp}-${file.name}`;

        // Upload image to Cloud Storage
        const imageUrl = await uploadImage(file, storagePath);

        // Save to Firestore
        const historyId = `${userId}-${timestamp}`;
        const historyData = {
          id: historyId,
          userId,
          imageUrl,
          storagePath,
          plantName,
          confidence,
          description,
          uploadedAt: new Date(),
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        };

        await setDocument('imageHistory', historyId, historyData);

        // Update local state
        setImages(prev => [historyData as ImageHistoryItem, ...prev]);
        
        toast.success('บันทึกรูปสำเร็จ!');
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
        setError(errorMessage);
        toast.error('ไม่สามารถบันทึกรูปได้');
        console.error('Error uploading image:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // Delete image from history
  const deleteImageFromHistory = useCallback(
    async (historyId: string, storagePath: string): Promise<boolean> => {
      try {
        setIsLoading(true);
        setError(null);

        // Delete from Cloud Storage
        await deleteImage(storagePath);

        // Delete from Firestore
        await deleteDocument('imageHistory', historyId);
        
        // Update local state
        setImages(prev => prev.filter(img => img.id !== historyId));
        
        toast.success('ลบรูปสำเร็จ!');
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete image';
        setError(errorMessage);
        toast.error('ไม่สามารถลบรูปได้');
        console.error('Error deleting image:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    images,
    isLoading,
    error,
    uploadImageToHistory,
    deleteImageFromHistory,
    refetch: fetchImageHistory
  };
}
