/**
 * Realtime Database Service
 *
 * Provides CRUD operations for the Firebase Realtime Database.
 * Data structure:
 *   /users/{uid}            - User profile
 *   /users/{uid}/projects   - User's projects (nested object)
 *   /users/{uid}/settings   - User settings
 */
import {
  database,
  ensureFirebase,
  dbRef,
  dbSet,
  dbGet,
  dbUpdate,
  dbRemove,
  dbPush,
  dbQuery,
  dbOrderByChild,
  dbEqualTo,
  dbOnValue,
  dbOff,
} from "../firebase/config";
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
// Users (/users/{uid})
// ============================================================================

/**
 * Get a user record by UID.
 */
export async function getUserById(uid: string): Promise<AppUser | null> {
  ensureFirebase();

  try {
    const snapshot = await dbGet(dbRef(database, `users/${uid}`));
    if (snapshot.exists()) {
      return snapshot.val() as AppUser;
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

/**
 * Update user record fields.
 */
export async function updateUser(uid: string, data: Partial<AppUser>): Promise<void> {
  ensureFirebase();

  try {
    await dbUpdate(dbRef(database, `users/${uid}`), {
      ...data,
      lastLoginAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * Delete a user record.
 */
export async function deleteUser(uid: string): Promise<void> {
  ensureFirebase();

  try {
    await dbRemove(dbRef(database, `users/${uid}`));
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

// ============================================================================
// Projects (/users/{uid}/projects/{projectId})
// ============================================================================

/**
 * Create a new project for a user.
 * Uses push() to generate a unique ID.
 */
export async function createProject(
  userId: string,
  projectData: Omit<Project, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<string> {
  ensureFirebase();

  try {
    const projectsRef = dbRef(database, `users/${userId}/projects`);
    const now = new Date().toISOString();
    const newRef = dbPush(projectsRef);

    await dbSet(newRef, {
      ...projectData,
      userId,
      createdAt: now,
      updatedAt: now,
    });

    return newRef.key || "";
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

/**
 * Get all projects for a user.
 * Returns as an array.
 */
export async function getProjectsByUser(userId: string): Promise<Project[]> {
  ensureFirebase();

  try {
    const snapshot = await dbGet(dbRef(database, `users/${userId}/projects`));
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    // Convert from object { key: value } to array
    return Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    })) as Project[];
  } catch (error) {
    console.error("Error getting projects:", error);
    throw error;
  }
}

/**
 * Get a single project by ID.
 */
export async function getProjectById(userId: string, projectId: string): Promise<Project | null> {
  ensureFirebase();

  try {
    const snapshot = await dbGet(dbRef(database, `users/${userId}/projects/${projectId}`));
    if (snapshot.exists()) {
      return { id: projectId, ...snapshot.val() } as Project;
    }
    return null;
  } catch (error) {
    console.error("Error getting project:", error);
    throw error;
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
    await dbUpdate(dbRef(database, `users/${userId}/projects/${projectId}`), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

/**
 * Delete a project.
 */
export async function deleteProject(userId: string, projectId: string): Promise<void> {
  ensureFirebase();

  try {
    await dbRemove(dbRef(database, `users/${userId}/projects/${projectId}`));
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

// ============================================================================
// Settings (/users/{uid}/settings)
// ============================================================================

/**
 * Get user settings.
 */
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  ensureFirebase();

  try {
    const snapshot = await dbGet(dbRef(database, `users/${userId}/settings`));
    if (snapshot.exists()) {
      return { userId, ...snapshot.val() } as UserSettings;
    }
    return null;
  } catch (error) {
    console.error("Error getting settings:", error);
    throw error;
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
    await dbSet(dbRef(database, `users/${userId}/settings`), {
      ...settings,
      userId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
}

// ============================================================================
// Generic Helpers
// ============================================================================

/**
 * Convert a Realtime Database object (key-value pairs) to an array.
 */
export function snapshotToArray<T>(snapshot: { exists(): boolean; val(): unknown }): T[] {
  if (!snapshot.exists()) return [];
  const data = snapshot.val() as Record<string, T>;
  return Object.keys(data).map((key) => ({ id: key, ...data[key] })) as T[];
}