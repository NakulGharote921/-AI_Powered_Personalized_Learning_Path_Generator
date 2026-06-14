import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { User as FirebaseUser } from "firebase/auth";
import {
  AppUser,
  signIn,
  signUp,
  logOut,
  resetPassword,
  onAuthChange,
  getUserDocument,
  signInWithGoogle,
  signInWithApple,
} from "../services/authService";
import { ensureFirebase } from "../firebase/config";

// ============================================================================
// Types
// ============================================================================

export interface AuthState {
  /** The authenticated Firebase user, or null if not authenticated */
  firebaseUser: FirebaseUser | null;
  /** Our application user from Firestore, or null if not loaded */
  appUser: AppUser | null;
  /** True while initial auth check is in progress */
  isInitializing: boolean;
  /** True while an auth operation is in progress */
  isLoading: boolean;
  /** Last auth error message, or null */
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  /** Sign in with email and password */
  login: (email: string, password: string) => Promise<AppUser>;
  /** Create a new account */
  register: (
    email: string,
    password: string,
    displayName: string,
    role?: "student" | "admin"
  ) => Promise<AppUser>;
  /** Sign in with Google popup */
  loginWithGoogle: () => Promise<AppUser>;
  /** Sign in with Apple popup */
  loginWithApple: () => Promise<AppUser>;
  /** Sign out the current user */
  logout: () => Promise<void>;
  /** Send a password reset email */
  sendPasswordReset: (email: string) => Promise<void>;
  /** Clear any auth error */
  clearError: () => void;
}

// ============================================================================
// Context
// ============================================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [state, setState] = useState<AuthState>({
    firebaseUser: null,
    appUser: null,
    isInitializing: true,
    isLoading: false,
    error: null,
  });

  /**
   * Listen for Firebase auth state changes on mount.
   * When the user's auth state changes, we fetch/refresh the user document.
   */
  useEffect(() => {
    ensureFirebase();

    const unsubscribe = onAuthChange(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const appUser = await getUserDocument(firebaseUser.uid);
          setState({
            firebaseUser,
            appUser,
            isInitializing: false,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          console.error("Failed to fetch user document:", err);
          setState({
            firebaseUser,
            appUser: null,
            isInitializing: false,
            isLoading: false,
            error: "Failed to load user profile.",
          });
        }
      } else {
        setState({
          firebaseUser: null,
          appUser: null,
          isInitializing: false,
          isLoading: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Sign in with email and password.
   */
  const login = useCallback(async (email: string, password: string): Promise<AppUser> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { user } = await signIn(email, password);
      setState((prev) => ({
        ...prev,
        appUser: user,
        isLoading: false,
        error: null,
      }));
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw err;
    }
  }, []);

  /**
   * Register a new user with email and password.
   */
  const register = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
      role: "student" | "admin" = "student"
    ): Promise<AppUser> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const { user } = await signUp(email, password, displayName, role);
        // Auth state listener will pick up the FirebaseUser,
        // but we set appUser immediately for a responsive UI.
        setState((prev) => ({
          ...prev,
          appUser: user,
          isLoading: false,
          error: null,
        }));
        return user;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Registration failed.";
        setState((prev) => ({ ...prev, isLoading: false, error: message }));
        throw err;
      }
    },
    []
  );

  /**
   * Sign in with Google via popup.
   */
  const loginWithGoogle = useCallback(async (): Promise<AppUser> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { user } = await signInWithGoogle();
      setState((prev) => ({
        ...prev,
        appUser: user,
        isLoading: false,
        error: null,
      }));
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign-in failed.";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw err;
    }
  }, []);

  /**
   * Sign in with Apple via popup.
   */
  const loginWithApple = useCallback(async (): Promise<AppUser> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { user } = await signInWithApple();
      setState((prev) => ({
        ...prev,
        appUser: user,
        isLoading: false,
        error: null,
      }));
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Apple sign-in failed.";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw err;
    }
  }, []);

  /**
   * Sign out the current user.
   */
  const logout = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await logOut();
      // Auth state listener will clear the state automatically
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed.";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw err;
    }
  }, []);

  /**
   * Send a password reset email.
   */
  const sendPasswordReset = useCallback(async (email: string): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await resetPassword(email);
      setState((prev) => ({ ...prev, isLoading: false, error: null }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Password reset failed.";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw err;
    }
  }, []);

  /**
   * Clear the current error.
   */
  const clearError = useCallback((): void => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    loginWithGoogle,
    loginWithApple,
    logout,
    sendPasswordReset,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access auth context.
 * Must be used within an AuthProvider.
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}