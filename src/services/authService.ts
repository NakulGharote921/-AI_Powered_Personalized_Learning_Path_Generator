import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
  AuthError,
} from "firebase/auth";
import {
  auth,
  database,
  ensureFirebase,
  googleProvider,
  appleProvider,
  dbRef,
  dbSet,
  dbGet,
  dbUpdate,
} from "../firebase/config";

/**
 * Type representing our application user stored in Realtime Database.
 */
export type AuthProviderType = "email" | "google" | "apple";

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: "student" | "admin";
  photoURL?: string;
  provider: AuthProviderType;
  createdAt: string;
  lastLoginAt: string;
  experienceLevel?: string;
  careerGoals?: string;
  interests?: string;
  weeklyHours?: number;
}

/**
 * Firebase Auth error codes mapped to user-friendly messages.
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "No account found with this email address.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/invalid-credential": "Invalid email or password. Please check your credentials.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/operation-not-allowed": "This sign-in method is not enabled.",
  "auth/popup-closed-by-user": "Sign-in popup was closed before completing.",
  "auth/popup-blocked": "Sign-in popup was blocked by your browser. Please allow popups for this site.",
  "auth/requires-recent-login": "Please log out and log in again before updating sensitive information.",
  "auth/account-exists-with-different-credential":
    "An account already exists with the same email address but different sign-in method. Sign in using the original method.",
  "auth/cancelled-popup-request": "Sign-in was cancelled. Please try again.",
  "auth/unauthorized-domain": "This domain is not authorized for Firebase authentication. Please check Firebase Console > Authentication > Settings > Authorized domains.",
};

/**
 * Extract a user-friendly error message from a Firebase Auth error.
 */
function getAuthErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const authError = error as AuthError;
    return AUTH_ERROR_MESSAGES[authError.code] || authError.message || "An unexpected authentication error occurred.";
  }
  return "An unexpected error occurred. Please try again.";
}

/**
 * Get the Realtime Database reference for a user's data.
 * Data is stored at: /users/{uid}
 */
function getUserRef(uid: string) {
  return dbRef(database, `users/${uid}`);
}

/**
 * Create a new user entry in Realtime Database under /users/{uid}.
 */
async function createUserRecord(
  firebaseUser: FirebaseUser,
  additionalData?: { displayName?: string; role?: "student" | "admin"; provider?: AuthProviderType }
): Promise<AppUser> {
  ensureFirebase();

  const now = new Date().toISOString();
  const provider = additionalData?.provider || "email";

  const userData: AppUser = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    displayName: additionalData?.displayName || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
    role: additionalData?.role || "student",
    photoURL: firebaseUser.photoURL || "",
    provider,
    createdAt: now,
    lastLoginAt: now,
  };

  // Write to /users/{uid}
  await dbSet(getUserRef(firebaseUser.uid), userData);
  return userData;
}

/**
 * Sign up a new user with email and password.
 * Automatically creates a user record in Realtime Database.
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string,
  role: "student" | "admin" = "student"
): Promise<{ user: AppUser; firebaseUser: FirebaseUser }> {
  ensureFirebase();

  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    if (displayName) {
      await updateProfile(firebaseUser, { displayName });
    }

    const appUser = await createUserRecord(firebaseUser, { displayName, role });

    return { user: appUser, firebaseUser };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Sign in an existing user with email and password.
 * Updates the lastLoginAt timestamp in Realtime Database.
 */
export async function signIn(
  email: string,
  password: string
): Promise<{ user: AppUser; firebaseUser: FirebaseUser }> {
  ensureFirebase();

  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Fetch or create the user record
    const snapshot = await dbGet(getUserRef(firebaseUser.uid));
    let appUser: AppUser;

    if (snapshot.exists()) {
      appUser = snapshot.val() as AppUser;
      // Update last login
      await dbUpdate(getUserRef(firebaseUser.uid), { lastLoginAt: new Date().toISOString() });
      appUser.lastLoginAt = new Date().toISOString();
    } else {
      // Create record if it doesn't exist (edge case)
      appUser = await createUserRecord(firebaseUser);
    }

    return { user: appUser, firebaseUser };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Sign out the current user.
 */
export async function logOut(): Promise<void> {
  ensureFirebase();

  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Send a password reset email to the given address.
 */
export async function resetPassword(email: string): Promise<void> {
  ensureFirebase();

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Listen for auth state changes.
 * Returns an unsubscribe function.
 */
export function onAuthChange(
  callback: (user: FirebaseUser | null) => void
): () => void {
  ensureFirebase();

  return onAuthStateChanged(auth, callback);
}

/**
 * Fetch the AppUser record from Realtime Database by UID.
 */
export async function getUserDocument(uid: string): Promise<AppUser | null> {
  ensureFirebase();

  try {
    const snapshot = await dbGet(getUserRef(uid));
    if (snapshot.exists()) {
      return snapshot.val() as AppUser;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user record:", error);
    return null;
  }
}

/**
 * Sign in with Google using a popup.
 * Creates a user record in Realtime Database on first login.
 */
export async function signInWithGoogle(): Promise<{ user: AppUser; firebaseUser: FirebaseUser }> {
  ensureFirebase();

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    const snapshot = await dbGet(getUserRef(firebaseUser.uid));
    let appUser: AppUser;

    if (snapshot.exists()) {
      appUser = snapshot.val() as AppUser;
      await dbUpdate(getUserRef(firebaseUser.uid), { lastLoginAt: new Date().toISOString() });
      appUser.lastLoginAt = new Date().toISOString();
    } else {
      appUser = await createUserRecord(firebaseUser, {
        displayName: firebaseUser.displayName || undefined,
        provider: "google",
        role: firebaseUser.email?.toLowerCase() === "nakulgharote@gmail.com" ? "admin" : "student",
      });
    }

    return { user: appUser, firebaseUser };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Sign in with Apple using a popup.
 * Creates a user record in Realtime Database on first login.
 */
export async function signInWithApple(): Promise<{ user: AppUser; firebaseUser: FirebaseUser }> {
  ensureFirebase();

  try {
    const result = await signInWithPopup(auth, appleProvider);
    const firebaseUser = result.user;

    const snapshot = await dbGet(getUserRef(firebaseUser.uid));
    let appUser: AppUser;

    if (snapshot.exists()) {
      appUser = snapshot.val() as AppUser;
      await dbUpdate(getUserRef(firebaseUser.uid), { lastLoginAt: new Date().toISOString() });
      appUser.lastLoginAt = new Date().toISOString();
    } else {
      appUser = await createUserRecord(firebaseUser, {
        displayName: firebaseUser.displayName || undefined,
        provider: "apple",
        role: "student",
      });
    }

    return { user: appUser, firebaseUser };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Get the currently authenticated Firebase user.
 */
export function getCurrentFirebaseUser(): FirebaseUser | null {
  ensureFirebase();
  return auth.currentUser;
}