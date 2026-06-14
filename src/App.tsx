import React, { useEffect, useState } from "react";
import { User, DashboardData } from "./types";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Import modular subviews
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import SkillAssessment from "./components/SkillAssessment";
import Dashboard from "./components/Dashboard";
import LearningPathView from "./components/LearningPathView";
import ResourceLibrary from "./components/ResourceLibrary";
import ProgressAnalytics from "./components/ProgressAnalytics";
import AIMentorChat from "./components/AIMentorChat";
import UserProfile from "./components/UserProfile";
import AdminPanel from "./components/AdminPanel";

import { BookOpen, Compass, BarChart2, MessageSquare, Award, UserCheck, ShieldAlert, LogOut, KeyRound, Layers } from "lucide-react";

/**
 * Inner app component that uses the AuthContext.
 * This is wrapped by AuthProvider in the exported App component.
 */
function AppInner() {
  const {
    firebaseUser,
    appUser,
    isInitializing,
    isLoading: authLoading,
    logout,
    error: authError,
    clearError,
  } = useAuthContext();

  const [activeTab, setActiveTab] = useState<string>("landing");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const mobileNavId = "mobile-nav";

  // Map from firebase user to our User type for compatibility with existing components
  const mappedUser: User | null = appUser
    ? {
        id: appUser.uid,
        name: appUser.displayName,
        email: appUser.email,
        role: appUser.role,
        created_at: appUser.createdAt,
      }
    : null;

  // Once auth is done initializing, if user is authenticated, show dashboard
  useEffect(() => {
    if (!isInitializing && firebaseUser) {
      setActiveTab((prev) => (prev === "landing" || prev === "auth" ? "dashboard" : prev));
    }
  }, [isInitializing, firebaseUser]);

  useEffect(() => {
    if (!isMobileNavOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileNavOpen]);

  useEffect(() => {
    if (mappedUser) {
      loadDashboardData();
    }
  }, [mappedUser]);

  const loadDashboardData = async () => {
    if (!mappedUser) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/dashboard-data?userId=${mappedUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (e) {
      console.error("Failed to load metrics data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setActiveTab("dashboard");
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("vintage_session_user");
      setDashboardData(null);
      setActiveTab("landing");
    } catch (e) {
      console.error("Logout error:", e);
      localStorage.removeItem("vintage_session_user");
      setDashboardData(null);
      setActiveTab("landing");
    }
  };

  const handleAssessmentGenerationComplete = (newPathId: string) => {
    loadDashboardData();
    setActiveTab("dashboard");
  };

  // Show loading while checking initial auth state
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#F7F1DE] flex flex-col justify-center items-center font-serif text-[#4E220F]">
        <div className="relative w-12 h-12 mb-4">
          <span className="absolute inset-0 border-4 border-[#B0BA99] rounded-full animate-ping opacity-75"></span>
          <span className="absolute inset-0 border-4 border-[#9D6638] rounded-full animate-spin border-t-transparent"></span>
        </div>
        <h4 className="font-extrabold text-sm uppercase tracking-wider">Reconciling Faculty Archives...</h4>
      </div>
    );
  }

  // User is not authenticated - show landing or auth page
  if (!firebaseUser) {
    if (activeTab === "auth") {
      return (
        <AuthPage
          onSuccess={handleAuthSuccess}
          onGoBack={() => setActiveTab("landing")}
        />
      );
    }
    return (
      <LandingPage
        onEnterApp={() => setActiveTab("auth")}
        onGoToAuth={() => setActiveTab("auth")}
      />
    );
  }

  const closeMobileNav = () => setIsMobileNavOpen(false);

  return (
    <div className="min-h-screen bg-[#F7F1DE] flex flex-col md:flex-row selection:bg-[#9D6638] selection:text-white text-[#4E220F] w-full max-w-full overflow-hidden">
      {/* === DESKTOP SIDEBAR - always visible on md+ screens === */}
      <aside className="w-full md:w-64 bg-[#B0BA99]/10 border-r border-[#4E220F]/10 flex-col p-8 hidden md:flex sticky top-0 h-screen overflow-y-auto flex-shrink-0">
        <div className="mb-12">
          <h1 className="text-2xl font-serif font-black tracking-tighter text-[#4E220F] cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            CHRONICLE<span className="text-[#9D6638]">.ACADEMY</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest opacity-60 font-sans font-bold mt-1">Curated Excellence</p>
        </div>
        <nav className="flex-1 space-y-6">
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-sans font-bold px-3 mb-2">Academic Core</p>
            <button onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center space-x-2.5 text-left transition-all font-serif py-1.5 px-3 rounded text-sm font-medium border-l-4 ${activeTab === "dashboard" ? "text-[#9D6638] bg-white/70 border-[#9D6638] shadow-[1px_1px_1px_rgba(78,34,15,0.05)]" : "text-[#4E220F]/80 border-transparent hover:text-[#4E220F] hover:bg-white/30"}`}>
              <Layers className={`w-4 h-4 flex-shrink-0 transition-colors ${activeTab === "dashboard" ? "text-[#9D6638]" : "text-[#4E220F]/60"}`} />
              <span>Control Desk</span>
            </button>
            <button onClick={() => setActiveTab("path")}
              className={`w-full flex items-center space-x-2.5 text-left transition-all font-serif py-1.5 px-3 rounded text-sm font-medium border-l-4 ${activeTab === "path" ? "text-[#9D6638] bg-white/70 border-[#9D6638] shadow-[1px_1px_1px_rgba(78,34,15,0.05)]" : "text-[#4E220F]/80 border-transparent hover:text-[#4E220F] hover:bg-white/30"}`}>
              <Compass className={`w-4 h-4 flex-shrink-0 transition-colors ${activeTab === "path" ? "text-[#9D6638]" : "text-[#4E220F]/60"}`} />
              <span>Curriculums Map</span>
            </button>
            <button onClick={() => setActiveTab("resources")}
              className={`w-full flex items-center space-x-2.5 text-left transition-all font-serif py-1.5 px-3 rounded text-sm font-medium border-l-4 ${activeTab === "resources" ? "text-[#9D6638] bg-white/70 border-[#9D6638] shadow-[1px_1px_1px_rgba(78,34,15,0.05)]" : "text-[#4E220F]/80 border-transparent hover:text-[#4E220F] hover:bg-white/30"}`}>
              <BookOpen className={`w-4 h-4 flex-shrink-0 transition-colors ${activeTab === "resources" ? "text-[#9D6638]" : "text-[#4E220F]/60"}`} />
              <span>Reference Library</span>
            </button>
          </div>
          <div className="space-y-1.5 pt-4 border-t border-[#4E220F]/10">
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-sans font-bold px-3 mb-2">Insights & AI</p>
            <button onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center space-x-2.5 text-left transition-all font-serif py-1.5 px-3 rounded text-sm font-medium border-l-4 ${activeTab === "analytics" ? "text-[#9D6638] bg-white/70 border-[#9D6638] shadow-[1px_1px_1px_rgba(78,34,15,0.05)]" : "text-[#4E220F]/80 border-transparent hover:text-[#4E220F] hover:bg-white/30"}`}>
              <BarChart2 className={`w-4 h-4 flex-shrink-0 transition-colors ${activeTab === "analytics" ? "text-[#9D6638]" : "text-[#4E220F]/60"}`} />
              <span>Analytics Reports</span>
            </button>
            <button onClick={() => setActiveTab("mentor")}
              className={`w-full flex items-center space-x-2.5 text-left transition-all font-serif py-1.5 px-3 rounded text-sm font-medium border-l-4 ${activeTab === "mentor" ? "text-[#9D6638] bg-white/70 border-[#9D6638] shadow-[1px_1px_1px_rgba(78,34,15,0.05)]" : "text-[#4E220F]/80 border-transparent hover:text-[#4E220F] hover:bg-white/30"}`}>
              <MessageSquare className={`w-4 h-4 flex-shrink-0 transition-colors ${activeTab === "mentor" ? "text-[#9D6638]" : "text-[#4E220F]/60"}`} />
              <span>Consult AI Mentor</span>
            </button>
          </div>
          <div className="space-y-1.5 pt-4 border-t border-[#4E220F]/10">
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-sans font-bold px-3 mb-2">Scholar</p>
            <button onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center space-x-2.5 text-left transition-all font-serif py-1.5 px-3 rounded text-sm font-medium border-l-4 ${activeTab === "profile" ? "text-[#9D6638] bg-white/70 border-[#9D6638] shadow-[1px_1px_1px_rgba(78,34,15,0.05)]" : "text-[#4E220F]/80 border-transparent hover:text-[#4E220F] hover:bg-white/30"}`}>
              <Award className={`w-4 h-4 flex-shrink-0 transition-colors ${activeTab === "profile" ? "text-[#9D6638]" : "text-[#4E220F]/60"}`} />
              <span>Scholar Card</span>
            </button>
            {appUser?.role === "admin" && (
              <button onClick={() => setActiveTab("admin")}
                className={`w-full flex items-center space-x-2.5 text-left transition-all font-serif py-1.5 px-3 rounded text-sm font-medium border-l-4 ${activeTab === "admin" ? "text-purple-800 bg-white/70 border-purple-800 shadow-[1px_1px_1px_rgba(78,34,15,0.05)]" : "text-[#4E220F]/80 border-transparent hover:text-purple-800 hover:bg-white/30"}`}>
                <ShieldAlert className={`w-4 h-4 flex-shrink-0 transition-colors ${activeTab === "admin" ? "text-purple-800" : "text-[#4E220F]/60"}`} />
                <span>Faculty Admin</span>
              </button>
            )}
          </div>
        </nav>
        <div className="mt-auto p-4 bg-[#B0BA99] rounded-2xl text-[#FAF6EB]">
          <p className="text-[10px] font-sans font-bold tracking-widest text-[#4E220F]">UPGRADE PLAN</p>
          <p className="text-sm font-serif leading-tight mt-1 text-[#4E220F] font-bold">Unlock Research Databases</p>
          <button onClick={handleLogout} className="mt-3 w-full py-1.5 bg-[#4E220F] text-[#FAF6EB] rounded-lg text-xs font-bold hover:bg-[#9D6638] transition-all duration-150">
            Sign Out
          </button>
        </div>
      </aside>

      {/* === DARK OVERLAY for mobile sidebar === */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileNav}
          aria-hidden="true"
        />
      )}

      {/* === MOBILE SIDEBAR - slides in from left === */}
      <aside
        id={mobileNavId}
        className={`fixed top-0 left-0 z-50 h-full w-[80vw] max-w-sm bg-[#FAF6EB] border-r-4 border-[#4E220F] transform-gpu transition-transform duration-300 ease-out overflow-y-auto md:hidden ${
          isMobileNavOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
        aria-label="Mobile navigation"
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <div className="font-serif font-black text-lg text-[#4E220F]">
              CHRONICLE<span className="text-[#9D6638]">.ACADEMY</span>
            </div>
            <button
              onClick={closeMobileNav}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-lg font-extrabold hover:text-[#9D6638] transition-colors"
              aria-label="Close navigation menu"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-[#4E220F]/10">
            <div className="w-10 h-10 rounded-full bg-[#4E220F] flex items-center justify-center text-[#F7F1DE] font-bold italic font-serif flex-shrink-0">
              {appUser?.displayName ? appUser.displayName.slice(0, 2).toUpperCase() : "JD"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{appUser?.displayName || "User"}</p>
              <p className="text-[10px] uppercase font-sans opacity-50 tracking-wider font-bold truncate">Premium scholar • Role: {appUser?.role || "student"}</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <button onClick={() => { setActiveTab("dashboard"); closeMobileNav(); }}
              className={`w-full flex items-center justify-start min-h-[44px] px-3 rounded-lg border-l-4 text-sm font-serif font-semibold ${activeTab === "dashboard" ? "text-[#9D6638] bg-white/70 border-[#9D6638]" : "text-[#4E220F]/80 border-transparent hover:text-[#4E220F] hover:bg-white/30"}`}>
              <Layers className="w-4 h-4 mr-3 flex-shrink-0" />
              Control Desk
            </button>
            <button onClick={() => { setActiveTab("path"); closeMobileNav(); }}
              className={`w-full flex items-center justify-start min-h-[44px] px-3 rounded-lg border-l-4 text-sm font-serif font-semibold ${activeTab === "path" ? "text-[#9D6638] bg-white/70 border-[#9D6638]" : "text-[#4E220F]/80 border-transparent hover:text-[#4E220F] hover:bg-white/30"}`}>
              <Compass className="w-4 h-4 mr-3 flex-shrink-0" />
              Curriculums Map
            </button>
            <button onClick={() => { setActiveTab("resources"); closeMobileNav(); }}
              className={`w-full flex items-center justify-start min-h-[44px] px-3 rounded-lg border-l-4 text-sm font-serif font-semibold ${activeTab === "resources" ? "text-[#9D6638] bg-white/70 border-[#9D6638]" : "text-[#4E220F]/80 border-transparent hover:text-[#4E220F] hover:bg-white/30"}`}>
              <BookOpen className="w-4 h-4 mr-3 flex-shrink-0" />
              Reference Library
            </button>
            <button onClick={() => { setActiveTab("analytics"); closeMobileNav(); }}
              className={`w-full flex items-center justify-start min-h-[44px] px-3 rounded-lg border-l-4 text-sm font-serif font-semibold ${activeTab === "analytics" ? "text-[#9D6638] bg-white/70 border-[#9D6638]" : "text-[#4E220F]/80 border-transparent hover:text-[#4E220F] hover:bg-white/30"}`}>
              <BarChart2 className="w-4 h-4 mr-3 flex-shrink-0" />
              Analytics Reports
            </button>
            <button onClick={() => { setActiveTab("mentor"); closeMobileNav(); }}
              className={`w-full flex items-center justify-start min-h-[44px] px-3 rounded-lg border-l-4 text-sm font-serif font-semibold ${activeTab === "mentor" ? "text-[#9D6638] bg-white/70 border-[#9D6638]" : "text-[#4E220F]/80 border-transparent hover:text-[#4E220F] hover:bg-white/30"}`}>
              <MessageSquare className="w-4 h-4 mr-3 flex-shrink-0" />
              Consult AI Mentor
            </button>
            <button onClick={() => { setActiveTab("profile"); closeMobileNav(); }}
              className={`w-full flex items-center justify-start min-h-[44px] px-3 rounded-lg border-l-4 text-sm font-serif font-semibold ${activeTab === "profile" ? "text-[#9D6638] bg-white/70 border-[#9D6638]" : "text-[#4E220F]/80 border-transparent hover:text-[#4E220F] hover:bg-white/30"}`}>
              <Award className="w-4 h-4 mr-3 flex-shrink-0" />
              Scholar Card
            </button>
            {appUser?.role === "admin" && (
              <button onClick={() => { setActiveTab("admin"); closeMobileNav(); }}
                className={`w-full flex items-center justify-start min-h-[44px] px-3 rounded-lg border-l-4 text-sm font-serif font-semibold ${activeTab === "admin" ? "text-purple-800 bg-white/70 border-purple-800" : "text-[#4E220F]/80 border-transparent hover:text-purple-800 hover:bg-white/30"}`}>
                <ShieldAlert className="w-4 h-4 mr-3 flex-shrink-0" />
                Faculty Admin
              </button>
            )}
          </nav>

          <button onClick={() => { closeMobileNav(); handleLogout(); }}
            className="min-h-[44px] w-full mt-4 p-2 bg-[#4E220F] text-[#FAF6EB] rounded-lg text-xs font-bold hover:bg-[#9D6638] transition-all duration-150 focus-visible-ring flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT AREA === */}
      <div className="flex-1 flex flex-col min-h-screen md:h-screen md:overflow-y-auto w-full min-w-0">
        {/* Top header bar */}
        <header className="min-h-[60px] h-auto py-3 md:h-20 border-b border-[#4E220F]/10 flex items-center justify-between px-4 sm:px-6 lg:px-10 bg-white/30 backdrop-blur-sm sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen((v) => !v)}
              className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg bg-[#FAF6EB]/70 border border-[#4E220F]/10 hover:bg-[#FAF6EB] transition-all flex-shrink-0"
              aria-label={isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileNavOpen}
              aria-controls={mobileNavId}
            >
              <span aria-hidden className="w-5 h-5 relative">
                <span className={`absolute left-0 top-1 w-5 h-[2px] bg-[#4E220F] transition-transform duration-200 ${isMobileNavOpen ? "rotate-45 top-[9px]" : ""}`} />
                <span className={`absolute left-0 top-3 w-5 h-[2px] bg-[#4E220F] transition-opacity duration-200 ${isMobileNavOpen ? "opacity-0" : "opacity-100"}`} />
                <span className={`absolute left-0 top-5 w-5 h-[2px] bg-[#4E220F] transition-transform duration-200 ${isMobileNavOpen ? "-rotate-45 top-[9px]" : ""}`} />
              </span>
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#4E220F] flex items-center justify-center text-[#F7F1DE] font-bold italic font-serif flex-shrink-0">
              {appUser?.displayName ? appUser.displayName.slice(0, 2).toUpperCase() : "JD"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate max-w-[100px] xs:max-w-[150px] sm:max-w-none">{appUser?.displayName || "Scholar"}</p>
              <p className="text-[10px] uppercase font-sans opacity-50 tracking-wider font-bold truncate max-w-[120px] xs:max-w-[170px] sm:max-w-none">Premium scholar • Role: {appUser?.role || "student"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {dashboardData?.analytics && (
              <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase font-sans opacity-50 tracking-widest font-bold whitespace-nowrap">Daily Streak</p>
                <p className="text-lg sm:text-xl font-bold font-serif leading-none text-[#9D6638]">{dashboardData.analytics.streakDays || 0} Days</p>
              </div>
            )}
            <button onClick={() => setActiveTab("assessment")}
              className="min-h-[36px] px-3 sm:px-5 py-2 text-[11px] sm:text-xs font-black tracking-wider border-2 border-[#4E220F] hover:bg-[#4E220F] hover:text-[#F7F1DE] transition-all rounded-sm font-sans focus-visible-ring whitespace-nowrap">
              NEW ROADMAP
            </button>
          </div>
        </header>

        {/* Primary views frame */}
        <ProtectedRoute>
          <main className="flex-1 p-4 sm:p-6 lg:p-10 w-full min-w-0 max-w-full">
            {activeTab === "assessment" && (
              <SkillAssessment
                userId={mappedUser?.id || ""}
                onGenerationComplete={handleAssessmentGenerationComplete}
                onGoToDashboard={() => setActiveTab("dashboard")}
              />
            )}
            {activeTab === "dashboard" && (
              <Dashboard
                user={mappedUser || { id: "", name: "", email: "", role: "student" }}
                onNavigate={(tab) => setActiveTab(tab)}
                dashboardData={dashboardData}
                isLoading={isLoading}
                onRefreshData={loadDashboardData}
              />
            )}
            {activeTab === "path" && (
              <LearningPathView
                userId={mappedUser?.id || ""}
                activePath={dashboardData?.activePath || null}
                allUserPaths={dashboardData?.allUserPaths || []}
                modules={dashboardData?.modules || []}
                progressList={dashboardData?.progress || []}
                onRefreshData={loadDashboardData}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === "resources" && (
              <ResourceLibrary
                resources={dashboardData?.resources || []}
                userId={mappedUser?.id || ""}
                onRefreshData={loadDashboardData}
              />
            )}
            {activeTab === "analytics" && (
              <ProgressAnalytics
                analyticsData={dashboardData?.analytics}
              />
            )}
            {activeTab === "mentor" && (
              <AIMentorChat
                userId={mappedUser?.id || ""}
              />
            )}
            {activeTab === "profile" && (
              <UserProfile
                user={mappedUser || { id: "", name: "", email: "", role: "student" }}
                onLogout={handleLogout}
              />
            )}
            {activeTab === "admin" && appUser?.role === "admin" && (
              <AdminPanel />
            )}
          </main>
        </ProtectedRoute>

        {/* Styled Footer */}
        <footer className="bg-[#FAF6EB]/40 border-t border-[#4E220F]/10 py-4 sm:py-5 mt-auto">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row justify-between items-center text-[9px] sm:text-[10px] font-sans font-bold text-[#6D4230]/65 gap-2 sm:gap-3">
            <div className="text-center sm:text-left">CHRONICLE ACADEMY • FULL-STACK LEARNING ENGINE v1.2</div>
            <div className="text-center sm:text-right">ESTABLISHED 2026 • BUILT FOR INTELLECTUAL CAPABILITY</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/**
 * Root App component.
 * Wraps the application with Firebase AuthProvider.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}