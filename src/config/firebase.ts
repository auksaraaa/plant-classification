import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB59kHzhty6IC_ZICKf266uQnNTriZS1UI',
  authDomain: 'plantify-52c88.firebaseapp.com',
  projectId: 'plantify-52c88',
  storageBucket: 'plantify-52c88.firebasestorage.app',
  messagingSenderId: '192498583485',
  appId: '1:192498583485:web:ffc2ded465ce9694b834d4',
  measurementId: 'G-4PQZJR6RWS'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
