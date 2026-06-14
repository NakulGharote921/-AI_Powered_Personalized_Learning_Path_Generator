import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { getDatabase, Database, ref as dbRef, set, get, update, remove } from "firebase/database";
import { getStorage, FirebaseStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUY3lkq-dA0NQXhLB5o9rys9DrEKzqCQw",
  authDomain: "ai-powered-personalized-c81d6.firebaseapp.com",
  databaseURL: "https://ai-powered-personalized-c81d6-default-rtdb.firebaseio.com",
  projectId: "ai-powered-personalized-c81d6",
  storageBucket: "ai-powered-personalized-c81d6.firebasestorage.app",
  messagingSenderId: "847736330512",
  appId: "1:847736330512:web:84f1d45f27e33b2e9aad95",
  measurementId: "G-Z0YYFX1JRY"
};

// Declare variables for Firebase services
let app: FirebaseApp;
let auth: Auth;
let database: Database;
let storage: FirebaseStorage;
let analytics: Analytics | undefined;

// Flag to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Initialize Firebase only once
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Authentication (always available)
auth = getAuth(app);

// Initialize Realtime Database
database = getDatabase(app);

// Initialize Cloud Storage
storage = getStorage(app);

// Initialize Analytics only in browser environment and if supported
if (isBrowser) {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics not supported, silently fail
    analytics = undefined;
  });
}

// Export types for use throughout the application
export type { FirebaseUser, Auth, Database, FirebaseStorage, Analytics };

// Export all Firebase services
export { 
  app, 
  auth, 
  database, 
  storage, 
  analytics,
  // Auth methods
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  // Database methods
  dbRef,
  set,
  get,
  update,
  remove,
  // Storage methods
  storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
};

// Helper to get current user safely
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Helper to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser;
};

// Helper to get current user ID (returns null if not authenticated)
export const getCurrentUserId = (): string | null => {
  return auth.currentUser?.uid || null;
};