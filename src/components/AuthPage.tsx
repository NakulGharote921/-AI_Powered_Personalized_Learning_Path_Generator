import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  KeyRound,
  Mail,
  User,
  BookOpen,
  AlertCircle,
  ShieldAlert,
  Sparkles,
  Check,
  ArrowLeft,
} from "lucide-react";

interface AuthPageProps {
  onSuccess: () => void;
  onGoBack: () => void;
}

/** Simple SVG Google icon inline — no external dependency needed */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/** Simple SVG Apple icon inline */
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

/**
 * Authentication page with Email/Password sign-in, sign-up, and password reset.
 * Includes Google and Apple social login buttons.
 * Uses the centralized auth service with Firebase Auth.
 */
export default function AuthPage({ onSuccess, onGoBack }: AuthPageProps) {
  const {
    login,
    register,
    sendPasswordReset,
    loginWithGoogle,
    loginWithApple,
    isLoading,
    error,
    clearError,
  } = useAuth();

  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [localError, setLocalError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(null);

  // Use either context error or local error
  const displayError = localError || error;

  const resetForm = () => {
    setLocalError("");
    setSuccessMsg("");
    clearError();
  };

  const switchMode = (newMode: "login" | "register" | "reset") => {
    setMode(newMode);
    resetForm();
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetForm();

    // Validation
    if (!email) {
      setLocalError("Please enter your email address.");
      return;
    }

    if (mode === "reset") {
      try {
        await sendPasswordReset(email);
        setSuccessMsg("Password reset email sent! Check your inbox for instructions.");
        setTimeout(() => switchMode("login"), 3000);
      } catch (err) {
        setLocalError(err instanceof Error ? err.message : "Failed to send reset email.");
      }
      return;
    }

    if (!password) {
      setLocalError("Please enter your password.");
      return;
    }

    if (mode === "register" && !name) {
      setLocalError("Please enter your full name.");
      return;
    }

    try {
      if (mode === "login") {
        await login(email, password);
        setSuccessMsg("Welcome scholar! Entering academy portal...");
        setTimeout(() => onSuccess(), 800);
      } else {
        const role = email.toLowerCase() === "nakulgharote@gmail.com" ? "admin" : "student";
        await register(email, password, name, role);
        setSuccessMsg("Account created successfully! You can now explore the academy.");
        setTimeout(() => onSuccess(), 800);
      }
    } catch (err) {
      if (!error) {
        setLocalError(err instanceof Error ? err.message : "Authentication failed. Please check your credentials.");
      }
    }
  };

  /**
   * Handle Google sign-in with loading state and error handling.
   */
  const handleGoogleSignIn = async () => {
    resetForm();
    setSocialLoading("google");

    try {
      await loginWithGoogle();
      setSuccessMsg("Welcome scholar! Google credentials verified...");
      setTimeout(() => onSuccess(), 600);
    } catch (err) {
      if (!error) {
        setLocalError(err instanceof Error ? err.message : "Google sign-in failed.");
      }
    } finally {
      setSocialLoading(null);
    }
  };

  /**
   * Handle Apple sign-in with loading state and error handling.
   */
  const handleAppleSignIn = async () => {
    resetForm();
    setSocialLoading("apple");

    try {
      await loginWithApple();
      setSuccessMsg("Welcome scholar! Apple credentials verified...");
      setTimeout(() => onSuccess(), 600);
    } catch (err) {
      if (!error) {
        setLocalError(err instanceof Error ? err.message : "Apple sign-in failed.");
      }
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1DE] py-6 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center animate-fade-in text-[#4E220F] overflow-x-hidden">
      <div className="mb-8 flex items-center space-x-3 pointer-events-none">
        <span className="p-2.5 bg-[#9D6638] text-[#FFFDF6] border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] rounded-lg">
          <BookOpen className="w-8 h-8" />
        </span>
        <span className="font-serif font-black text-2xl uppercase tracking-wider">
          Chronicle <span className="text-[#9D6638]">Academy</span>
        </span>
      </div>

      <div className="w-full max-w-md bg-[#FAF6EB] card-p-responsive border-4 border-[#4E220F] shadow-[6px_6px_0px_#4E220F] rounded-lg">
        <h2 className="font-serif font-black text-2xl text-center mb-2">
          {mode === "login" && "Scholarly Sign In"}
          {mode === "register" && "Student Enrollment Application"}
          {mode === "reset" && "Reset Academic Passcode"}
        </h2>
        <p className="text-center text-xs font-semibold uppercase text-[#9D6638] tracking-widest mb-8">
          {mode === "login" && "Enter Your Academic Archives"}
          {mode === "register" && "Register a Permanent Learning Profile"}
          {mode === "reset" && "We'll send you a reset link"}
        </p>

        {/* Error message */}
        {displayError && (
          <div className="mb-6 bg-red-100 border-2 border-red-800 text-red-900 p-3 text-xs font-bold rounded flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-800 flex-shrink-0" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div className="mb-6 bg-green-100 border-2 border-green-800 text-green-900 p-3 text-xs font-bold rounded flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-800 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ====== EMAIL / PASSWORD FORM (login & register only) ====== */}
        {mode !== "reset" && (
          <form onSubmit={handleAuthSubmit} className="space-y-5">
            {/* Name field (register only) */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Scholar's Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#4E220F]/60">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Barnaby Sterling"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-[#F7F1DE] border-2 border-[#4E220F] focus:outline-none focus:bg-[#FFFDF6] transition-colors rounded"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Email Coordinates</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#4E220F]/60">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-[#F7F1DE] border-2 border-[#4E220F] focus:outline-none focus:bg-[#FFFDF6] transition-colors rounded"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Academic passcode</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#4E220F]/60">
                  <KeyRound className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-[#F7F1DE] border-2 border-[#4E220F] focus:outline-none focus:bg-[#FFFDF6] transition-colors rounded"
                />
              </div>
            </div>

            {/* Forgot password link (login mode) */}
            {mode === "login" && (
              <button
                type="button"
                onClick={() => switchMode("reset")}
                className="text-xs font-bold text-[#9D6638] hover:underline block ml-auto"
              >
                Forgot passcode?
              </button>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#9D6638] text-[#FFFDF6] border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] font-bold text-sm tracking-wider uppercase hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#4E220F] disabled:opacity-50 transition-all rounded"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === "login" ? "Signing In..." : "Registering..."}
                </span>
              ) : (
                <>{mode === "login" ? "Sign In & Enter Dashboard" : "Register and Enroll Now"}</>
              )}
            </button>
          </form>
        )}

        {/* ====== PASSWORD RESET FORM ====== */}
        {mode === "reset" && (
          <form onSubmit={handleAuthSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1">Email Coordinates</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#4E220F]/60">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-[#F7F1DE] border-2 border-[#4E220F] focus:outline-none focus:bg-[#FFFDF6] transition-colors rounded"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#9D6638] text-[#FFFDF6] border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] font-bold text-sm tracking-wider uppercase hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#4E220F] disabled:opacity-50 transition-all rounded"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}

        {/* ====== SOCIAL LOGIN DIVIDER & BUTTONS (login mode only) ====== */}
        {mode === "login" && (
          <>
            {/* Divider with "or" */}
            <div className="flex items-center gap-3 my-6">
              <span className="flex-1 h-px bg-[#4E220F]/20" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#6D4230]/60">
                Or continue with
              </span>
              <span className="flex-1 h-px bg-[#4E220F]/20" />
            </div>

            {/* Social login buttons stack */}
            <div className="space-y-3">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading || socialLoading !== null}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border-2 border-[#4E220F]/30 shadow-[2px_2px_0px_#4E220F]/20 font-bold text-sm rounded hover:bg-[#F7F1DE] hover:border-[#4E220F]/60 hover:shadow-[3px_3px_0px_#4E220F]/30 disabled:opacity-50 transition-all duration-150 group"
              >
                {socialLoading === "google" ? (
                  <span className="w-5 h-5 border-2 border-[#4E220F]/50 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <GoogleIcon className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm font-bold text-[#4E220F]">
                  {socialLoading === "google" ? "Connecting Google..." : "Continue with Google"}
                </span>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                onClick={handleAppleSignIn}
                disabled={isLoading || socialLoading !== null}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#4E220F] border-2 border-[#4E220F] shadow-[2px_2px_0px_#4E220F]/40 font-bold text-sm rounded hover:bg-[#3a1a0c] disabled:opacity-50 transition-all duration-150 group"
              >
                {socialLoading === "apple" ? (
                  <span className="w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <AppleIcon className="w-5 h-5 flex-shrink-0 text-[#FAF6EB]" />
                )}
                <span className="text-sm font-bold text-[#FAF6EB]">
                  {socialLoading === "apple" ? "Connecting Apple..." : "Continue with Apple"}
                </span>
              </button>
            </div>
          </>
        )}

        {/* Bottom navigation links */}
        <div className="mt-6 pt-6 border-t-2 border-[#4E220F]/20 text-center">
          {mode === "reset" ? (
            <button
              onClick={() => switchMode("login")}
              className="mt-2 text-xs font-bold text-[#9D6638] hover:underline flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Login
            </button>
          ) : (
            <>
              <p className="text-xs font-medium text-[#6D4230]">
                {mode === "login" ? "New to the Chronicle Academy?" : "Already possess archives credentials?"}
              </p>
              <button
                onClick={() => switchMode(mode === "login" ? "register" : "login")}
                className="mt-2 text-xs font-bold text-[#9D6638] hover:underline"
              >
                {mode === "login" ? "Enroll new profile catalog →" : "Login with coordinates →"}
              </button>
            </>
          )}
        </div>
      </div>

      <button
        onClick={onGoBack}
        className="mt-6 text-sm font-semibold text-[#6D4230] hover:text-[#9D6638] transition-colors"
      >
        ← Go Back Home
      </button>
    </div>
  );
}