/**
 * Firebase Admin SDK Initialization (Server-side)
 *
 * Initializes Firebase Admin SDK with service account credentials
 * for server-side operations with Firebase Realtime Database.
 */
import { initializeApp, cert, App, getApps } from "firebase-admin/app";
import { getDatabase, Database } from "firebase-admin/database";
import * as fs from "fs";
import * as path from "path";

let adminApp: App | null = null;
let adminDb: Database | null = null;

/**
 * Initialize Firebase Admin SDK with service account credentials.
 * Falls back to application default credentials if no service account file found.
 */
export function initializeFirebaseAdmin(): Database {
  if (adminDb) return adminDb;

  try {
    if (getApps().length === 0) {
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

      if (serviceAccountPath) {
        const resolvedPath = path.resolve(serviceAccountPath);
        if (fs.existsSync(resolvedPath)) {
          const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
          adminApp = initializeApp({
            credential: cert(serviceAccount),
            databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || 
              `https://${process.env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
          });
          console.log("[Firebase Admin] Initialized with service account:", resolvedPath);
        } else {
          console.warn("[Firebase Admin] Service account file not found at:", resolvedPath);
          console.warn("[Firebase Admin] Falling back to application default credentials.");
          adminApp = initializeApp({
            databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || 
              `https://${process.env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
          });
        }
      } else {
        console.warn("[Firebase Admin] No FIREBASE_SERVICE_ACCOUNT_PATH set. Using default credentials.");
        adminApp = initializeApp({
          databaseURL: process.env.VITE_FIREBASE_DATABASE_URL || 
            `https://${process.env.VITE_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
        });
      }
    } else {
      adminApp = getApps()[0];
    }

    adminDb = getDatabase(adminApp);
    console.log("[Firebase Admin] Realtime Database connected successfully.");
    return adminDb;
  } catch (error) {
    console.error("[Firebase Admin] Failed to initialize:", error);
    throw error;
  }
}

/**
 * Get the Firebase Admin Database instance.
 */
export function getAdminDatabase(): Database {
  if (!adminDb) {
    return initializeFirebaseAdmin();
  }
  return adminDb;
}

export { adminApp, adminDb };