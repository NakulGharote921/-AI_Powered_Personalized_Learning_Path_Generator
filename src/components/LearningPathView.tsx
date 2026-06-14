import React, { useState } from "react";
import { LearningPath, Module, Progress } from "../types";
import { BookOpen, Map, Award, PlayCircle, Eye, RefreshCw, Layers, CheckSquare, Target, Search, CheckCircle, Flame, ArrowRight, Play, AlertCircle } from "lucide-react";

interface LearningPathViewProps {
  userId: string;
  activePath: LearningPath | null;
  allUserPaths: LearningPath[];
  modules: Module[];
  progressList: Progress[];
  onRefreshData: () => void;
  onNavigate: (tab: string) => void;
}

export default function LearningPathView({ userId, activePath, allUserPaths, modules, progressList, onRefreshData, onNavigate }: LearningPathViewProps) {
  const [isSwapping, setIsSwapping] = useState<string | null>(null);

  const selectDifferentPath = async (pathId: string) => {
    setIsSwapping(pathId);
    try {
      const res = await fetch("/api/learning-path/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pathId })
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (e) {
      console.error("Failed to swap active system path:", e);
    } finally {
      setIsSwapping(null);
    }
  };

  const [isUpdatingProgress, setIsUpdatingProgress] = useState<string | null>(null);

  const startStageInPathView = async (modId: string) => {
    setIsUpdatingProgress(modId);
    try {
      const res = await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          moduleId: modId,
          status: "in_progress",
          percentage: 30
        })
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (e) {
      console.error("Failed to initiate stage:", e);
    } finally {
      setIsUpdatingProgress(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in text-[#4E220F]">
      <div className="flex flex-col sm:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 border-b-4 border-[#4E220F] pb-4 mb-8">
        <div>
          <h1 className="font-serif font-black text-3xl text-[#4E220F] flex items-center gap-2">
            <span className="p-1.5 bg-[#9D6638] text-white border-2 border-[#4E220F] rounded">
              <Map className="w-6 h-6" />
            </span>
            <span>Personalized Syllabi Path View</span>
          </h1>
          <p className="text-xs font-bold text-[#9D6638] uppercase tracking-widest mt-1">
            Examine skill gap resolutions and milestones targets
          </p>
        </div>

        <button
          onClick={() => onNavigate("assessment")}
          className="vintage-btn px-5 py-2.5 text-xs uppercase flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          <span>Generate Alternate Curve</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left main: Active path details */}
        <div className="lg:col-span-8 space-y-8">
          
          {activePath ? (
            <div className="bg-[#FAF6EB] p-6 border-4 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-serif font-black text-2xl text-[#9D6638]">{activePath.title}</h3>
                  <p className="text-xs font-bold text-[#6D4230] mt-1">PRIMARY GOAL: {activePath.goal}</p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#B0BA99] px-2.5 py-1 rounded border border-[#4E220F] uppercase">
                  {activePath.duration || "12 weeks"}
                </span>
              </div>

              {/* Identified Skill Gaps widget */}
              <div className="bg-[#F7F1DE] p-5 border-2 border-[#4E220F] rounded-lg mb-6">
                <h4 className="font-serif font-bold text-sm text-[#4E220F] uppercase flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-[#9D6638]" />
                  <span>Your Identified Competency Gaps</span>
                </h4>
                <p className="text-xs font-medium text-[#6D4230]/90 leading-relaxed mb-4">
                  Based on your pre-selected strengths, our server-side model identified these priorities to bridge the gap toward your target role:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(activePath.skill_gaps && activePath.skill_gaps.length > 0 ? activePath.skill_gaps : ["Advanced system design constraints"]).map((gap, idx) => (
                    <div key={idx} className="flex items-start space-x-2 bg-[#FAF6EB] border border-[#4E220F]/40 p-2.5 rounded text-xs font-semibold">
                      <span className="w-4 h-4 rounded-full bg-[#AF7647] text-[#FFFDF6] flex items-center justify-center font-mono text-[10px] font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modular Progression sequence */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-[#4E220F] uppercase text-sm border-b border-[#4E220F]/10 pb-2">Stages Curricular Sequence</h4>
                
                {modules.map((mod: Module, mIdx: number) => {
                  const prog = progressList.find((p) => p.module_id === mod.id);
                  const isCompleted = prog?.status === "completed";
                  const isInProgress = prog?.status === "in_progress";
                  const percentage = prog?.completion_percentage || 0;

                  return (
                    <div key={mod.id} className={`p-5 border border-[#4E220F]/10 border-b-4 rounded-xl shadow-sm transition-all hover:shadow-md hover:scale-[1.002] duration-200 flex flex-col md:flex-row items-stretch md:items-start gap-4 ${
                      isCompleted ? "bg-[#B0BA99]/10 border-b-[#B0BA99]" : isInProgress ? "bg-[#FAF6EB] border-b-[#9D6638]" : "bg-white border-b-gray-200"
                    }`}>
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm font-bold flex-shrink-0 mt-0.5 ${
                          isCompleted ? "bg-[#B0BA99] text-white" : isInProgress ? "bg-[#9D6638] text-white border border-[#4E220F]/20" : "bg-[#B0BA99]/15 text-[#9D6638] border border-[#B0BA99]/35"
                        }`}>
                          {mIdx + 1}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap justify-between items-center gap-1.5">
                            <h5 className="font-serif font-extrabold text-lg text-[#4E220F] tracking-tight">{mod.title}</h5>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-sans font-extrabold uppercase bg-amber-50 px-2 py-0.5 text-[#9D6638] rounded border border-[#9D6638]/20">{mod.difficulty}</span>
                              {isCompleted ? (
                                <span className="text-[9px] font-sans font-black uppercase text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3 text-green-700" />
                                  <span>Approved</span>
                                </span>
                              ) : isInProgress ? (
                                <span className="text-[9px] font-sans font-black uppercase text-amber-950 bg-amber-100 border border-[#9D6638]/20 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                                  <Flame className="w-3 h-3 text-[#9D6638]" />
                                  <span>Underway</span>
                                </span>
                              ) : (
                                <span className="text-[9px] font-sans font-black uppercase text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded">
                                  Unopened
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-xs text-[#6D4230]/95 leading-relaxed pr-2">{mod.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                            <div className="text-[10px] text-[#9D6638] font-sans font-bold flex items-center gap-1 uppercase tracking-wider">
                              <Award className="w-3.5 h-3.5 text-[#9D6638]" />
                              <span>Milestone: {mod.milestone}</span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-sans font-semibold">
                              ⏱ {mod.estimated_time || "12 hours"}
                            </span>
                          </div>

                          {/* Mini Progress Bar inside path view */}
                          {(isInProgress || isCompleted) && (
                            <div className="pt-2 w-full max-w-sm flex items-center gap-2.5">
                              <div className="flex-1 bg-[#F7F1DE] h-1 rounded-full overflow-hidden">
                                <div className="bg-[#9D6638] h-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-[#6D4230]">{percentage}% Completed</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Interactive Actions within Path View */}
                      <div className="flex justify-end items-center mt-3 md:mt-0 md:self-center flex-shrink-0">
                        {isCompleted ? (
                          <button
                            onClick={() => onNavigate("dashboard")}
                            className="w-full md:w-auto px-4 py-1.5 text-[10px] font-sans font-black uppercase tracking-wider bg-transparent text-[#9D6638] hover:text-[#4E220F] border border-[#9D6638]/20 hover:border-[#4E220F]/30 rounded transition-all flex items-center justify-center gap-1 font-bold"
                          >
                            <span>Study Again</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : isInProgress ? (
                          <button
                            onClick={() => onNavigate("dashboard")}
                            className="w-full md:w-auto px-4 py-2 text-[10px] font-sans font-black uppercase tracking-wider bg-[#9D6638] text-white hover:bg-[#a87447] rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm font-bold"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Active Quiz Desk</span>
                          </button>
                        ) : (
                          <button
                            disabled={isUpdatingProgress !== null}
                            onClick={() => startStageInPathView(mod.id)}
                            className="w-full md:w-auto px-4 py-2 text-[10px] font-sans font-black uppercase tracking-wider bg-[#B0BA99] text-[#4E220F] hover:bg-[#99a382] hover:text-white rounded-lg transition-all flex items-center justify-center gap-1 font-bold disabled:opacity-50"
                          >
                            {isUpdatingProgress === mod.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <CheckSquare className="w-3.5 h-3.5" />
                            )}
                            <span>Start Stage</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="bg-[#FAF6EB] border-4 border-[#4E220F] p-8 text-center rounded-lg shadow-[4px_4px_0px_#4E220F]">
              <h4 className="font-serif font-black text-lg mb-2">No Syllabus Profile Generated</h4>
              <p className="text-xs text-[#6D4230] max-w-sm mx-auto mb-6">
                You have not initiated an active professional pathway in this coordinate. Fill out our assessment card to launch your AI sequence.
              </p>
              <button
                onClick={() => onNavigate("assessment")}
                className="vintage-btn px-6 py-2"
              >
                Assemble Pathway
              </button>
            </div>
          )}

        </div>

        {/* Right column: Path Archives catalog */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FAF6EB] p-5 border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] rounded-lg">
            <h4 className="font-serif font-black text-sm uppercase text-[#4E220F] mb-3 pb-2 border-b-2 border-[#4E220F]">
              <span>Syllabi Archives</span>
            </h4>
            <p className="text-[11px] font-semibold text-[#6D4230] mb-4 leading-normal">
              A comprehensive directory of other custom learning routes configured under your profile coordinates.
            </p>

            {allUserPaths.length <= 1 ? (
              <p className="text-xs font-semibold text-[#6D4230] italic">
                Only your active learning sequence is currently archived.
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {allUserPaths.map((p: LearningPath) => (
                  <div
                    key={p.id}
                    onClick={() => selectDifferentPath(p.id)}
                    className={`p-3 border rounded text-xs cursor-pointer transition-all ${
                      p.is_active
                        ? "bg-[#FAF6EB] border-[#4E220F] font-bold shadow-[2px_2px_0px_#4E220F]"
                        : "bg-[#F7F1DE] border-[#4E220F]/40 hover:bg-[#B0BA99]/10"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-serif font-bold truncate pr-1">{p.title}</span>
                      {p.is_active && <span className="text-[9px] font-mono bg-[#B0BA99] px-1 py-0.5 rounded">Active</span>}
                    </div>
                    <div className="text-[10px] text-[#6D4230]/70 truncate mb-1">Goal: {p.goal}</div>
                    <span className="text-[9px] font-mono text-[#9D6638] font-bold">{p.duration || "8 weeks"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#B0BA99] p-5 border-2 border-[#4E220F] rounded-lg text-amber-950 shadow-[2px_2px_0px_#4E220F]">
            <Layers className="w-8 h-8 text-[#4E220F] mb-3" />
            <h4 className="font-serif font-extrabold text-sm mb-1">Interactive Diagnostic Portfolios</h4>
            <p className="text-xs font-medium leading-relaxed">
              When modules are added, our template auto-seeds custom checklists. Toggle through active modules and research recommended materials before trying the milestone check in the dashboard!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
