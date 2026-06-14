import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  WithFieldValue,
  serverTimestamp,
  addDoc,
  FirestoreError,
} from "firebase/firestore";
import { db, ensureFirebase } from "../firebase/config";
import type { AppUser } from "./authService";

// ============================================================================
// Types
// ============================================================================

export interface Project {
  id?: string;
  userId: string;
  title: string;
  description: string;
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  milestones?: string[];
}

export interface UserSettings {
  userId: string;
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  weeklyDigest: boolean;
  studyReminders: boolean;
  preferredStudyTime?: string;
  language: string;
  updatedAt: string;
}

// ============================================================================
// Error Handling
// ============================================================================

const FIRESTORE_ERROR_MESSAGES: Record<string, string> = {
  "permission-denied": "You don't have permission to access this data.",
  "not-found": "The requested document was not found.",
  "already-exists": "This document already exists.",
  "resource-exhausted": "Quota exceeded. Please try again later.",
  "unavailable": "Service temporarily unavailable. Please try again.",
  "deadline-exceeded": "Request timed out. Please check your connection.",
};

function getFirestoreErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const firestoreError = error as FirestoreError;
    return FIRESTORE_ERROR_MESSAGES[firestoreError.code] || firestoreError.message || "A database error occurred.";
  }
  return "An unexpected database error occurred.";
}

/**
 * Convert a Firestore timestamp or string to ISO string.
 */
function toDateString(value: Timestamp | string | undefined): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return new Date().toISOString();
}

// ============================================================================
// Users Collection (users/{uid})
// ============================================================================

/**
 * Get a user document by UID.
 */
export async function getUserById(uid: string): Promise<AppUser | null> {
  ensureFirebase();

  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as AppUser;
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error(getFirestoreErrorMessage(error));
  }
}

/**
 * Update user document fields.
 */
export async function updateUser(
  uid: string,
  data: Partial<AppUser>
): Promise<void> {
  ensureFirebase();

  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...data,
      lastLoginAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error(getFirestoreErrorMessage(error));
  }
}

/**
 * Delete a user document.
 */
export async function deleteUser(uid: string): Promise<void> {
  ensureFirebase();

  try {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error(getFirestoreErrorMessage(error));
  }
}

// ============================================================================
// Projects Collection (users/{uid}/projects/{projectId})
// ============================================================================

/**
 * Create a new project under the user's subcollection.
 */
export async function createProject(
  userId: string,
  projectData: Omit<Project, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<string> {
  ensureFirebase();

  try {
    const projectsRef = collection(db, "users", userId, "projects");
    const now = new Date().toISOString();

    const docRef = await addDoc(projectsRef, {
      ...projectData,
      userId,
      createdAt: now,
      updatedAt: now,
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error(getFirestoreErrorMessage(error));
  }
}

/**
 * Get all projects for a specific user.
 */
export async function getProjectsByUser(userId: string): Promise<Project[]> {
  ensureFirebase();

  try {
    const projectsRef = collection(db, "users", userId, "projects");
    const q = query(projectsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
  } catch (error) {
    console.error("Error getting projects:", error);
    throw new Error(getFirestoreErrorMessage(error));
  }
}

/**
 * Get a single project by ID.
 */
export async function getProjectById(
  userId: string,
  projectId: string
): Promise<Project | null> {
  ensureFirebase();

  try {
    const projectRef = doc(db, "users", userId, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
      return { id: projectSnap.id, ...projectSnap.data() } as Project;
    }
    return null;
  } catch (error) {
    console.error("Error getting project:", error);
    throw new Error(getFirestoreErrorMessage(error));
  }
}

/**
 * Update a project.
 */
export async function updateProject(
  userId: string,
  projectId: string,
  data: Partial<Project>
): Promise<void> {
  ensureFirebase();

  try {
    const projectRef = doc(db, "users", userId, "projects", projectId);
    await updateDoc(projectRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error(getFirestoreErrorMessage(error));
  }
}

/**
 * Delete a project.
 */
export async function deleteProject(
  userId: string,
  projectId: string
): Promise<void> {
  ensureFirebase();

  try {
    const projectRef = doc(db, "users", userId, "projects", projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error(getFirestoreErrorMessage(error));
  }
}

// ============================================================================
// Settings Collection (users/{uid}/settings)
// ============================================================================

/**
 * Get user settings.
 */
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  ensureFirebase();

  try {
    const settingsRef = doc(db, "users", userId, "settings", "preferences");
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {
      return { userId, ...settingsSnap.data() } as UserSettings;
    }
    return null;
  } catch (error) {
    console.error("Error getting settings:", error);
    throw new Error(getFirestoreErrorMessage(error));
  }
}

/**
 * Create or update user settings.
 */
export async function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>
): Promise<void> {
  ensureFirebase();

  try {
    const settingsRef = doc(db, "users", userId, "settings", "preferences");
    await setDoc(
      settingsRef,
      {
        ...settings,
        userId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating settings:", error);
    throw new Error(getFirestoreErrorMessage(error));
  }
}

// ============================================================================
// Generic Data Helpers (for extensibility)
// ============================================================================

/**
 * Generic function to fetch all documents from a collection.
 */
export async function getAllDocuments<T>(collectionPath: string): Promise<T[]> {
  ensureFirebase();

  try {
    const ref = collection(db, collectionPath);
    const querySnapshot = await getDocs(ref);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as T[];
  } catch (error) {
    console.error(`Error getting documents from ${collectionPath}:`, error);
    throw new Error(getFirestoreErrorMessage(error));
  }
}

/**
 * Generic function to set a document (create or overwrite).
 */
export async function setDocument(
  collectionPath: string,
  docId: string,
  data: Record<string, unknown>
): Promise<void> {
  ensureFirebase();

  try {
    const ref = doc(db, collectionPath, docId);
    await setDoc(ref, {
      ...data,
      id: docId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error setting document ${collectionPath}/${docId}:`, error);
    throw new Error(getFirestoreErrorMessage(error));
  }
}

/**
 * Generic function to merge data into an existing document.
 */
export async function mergeDocument(
  collectionPath: string,
  docId: string,
  data: Record<string, unknown>
): Promise<void> {
  ensureFirebase();

  try {
    const ref = doc(db, collectionPath, docId);
    await setDoc(ref, data, { merge: true });
  } catch (error) {
    console.error(`Error merging document ${collectionPath}/${docId}:`, error);
    throw new Error(getFirestoreErrorMessage(error));
  }
}

/**
 * Generic function to delete a document.
 */
export async function removeDocument(
  collectionPath: string,
  docId: string
): Promise<void> {
  ensureFirebase();

  try {
    const ref = doc(db, collectionPath, docId);
    await deleteDoc(ref);
  } catch (error) {
    console.error(`Error deleting document ${collectionPath}/${docId}:`, error);
    throw new Error(getFirestoreErrorMessage(error));
  }
}