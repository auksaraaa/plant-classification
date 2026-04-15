import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  Query,
  DocumentData,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// Generic function to add/update a document
export const setDocument = async (
  collectionName: string,
  docId: string,
  data: DocumentData
) => {
  try {
    await setDoc(doc(db, collectionName, docId), data, { merge: true });
    return { success: true, id: docId };
  } catch (error) {
    console.error('Error setting document:', error);
    throw error;
  }
};

// Generic function to get a single document
export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

// Generic function to get all documents from a collection
export const getDocuments = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

// Generic function to query documents
export const queryDocuments = async (
  collectionName: string,
  queryConstraints: any[]
) => {
  try {
    const q = query(collection(db, collectionName), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
};

// Function to delete a document
export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Function to update a document
export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: DocumentData
) => {
  try {
    await updateDoc(doc(db, collectionName, docId), data);
    return { success: true };
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Plant-specific functions
export const addPlant = async (plantData: any) => {
  const plantId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return setDocument('plants', plantId, {
    ...plantData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

export const getPlant = async (plantId: string) => {
  return getDocument('plants', plantId);
};

export const getAllPlants = async () => {
  return getDocuments('plants');
};

export const updatePlant = async (plantId: string, plantData: any) => {
  return updateDocument('plants', plantId, {
    ...plantData,
    updatedAt: new Date()
  });
};

export const deletePlant = async (plantId: string) => {
  return deleteDocument('plants', plantId);
};

// User profile functions
export const setUserProfile = async (userId: string, profileData: any) => {
  return setDocument('userProfiles', userId, {
    ...profileData,
    updatedAt: new Date()
  });
};

export const getUserProfile = async (userId: string) => {
  return getDocument('userProfiles', userId);
};

export const updateUserProfile = async (userId: string, profileData: any) => {
  return updateDocument('userProfiles', userId, {
    ...profileData,
    updatedAt: new Date()
  });
};
