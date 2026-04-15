import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from '@/config/firebase';

// Upload image to Cloud Storage
export const uploadImage = async (
  file: File,
  storagePath: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, storagePath);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Upload multiple images
export const uploadMultipleImages = async (
  files: File[],
  storagePath: string
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) => {
      const path = `${storagePath}/${Date.now()}-${index}-${file.name}`;
      return uploadImage(file, path);
    });
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

// Delete image from Cloud Storage
export const deleteImage = async (storagePath: string): Promise<void> => {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Get image download URL
export const getImageURL = async (storagePath: string): Promise<string> => {
  try {
    const storageRef = ref(storage, storagePath);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
};

// List all images in a directory
export const listImages = async (storagePath: string): Promise<string[]> => {
  try {
    const storageRef = ref(storage, storagePath);
    const result = await listAll(storageRef);
    
    const urls = await Promise.all(
      result.items.map(item => getDownloadURL(item))
    );
    
    return urls;
  } catch (error) {
    console.error('Error listing images:', error);
    throw error;
  }
};

// Upload plant image
export const uploadPlantImage = async (
  file: File,
  plantId: string
): Promise<string> => {
  const filename = `${Date.now()}-${file.name}`;
  const storagePath = `plants/${plantId}/${filename}`;
  return uploadImage(file, storagePath);
};

// Upload user profile image
export const uploadProfileImage = async (
  file: File,
  userId: string
): Promise<string> => {
  const filename = `profile-${Date.now()}.${file.name.split('.').pop()}`;
  const storagePath = `users/${userId}/${filename}`;
  return uploadImage(file, storagePath);
};

// Delete plant image
export const deletePlantImage = async (
  plantId: string,
  imagePath: string
): Promise<void> => {
  const storagePath = `plants/${plantId}/${imagePath.split('/').pop()}`;
  return deleteImage(storagePath);
};
