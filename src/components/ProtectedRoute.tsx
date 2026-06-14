import React from "react";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  /** Component to render when authenticated */
  children: React.ReactNode;
  /** Fallback component to show while checking auth status */
  loadingFallback?: React.ReactNode;
  /** Fallback component to redirect/display for unauthenticated users */
  unauthenticatedFallback?: React.ReactNode;
  /** If true, only users with admin role can access */
  requireAdmin?: boolean;
}

/**
 * Route guard component that protects content behind authentication.
 * Shows loading state during initialization, redirects unauthenticated
 * users to a fallback, and ensures only authorized users see the children.
 *
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 *
 * <ProtectedRoute requireAdmin>
 *   <AdminPanel />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
  children,
  loadingFallback,
  unauthenticatedFallback,
  requireAdmin = false,
}: ProtectedRouteProps): React.ReactElement {
  const { isInitializing, isAuthenticated, appUser, isLoading } = useAuth();

  // Show loading state during initial auth check
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#F7F1DE] flex flex-col justify-center items-center font-serif text-[#4E220F]">
        <div className="relative w-12 h-12 mb-4">
          <span className="absolute inset-0 border-4 border-[#B0BA99] rounded-full animate-ping opacity-75"></span>
          <span className="absolute inset-0 border-4 border-[#9D6638] rounded-full animate-spin border-t-transparent"></span>
        </div>
        <h4 className="font-extrabold text-sm uppercase tracking-wider">
          {loadingFallback || "Authenticating Session..."}
        </h4>
      </div>
    );
  }

  // Show loading state during auth operations
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F1DE] flex flex-col justify-center items-center font-serif text-[#4E220F]">
        <div className="relative w-12 h-12 mb-4">
          <span className="absolute inset-0 border-4 border-[#B0BA99] rounded-full animate-ping opacity-75"></span>
          <span className="absolute inset-0 border-4 border-[#9D6638] rounded-full animate-spin border-t-transparent"></span>
        </div>
        <h4 className="font-extrabold text-sm uppercase tracking-wider">Processing...</h4>
      </div>
    );
  }

  // User is not authenticated
  if (!isAuthenticated) {
    if (unauthenticatedFallback) {
      return <>{unauthenticatedFallback}</>;
    }
    // Default: render nothing - parent should handle redirect
    return <></>;
  }

  // Admin check
  if (requireAdmin && appUser?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#F7F1DE] flex flex-col justify-center items-center font-serif text-[#4E220F] p-8">
        <div className="bg-[#FAF6EB] border-4 border-[#4E220F] shadow-[6px_6px_0px_#4E220F] rounded-lg p-8 max-w-md text-center">
          <h2 className="font-black text-2xl mb-4">Access Denied</h2>
          <p className="text-sm font-semibold text-[#6D4230] mb-6">
            You do not have the required administrative privileges to access this area.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-[#9D6638] text-white font-bold border-2 border-[#4E220F] shadow-[2px_2px_0px_#4E220F] rounded hover:translate-x-[-1px] transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Authenticated and authorized
  return <>{children}</>;
}