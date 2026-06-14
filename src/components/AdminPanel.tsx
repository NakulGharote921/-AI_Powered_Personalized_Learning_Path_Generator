import React, { useState, useEffect } from "react";
import { ShieldCheck, Users, Server, Database, Plus, RefreshCw, Layers, Sparkles, Check, AlertCircle } from "lucide-react";

export default function AdminPanel() {
  const [dbStats, setDbStats] = useState<any>({
    usersCount: 0,
    skillsCount: 0,
    pathsCount: 0,
    modulesCount: 0,
    resourcesCount: 0,
    progressCount: 0
  });

  const [usersList, setUsersList] = useState<any[]>([]);
  const [skillsList, setSkillsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Skills additions state
  const [newSkillName, setNewSkillName] = useState<string>("");
  const [newSkillCategory, setNewSkillCategory] = useState<string>("Backend Development");
  const [successSkillMsg, setSuccessSkillMsg] = useState<string>("");

  useEffect(() => {
    fetchAdminAnalytics();
  }, []);

  const fetchAdminAnalytics = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/overview");
      if (res.ok) {
        const data = await res.json();
        setDbStats(data.stats);
        setUsersList(data.users);
        setSkillsList(data.skills);
      } else {
        throw new Error("Unable to read registry admin metrics.");
      }
    } catch (e: any) {
      setErrorMsg(e?.message || "Operational parameters unreachable.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserRole = async (targetUserId: string, currentRole: string) => {
    try {
      const targetRole = currentRole === "admin" ? "student" : "admin";
      const res = await fetch("/api/admin/user-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUserId, role: targetRole })
      });

      if (res.ok) {
        fetchAdminAnalytics();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddNewSkillToDb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      const res = await fetch("/api/admin/skills/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill_name: newSkillName.trim(), category: newSkillCategory })
      });

      if (res.ok) {
        setSuccessSkillMsg(`Successfully registered "${newSkillName}"!`);
        setNewSkillName("");
        setTimeout(() => {
          setSuccessSkillMsg("");
          fetchAdminAnalytics();
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in text-[#4E220F]">
      
      {/* Header board */}
      <div className="border-b-4 border-[#4E220F] pb-4 mb-8 flex justify-between items-center bg-[#FAF6EB] p-4 rounded-lg border-2">
        <div className="flex items-center space-x-3">
          <span className="p-2 bg-[#9D6638] text-white border-2 border-[#4E220F] shadow-[2px_2px_0px_#4E220F] rounded">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </span>
          <div>
            <h1 className="font-serif font-black text-2xl text-[#4E220F] uppercase tracking-tight">Faculty Administrator Panel</h1>
            <p className="text-[11px] font-bold text-[#9D6638] uppercase tracking-widest mt-0.5">Database Diagnostic Logs & Curricular Controls</p>
          </div>
        </div>

        <button
          onClick={fetchAdminAnalytics}
          className="vintage-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Synchronize Logs</span>
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-red-100 border-2 border-red-800 text-red-950 p-3 text-xs font-bold rounded flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Row stats database indicators */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        
        <div className="bg-[#FAF6EB] p-3 border-2 border-[#4E220F] rounded shadow-[2px_2px_0px_#4E220F] text-center">
          <div className="text-xl font-mono font-black text-[#9D6638]">{dbStats?.usersCount || 0}</div>
          <span className="text-[9px] font-bold text-[#6D4230] uppercase">STUDENTS</span>
        </div>

        <div className="bg-[#FAF6EB] p-3 border-2 border-[#4E220F] rounded shadow-[2px_2px_0px_#4E220F] text-center">
          <div className="text-xl font-mono font-black text-[#9D6638]">{dbStats?.skillsCount || 0}</div>
          <span className="text-[9px] font-bold text-[#6D4230] uppercase">SKILLS MASTER</span>
        </div>

        <div className="bg-[#FAF6EB] p-3 border-2 border-[#4E220F] rounded shadow-[2px_2px_0px_#4E220F] text-center">
          <div className="text-xl font-mono font-black text-[#9D6638]">{dbStats?.pathsCount || 0}</div>
          <span className="text-[9px] font-bold text-[#6D4230] uppercase">AI PATHWAYS</span>
        </div>

        <div className="bg-[#FAF6EB] p-3 border-2 border-[#4E220F] rounded shadow-[2px_2px_0px_#4E220F] text-center">
          <div className="text-xl font-mono font-black text-[#9D6638]">{dbStats?.modulesCount || 0}</div>
          <span className="text-[9px] font-bold text-[#6D4230] uppercase">TIMELINE MODS</span>
        </div>

        <div className="bg-[#FAF6EB] p-3 border-2 border-[#4E220F] rounded shadow-[2px_2px_0px_#4E220F] text-center">
          <div className="text-xl font-mono font-black text-[#9D6638]">{dbStats?.resourcesCount || 0}</div>
          <span className="text-[9px] font-bold text-[#6D4230] uppercase">RESOURCES</span>
        </div>

        <div className="bg-[#FAF6EB] p-3 border-2 border-[#4E220F] rounded shadow-[2px_2px_0px_#4E220F] text-center">
          <div className="text-xl font-mono font-black text-[#9D6638]">{dbStats?.progressCount || 0}</div>
          <span className="text-[9px] font-bold text-[#6D4230] uppercase">PROGRESS LOOPS</span>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left main: User Accounts directory */}
        <div className="lg:col-span-8 bg-[#FAF6EB] p-6 border-4 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded-lg">
          <h3 className="font-serif font-black text-lg text-[#4E220F] border-b-2 border-[#4E220F] pb-2 mb-4 flex justify-between items-center">
            <span className="flex items-center gap-1.5">
              <Users className="w-5 h-5 text-[#9D6638]" />
              <span>Registered Scholar Accounts</span>
            </span>
            <span className="text-xs font-mono font-bold bg-[#B0BA99] px-2 py-0.5 rounded">All Registered</span>
          </h3>

          {usersList.length === 0 ? (
            <p className="text-xs text-[#6D4230] italic">Waking up account tables...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold">
                <thead>
                  <tr className="border-b-2 border-[#4E220F]">
                    <th className="py-2.5">Name</th>
                    <th className="py-2.5">Email Parameters</th>
                    <th className="py-2.5">Target Objective</th>
                    <th className="py-2.5">Weekly hours</th>
                    <th className="py-2.5">Role Authorization</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4E220F]/15">
                  {usersList.map((usr) => (
                    <tr key={usr.id} className="hover:bg-[#F7F1DE]/40">
                      <td className="py-2.5 font-serif font-black">{usr.name}</td>
                      <td className="py-2.5 font-mono">{usr.email}</td>
                      <td className="py-2.5 text-amber-900">{usr.career_goals || "TBD"}</td>
                      <td className="py-2.5 font-mono">{usr.weekly_hours || 0} hours</td>
                      <td className="py-2.5">
                        <span className={`text-[10px] font-mono px-2 py-0.5 border rounded ${
                          usr.role === "admin" ? "bg-purple-100 text-purple-900 border-purple-800" : "bg-blue-100 text-blue-900 border-blue-800"
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => handleToggleUserRole(usr.id, usr.role)}
                          className="text-[9px] font-mono hover:underline text-[#9D6638]"
                        >
                          Modify Permission
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column: Manage Master Skills list */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#FAF6EB] p-5 border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] rounded-lg">
            <h4 className="font-serif font-black text-xs uppercase text-[#4E220F] mb-3 pb-2 border-b-2 border-[#4E220F]">
              Register New Master Skill
            </h4>

            {successSkillMsg && (
              <div className="mb-4 bg-green-50 border border-green-800 text-green-950 p-2.5 rounded text-xs font-bold">
                {successSkillMsg}
              </div>
            )}

            <form onSubmit={handleAddNewSkillToDb} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Competence Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js App Router"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#F7F1DE] border border-[#4E220F] text-xs font-semibold rounded"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1">Core Subject Area</label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#F7F1DE] border border-[#4E220F] text-xs font-semibold rounded"
                >
                  <option>Frontend Development</option>
                  <option>Programming Languages</option>
                  <option>Backend Development</option>
                  <option>Databases</option>
                  <option>Data Science & AI</option>
                  <option>DevOps</option>
                  <option>Design</option>
                </select>
              </div>

              <button
                type="submit"
                className="vintage-btn w-full py-2 text-xs uppercase"
              >
                Insert Competency Block
              </button>
            </form>
          </div>

          <div className="bg-[#FAF6EB] p-5 border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] rounded-lg">
            <h4 className="font-serif font-bold text-xs uppercase text-[#4E220F] mb-2 pb-2 border-b-2 border-[#4E220F]">
              Faculty Preloaded Skills Directory
            </h4>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {skillsList.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10px] font-mono bg-[#F7F1DE] p-1.5 border border-[#4E220F]/30 rounded">
                  <span className="truncate max-w-[150px] font-bold">{s.skill_name}</span>
                  <span className="text-[8px] text-[#9D6638] uppercase font-semibold">{s.category}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
