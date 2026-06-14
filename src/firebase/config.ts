// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  connectAuthEmulator,
  GoogleAuthProvider,
  OAuthProvider,
  User as FirebaseUser
} from "firebase/auth";
import {
  getDatabase,
  Database,
  ref as dbRef,
  set,
  get,
  update,
  remove,
  push,
  query,
  orderByChild,
  equalTo,
  onValue,
  off,
  child
} from "firebase/database";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Track initialization state
let app: FirebaseApp;
let auth: Auth;
let database: Database;
let storage: FirebaseStorage;
let analytics: Analytics | undefined;
let initialized = false;

/**
 * Initialize Firebase services.
 * Must be called before using any Firebase feature.
 */
function initializeFirebase(): void {
  if (initialized) return;

  // Validate required config values
  const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"] as const;
  for (const key of requiredKeys) {
    if (!firebaseConfig[key]) {
      console.error(
        `Firebase config error: ${key} is missing. ` +
        "Ensure all VITE_FIREBASE_* environment variables are set."
      );
      throw new Error(
        `Firebase initialization failed: missing ${key}. ` +
        "Check your .env file or environment variables."
      );
    }
  }

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);
    storage = getStorage(app);
    initialized = true;

    // Initialize Analytics only in browser environment and if supported
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported) {
          try {
            analytics = getAnalytics(app);
          } catch (e) {
            // Analytics not supported or blocked (ad-blocker, etc.), silently fail
            analytics = undefined;
          }
        }
      }).catch(() => {
        analytics = undefined;
      });
    }

    // Log successful init in development
    if (import.meta.env.DEV) {
      console.info("Firebase initialized successfully:", firebaseConfig.projectId);
    }
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    throw error;
  }
}

/**
 * Connect to Firebase emulators for local development.
 * Requires emulators running on default ports.
 */
function connectEmulators(): void {
  if (!import.meta.env.DEV) return;
  try {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    console.info("Connected to Firebase Auth emulator (localhost:9099)");
  } catch (error) {
    console.warn("Failed to connect to Firebase emulators:", error);
  }
}

/**
 * Lazy initialization: ensures Firebase is ready before any operation.
 */
export function ensureFirebase(): { app: FirebaseApp; auth: Auth; database: Database; storage: FirebaseStorage } {
  if (!initialized) {
    initializeFirebase();
  }
  return { app, auth, database, storage };
}

/**
 * Get current authenticated user or null.
 */
export function getCurrentUser(): FirebaseUser | null {
  if (!initialized) return null;
  return auth.currentUser;
}

/**
 * Check if a user is currently authenticated.
 */
export function isAuthenticated(): boolean {
  if (!initialized) return false;
  return !!auth.currentUser;
}

/**
 * Get current user's UID or null.
 */
export function getCurrentUserId(): string | null {
  if (!initialized) return null;
  return auth.currentUser?.uid || null;
}

/**
 * Accessor functions - ensure init before returning services.
 */
export function getApp(): FirebaseApp {
  return ensureFirebase().app;
}

export function getAuthInstance(): Auth {
  return ensureFirebase().auth;
}

export function getDatabaseInstance(): Database {
  return ensureFirebase().database;
}

export function getStorageInstance(): FirebaseStorage {
  return ensureFirebase().storage;
}

// Initialize immediately on import
initializeFirebase();

// Connect emulators only if explicitly opted in via env variable
// Set VITE_USE_FIREBASE_EMULATORS=true in your .env to enable local emulators
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true") {
  connectEmulators();
}

// Re-export types
export type { FirebaseUser, Auth, Database, FirebaseStorage };

// Export initialized instances for direct import
export { app, auth, database, storage, analytics };

// Re-export Realtime Database utilities for convenience
export {
  dbRef,
  set as dbSet,
  get as dbGet,
  update as dbUpdate,
  remove as dbRemove,
  push as dbPush,
  query as dbQuery,
  orderByChild as dbOrderByChild,
  equalTo as dbEqualTo,
  onValue as dbOnValue,
  off as dbOff,
  child as dbChild
};

// Auth providers for social login
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const appleProvider = new OAuthProvider("apple.com");
appleProvider.setCustomParameters({
  // Apple requires a valid locale for the authorization page
  locale: "en",
});
