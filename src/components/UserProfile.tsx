import React from "react";
import { User } from "../types";
import { BookOpen, User as UserIcon, Shield, Clock, RotateCcw, AlertTriangle, Award, Compass, Heart } from "lucide-react";

interface UserProfileProps {
  user: User;
  onLogout: () => void;
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  
  const handleWipeDatabaseSimulation = async () => {
    if (!window.confirm("Danger: Proceeding resets all path modules, completions state, and quiz histories. Confirm reset?")) {
      return;
    }

    try {
      // In Fullstack, our admin endpoint allows reset
      const res = await fetch("/api/admin/reset", { method: "POST" });
      if (res.ok) {
        alert("Archives reset safely. Please re-assess skills.");
        window.location.reload();
      } else {
        alert("Unable to reset storage. Verify configuration.");
      }
    } catch (e) {
      alert("Backend sync failure.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in text-[#4E220F]">
      
      {/* Header board */}
      <div className="border-b-4 border-[#4E220F] pb-4 mb-8">
        <h1 className="font-serif font-black text-3xl text-[#4E220F] flex items-center gap-2">
          <span className="p-1.5 bg-[#9D6638] text-white border-2 border-[#4E220F] rounded">
            <UserIcon className="w-6 h-6" />
          </span>
          <span>Scholar Archives & Profile</span>
        </h1>
        <p className="text-xs font-bold text-[#9D6638] uppercase tracking-widest mt-1">
          Review credentials state, verified badges, and database parameters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left column scholar info credentials card */}
        <div className="md:col-span-8 bg-[#FAF6EB] p-6 border-4 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded-lg space-y-6">
          
          <div className="flex items-center space-x-4 pb-4 border-b-2 border-[#4E220F]/20">
            <div className="w-16 h-16 rounded-full bg-[#B0BA99] border-2 border-[#4E220F] flex items-center justify-center font-serif text-2xl font-black text-[#4E220F] uppercase">
              {user.name ? user.name.slice(0,2) : "学"}
            </div>
            <div>
              <h3 className="font-serif font-black text-xl text-[#4E220F]">{user.name}</h3>
              <p className="text-xs font-bold text-[#9D6638] uppercase tracking-wider">REGISTRY IDENTIFIER: {user.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-[#F7F1DE] p-3.5 border border-[#4E220F]/40 rounded">
              <span className="text-[9px] font-bold text-[#9D6638] uppercase tracking-wider block">Official Mail</span>
              <span className="text-xs font-bold text-[#4E220F] truncate block mt-0.5">{user.email}</span>
            </div>

            <div className="bg-[#F7F1DE] p-3.5 border border-[#4E220F]/40 rounded">
              <span className="text-[9px] font-bold text-[#9D6638] uppercase tracking-wider block">System Role Authorization</span>
              <span className="text-xs font-bold text-[#4E220F] block mt-0.5 uppercase">{user.role}</span>
            </div>

            <div className="bg-[#F7F1DE] p-3.5 border border-[#4E220F]/40 rounded">
              <span className="text-[9px] font-bold text-[#9D6638] uppercase tracking-wider block">Desired Career goal</span>
              <span className="text-xs font-bold text-amber-950 block mt-0.5">{user.career_goals || "System Architect Designer"}</span>
            </div>

            <div className="bg-[#F7F1DE] p-3.5 border border-[#4E220F]/40 rounded">
              <span className="text-[9px] font-bold text-[#9D6638] uppercase tracking-wider block">Format Preference</span>
              <span className="text-xs font-bold text-[#4E220F] block mt-0.5">{user.learning_preferences || "Visual & textbooks"}</span>
            </div>

          </div>

          <div className="pt-4 border-t border-[#4E220F]/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-950 bg-[#B0BA99]/30 p-2 border border-[#4E220F]/30 rounded">
              <Clock className="w-5 h-5 text-[#9D6638]" />
              <span>Study commitment: {user.weekly_hours || 12} hours / week logged.</span>
            </div>

            <button
              onClick={onLogout}
              className="vintage-btn px-6 py-2.5 text-xs uppercase"
              id="profile_logout_btn"
            >
              Sign Out of Academy
            </button>
          </div>

        </div>

        {/* Right column: Badges and Admin tools */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Badge achievements list */}
          <div className="bg-[#FAF6EB] p-5 border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] rounded-lg">
            <h4 className="font-serif font-black text-sm uppercase text-[#4E220F] pb-2 border-b-2 border-[#4E220F] mb-4 flex items-center gap-1">
              <Award className="w-4 h-4 text-[#9D6638]" />
              <span>Gained Certificates</span>
            </h4>
            <div className="space-y-3">
              
              <div className="flex items-center space-x-3 bg-[#FAF6EB] border border-[#4E220F] p-2.5 rounded">
                <span className="bg-amber-100 p-1.5 border border-amber-800 rounded-full">
                  🎓
                </span>
                <div>
                  <span className="font-serif font-bold text-xs block text-[#4E220F]">Enrolled Scribe badge</span>
                  <span className="text-[9px] text-[#6D4230] font-semibold">Gained on registration</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-[#FAF6EB] border border-[#4E220F]/40 p-2.5 rounded opacity-60">
                <span className="bg-gray-100 p-1.5 border border-gray-650 rounded-full">
                  🎯
                </span>
                <div>
                  <span className="font-serif font-bold text-xs block text-[#4E220F]">Milestones Solver badge</span>
                  <span className="text-[9px] text-[#6D4230] font-semibold">Pass 4 check level quizzes</span>
                </div>
              </div>

            </div>
          </div>

          {/* Reset database variables card block */}
          <div className="bg-red-50 border-2 border-red-800 p-5 rounded-lg text-red-950 space-y-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-800 flex-shrink-0" />
              <h5 className="font-bold text-sm tracking-wide">Scholarly Reset Options</h5>
            </div>
            <p className="text-[11px] font-semibold leading-relaxed text-red-900">
              Clear all simulated mock profiles, test sequences, course metrics and chat history logs completely.
            </p>
            <button
              onClick={handleWipeDatabaseSimulation}
              className="w-full py-2 bg-red-100 hover:bg-red-200 text-red-900 border border-red-800 text-[11px] font-black uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Sandbox Database</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
