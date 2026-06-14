// This file is now a compatibility layer that re-exports from the new centralized config
// All new code should import from '@/config/firebase' or '../config/firebase' directly
import {
  app,
  auth,
  analytics,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getCurrentUserId,
  FirebaseUser
} from "./config/firebase";

// Maintain backward compatibility with existing code
import firebaseConfig from "../firebase-applet-config.json";
const forceMockMode = true;
const isMock = forceMockMode || firebaseConfig.apiKey === "https://ai-powered-personalized-c81d6-default-rtdb.firebaseio.com/";

// If Firebase failed to initialize in the new config, fall back to mock mode
export const isFirebaseAuthMock = !auth || isMock;

// Provide premium Mock Auth methods mimicking natural Firebase calls cleanly
class MockAuthService {
  private listeners: Array<(user: any) => void> = [];
  private currentUserObj: any = null;

  constructor() {
    // Try to auto-restore from previous local storage session
    const cached = localStorage.getItem("vintage_session_user");
    if (cached) {
      try {
        this.currentUserObj = JSON.parse(cached);
      } catch (e) {
        this.currentUserObj = null;
      }
    } else {
      // Seed a default mock user for premium ease of testing
      this.currentUserObj = {
        uid: "sample_student",
        email: "student@learning.edu",
        displayName: "James Sterling",
        emailVerified: true
      };
    }
  }

  onAuthStateChanged(callback: (user: any) => void) {
    this.listeners.push(callback);
    // Fire immediately with active user
    callback(this.currentUserObj);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private triggerChange() {
    this.listeners.forEach((l) => l(this.currentUserObj));
    if (this.currentUserObj) {
      localStorage.setItem("vintage_session_user", JSON.stringify(this.currentUserObj));
    } else {
      localStorage.removeItem("vintage_session_user");
    }
  }

  async signInWithEmail(email: string) {
    // Treat any local password as correct in mock mode
    const mockUser = {
      uid: email.toLowerCase() === "nakulgharote@gmail.com" ? "admin_user" : "u_" + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      displayName: email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
      emailVerified: true
    };
    this.currentUserObj = mockUser;
    this.triggerChange();
    return { user: mockUser };
  }

  async createUserWithEmail(email: string, displayName: string) {
    const mockUser = {
      uid: "u_" + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      displayName: displayName || email.split("@")[0],
      emailVerified: true
    };
    this.currentUserObj = mockUser;
    this.triggerChange();
    return { user: mockUser };
  }

  async signOut() {
    this.currentUserObj = null;
    localStorage.removeItem("vintage_session_user");
    this.triggerChange();
  }

  get currentUser() {
    return this.currentUserObj;
  }
}

const mockAuthInstance = new MockAuthService();

export { auth, analytics, mockAuthInstance };

// Bridge client calls uniformly
export function appSignIn(email: string, pass: string) {
  if (isFirebaseAuthMock) {
    return mockAuthInstance.signInWithEmail(email);
  } else {
    return signInWithEmailAndPassword(auth, email, pass);
  }
}

export function appCreateUser(email: string, pass: string, name: string) {
  if (isFirebaseAuthMock) {
    return mockAuthInstance.createUserWithEmail(email, name);
  } else {
    return createUserWithEmailAndPassword(auth, email, pass);
  }
}

export function appSignOut() {
  if (isFirebaseAuthMock) {
    return mockAuthInstance.signOut();
  } else {
    return signOut(auth);
  }
}

export function appOnAuthStateChanged(callback: (user: any) => void) {
  if (isFirebaseAuthMock) {
    return mockAuthInstance.onAuthStateChanged(callback);
  } else {
    return onAuthStateChanged(auth, callback);
  }
}

export async function getUserSession(): Promise<any> {
  return new Promise((resolve) => {
    let unsub: (() => void) | undefined;
    unsub = appOnAuthStateChanged((user) => {
      resolve(user);
      if (typeof unsub === "function") unsub();
    });
  });
}