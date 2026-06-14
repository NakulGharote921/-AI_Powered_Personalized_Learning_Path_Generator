import React, { useState } from "react";
import { appSignIn, appCreateUser, isFirebaseAuthMock } from "../firebase";
import { KeyRound, Mail, User, BookOpen, AlertCircle, ShieldAlert, Sparkles, Check } from "lucide-react";

interface AuthPageProps {
  onSuccess: (user: any) => void;
  onGoBack: () => void;
}

export default function AuthPage({ onSuccess, onGoBack }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        // Sign In
        const result = await appSignIn(email, password);
        // Sync user backend-side
        const syncRes = await fetch("/api/auth/firebase-sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: result.user.uid,
            email: result.user.email,
            name: result.user.displayName || email.split("@")[0]
          })
        });
        const syncData = await syncRes.json();
        setSuccessMsg("Welcome scholar! Entering academy portal...");
        setTimeout(() => {
          onSuccess(syncData.user);
        }, 800);
      } else {
        // Sign Up
        const result = await appCreateUser(email, password, name);
        const syncRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            role: email.toLowerCase() === "nakulgharote@gmail.com" ? "admin" : "student"
          })
        });
        const syncData = await syncRes.json();
        
        if (!syncRes.ok) {
          throw new Error(syncData.error || "Failed to register on backend");
        }

        setSuccessMsg("Enrollment verified! Please proceed to log in.");
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMessage(err?.message || "An authentication gap was encountered. Verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreseedCredentials = (type: "student" | "admin") => {
    if (type === "student") {
      setEmail("student@learning.edu");
      setPassword("password123");
    } else {
      setEmail("nakulgharote@gmail.com");
      setPassword("password123");
    }
    setIsLogin(true);
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
        {isFirebaseAuthMock && (
          <div className="mb-6 bg-[#B0BA99]/40 border-2 border-[#4E220F] p-3 rounded flex items-start space-x-2 text-xs font-semibold">
            <Sparkles className="w-6 h-6 text-[#9D6638] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#4E220F] block">Offline Premium Sandbox Mode</span>
              Our systems are compiled in offline verification mode. Enter any simulated email/password to log in immediately!
            </div>
          </div>
        )}

        <h2 className="font-serif font-black text-2xl text-center mb-2">
          {isLogin ? "Scholarly Sign In" : "Student Enrollment Application"}
        </h2>
        <p className="text-center text-xs font-semibold uppercase text-[#9D6638] tracking-widest mb-8">
          {isLogin ? "Enter Your Academic Archives" : "Register a Permanent Learning Profile"}
        </p>

        {errorMessage && (
          <div className="mb-6 bg-red-100 border-2 border-red-800 text-red-900 p-3 text-xs font-bold rounded flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-800 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 bg-green-100 border-2 border-green-800 text-green-900 p-3 text-xs font-bold rounded flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-800 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-5">
          {!isLogin && (
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#9D6638] text-[#FFFDF6] border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] font-bold text-sm tracking-wider uppercase hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#4E220F] disabled:opacity-50 transition-all rounded"
          >
            {isLoading ? "Validating Credentials..." : isLogin ? "Sign In & Enter Dashboard" : "Register and Enroll Now"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t-2 border-[#4E220F]/20 text-center">
          <p className="text-xs font-medium text-[#6D4230]">
            {isLogin ? "New to the Chronicle Academy?" : "Already possess archives credentials?"}
          </p>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage("");
            }}
            className="mt-2 text-xs font-bold text-[#9D6638] hover:underline"
          >
            {isLogin ? "Enroll new profile catalog →" : "Login with coordinates →"}
          </button>
        </div>

        {/* Quick Testing logins helper */}
        <div className="mt-8 pt-4 border-t-2 border-dashed border-[#4E220F]/20">
          <span className="text-[10px] font-bold text-[#6D4230]/70 uppercase block text-center tracking-wider mb-3">Pre-seeded testing credentials (Click to Load)</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => loadPreseedCredentials("student")}
              className="px-2 py-1.5 text-[10px] font-bold bg-[#FAF6EB] border border-[#4E220F] hover:bg-[#B0BA99] rounded transition-all text-center"
            >
              James (Student)
            </button>
            <button
              onClick={() => loadPreseedCredentials("admin")}
              className="px-2 py-1.5 text-[10px] font-bold bg-[#FAF6EB] border border-[#4E220F] hover:bg-[#B0BA99] rounded transition-all text-center"
            >
              Elizabeth (Admin)
            </button>
          </div>
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
