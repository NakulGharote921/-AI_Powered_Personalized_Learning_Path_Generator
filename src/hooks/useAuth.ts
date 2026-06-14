import { useAuthContext } from "../contexts/AuthContext";

/**
 * Hook for accessing authentication state and methods.
 * A convenience wrapper around useAuthContext.
 *
 * @returns Auth context with user state and auth methods.
 *
 * @example
 * ```tsx
 * const { appUser, firebaseUser, login, logout, isInitializing } = useAuth();
 * ```
 */
export function useAuth() {
  const context = useAuthContext();

  return {
    /** The authenticated Firebase user object */
    firebaseUser: context.firebaseUser,
    /** Our application user document from Firestore */
    appUser: context.appUser,
    /** Whether the user is currently authenticated */
    isAuthenticated: !!context.firebaseUser,
    /** Whether the user has admin role */
    isAdmin: context.appUser?.role === "admin",
    /** True while initial auth check is running */
    isInitializing: context.isInitializing,
    /** True while any auth operation is in progress */
    isLoading: context.isLoading,
    /** Last error message, or null */
    error: context.error,
    /** Sign in with email/password */
    login: context.login,
    /** Register a new account */
    register: context.register,
    /** Sign in with Google popup */
    loginWithGoogle: context.loginWithGoogle,
    /** Sign in with Apple popup */
    loginWithApple: context.loginWithApple,
    /** Sign out */
    logout: context.logout,
    /** Send password reset email */
    sendPasswordReset: context.sendPasswordReset,
    /** Clear current error */
    clearError: context.clearError,
  };
}
