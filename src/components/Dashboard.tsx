import React, { useState, useEffect } from "react";
import { User, Skill, Module, Progress, Resource, AnalyticsSummary } from "../types";
import { BookOpen, Sparkles, Trophy, Calendar, Compass, ListTodo, Award, CheckCircle, Flame, ArrowUpRight, Check, Play, BookOpenCheck, HelpCircle, AlertTriangle } from "lucide-react";

interface DashboardProps {
  user: User;
  onNavigate: (tab: string) => void;
  dashboardData: any;
  isLoading: boolean;
  onRefreshData: () => void;
}

export default function Dashboard({ user, onNavigate, dashboardData, isLoading, onRefreshData }: DashboardProps) {
  // Modal for individual module quick quiz
  const [activeQuizModule, setActiveQuizModule] = useState<Module | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIdx: number]: string }>({});
  const [quizScoreMsg, setQuizScoreMsg] = useState<string>("");
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState<boolean>(false);

  // Fallback calculations if data is missing or empty
  const activePath = dashboardData?.activePath || null;
  const modules = dashboardData?.modules || [];
  const progressList = dashboardData?.progress || [];
  const resources = dashboardData?.resources || [];
  const userSkills = dashboardData?.userSkills || [];
  const analytics = dashboardData?.analytics || {
    weeklyStudyHours: 0,
    quizzesTaken: 0,
    modulesCompleted: 0,
    streakDays: 0,
    performanceScore: 88,
    upcomingTask: "Generate an initial learning path"
  };
  const completionPercentage = dashboardData?.completionPercentage || 0;

  // Custom mock sample questions for interactive quiz modal
  const sampleQuizQuestions = [
    {
      q: "Which concept allows the absolute isolation of client access inside relational databases or Firestore?",
      options: [
        "A. Implementing CORS filters on express backends",
        "B. Attributed-Based Access Control (ABAC) & custom security rules",
        "C. Storing API Secrets in client-side process.env configurations",
        "D. Wrapping all client calls in client-side state hooks"
      ],
      correct: "B"
    },
    {
      q: "What is a main symptom of an inefficient indexing or unoptimized query sequence in standard databases?",
      options: [
        "A. Rapidly escalating token counts",
        "B. Increased local console websocket errors",
        "C. O(n) read cost explosions and elevated latency",
        "D. Instant loss of authorization tokens"
      ],
      correct: "C"
    },
    {
      q: "Why should we avoid loading large redundant arrays in static code environments?",
      options: [
        "A. It triggers instant rate limits",
        "B. It exposes secret API variables",
        "C. It results in slower, memory heavy and unscalable bundles",
        "D. It prevents the compiler from compiling TypeScript files"
      ],
      correct: "C"
    }
  ];

  const handleStartModule = async (modId: string) => {
    try {
      await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          moduleId: modId,
          status: "in_progress",
          percentage: 30
        })
      });
      onRefreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCompleteModule = async (modId: string) => {
    try {
      await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          moduleId: modId,
          status: "completed",
          percentage: 100
        })
      });
      onRefreshData();
    } catch (e) {
      console.error(e);
    }
  };

  const openQuizModal = (mod: Module) => {
    setActiveQuizModule(mod);
    setSelectedAnswers({});
    setQuizScoreMsg("");
    setHasSubmittedQuiz(false);
  };

  const submitModuleQuiz = async () => {
    // Validate if answers to all questions are picked
    if (Object.keys(selectedAnswers).length < sampleQuizQuestions.length) {
      setQuizScoreMsg("Please answer all questions before submitting.");
      return;
    }

    // Calc score
    let corrects = 0;
    sampleQuizQuestions.forEach((q, idx) => {
      const correctAnsLetter = q.correct;
      const userSelectedText = selectedAnswers[idx];
      if (userSelectedText && userSelectedText.startsWith(correctAnsLetter)) {
        corrects++;
      }
    });

    const scorePercentage = Math.round((corrects / sampleQuizQuestions.length) * 100);
    setHasSubmittedQuiz(true);

    try {
      // Post completed progress to DB
      await fetch("/api/quizzes/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          moduleId: activeQuizModule?.id,
          score: scorePercentage
        })
      });

      setQuizScoreMsg(`You scored ${scorePercentage}% (${corrects}/${sampleQuizQuestions.length} correct). This module is now 100% complete!`);
      setTimeout(() => {
        onRefreshData();
      }, 1000);
    } catch (e) {
      console.error(e);
      setQuizScoreMsg("Failed to log results. Please retry.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-4 py-4 sm:py-8 animate-fade-in text-[#4E220F] w-full min-w-0 max-w-full">
      
      {/* Quiz Dialog Modal */}
      {activeQuizModule && (
        <div className="fixed inset-0 bg-[#4E220F]/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div
            className="bg-[#FAF6EB] border-4 border-[#4E220F] shadow-[8px_8px_0px_#4E220F] rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-dialog-title"
          >

            <div className="flex justify-between items-start border-b-2 border-[#4E220F] pb-3">
              <div>
                <span className="text-[10px] bg-[#9D6638] text-white px-2 py-0.5 rounded font-mono font-bold uppercase">Diagnostic Checkpoint</span>
                <h4 id="quiz-dialog-title" className="font-serif font-black text-lg mt-1">{activeQuizModule.title}</h4>

              </div>
              <button
                onClick={() => setActiveQuizModule(null)}
                className="text-lg font-extrabold hover:text-[#9D6638]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-semibold text-[#6D4230]">
              Pass this quick diagnostic check to demonstrate competency and unlock completion.
            </p>

            <div className="space-y-4">
              {sampleQuizQuestions.map((question, qIdx) => (
                <div key={qIdx} className="bg-[#F7F1DE] p-3 border border-[#4E220F]/60 rounded">
                  <div className="text-xs font-bold mb-2">{qIdx + 1}. {question.q}</div>
                  <div className="space-y-1.5">
                    {question.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => !hasSubmittedQuiz && setSelectedAnswers({ ...selectedAnswers, [qIdx]: opt })}
                        className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded border ${
                          selectedAnswers[qIdx] === opt
                            ? "bg-[#9D6638] text-[#FFFDF6] border-[#4E220F]"
                            : "bg-[#FAF6EB] hover:bg-[#B0BA99]/10 border-[#4E220F]/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {quizScoreMsg && (
              <div className="p-3 bg-[#B0BA99]/40 border-2 border-[#4E220F] rounded text-xs font-bold flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-[#9D6638] flex-shrink-0" />
                <span>{quizScoreMsg}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {!hasSubmittedQuiz ? (
                <button
                  onClick={submitModuleQuiz}
                  className="flex-1 py-2 bg-[#9D6638] text-white font-bold border-2 border-[#4E220F] shadow-[2px_2px_0px_#4E220F] hover:translate-x-[-1px] rounded"
                >
                  Submit Answers
                </button>
              ) : (
                <button
                  onClick={() => setActiveQuizModule(null)}
                  className="flex-1 py-2 bg-[#B0BA99] text-[#4E220F] font-bold border-2 border-[#4E220F] rounded text-center"
                >
                  Close & Refresh
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Greeting banner */}
      <div className="bg-[#B0BA99]/15 border border-[#4E220F]/10 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        {/* Dynamic Watermark Background */}
        <div className="absolute top-2 left-4 text-7xl sm:text-8xl font-serif font-black opacity-[0.03] select-none uppercase tracking-widest pointer-events-none">
          Academy
        </div>

        <div className="relative z-10">
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#4E220F] flex items-center gap-2">
            Welcome back, <span className="text-[#9D6638] italic">{user.name}</span>
          </h2>
          <p className="text-xs font-semibold uppercase text-[#6D4230] mt-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-700 animate-pulse"></span>
            <span>Academic Registry Verified • Role: {user.role}</span>
          </p>
        </div>

        <div className="flex gap-3 relative z-10">
          <button
            onClick={() => onNavigate("assessment")}
            className="px-4 py-2 border border-[#4E220F]/30 bg-white hover:bg-[#F7F1DE] text-xs font-bold text-[#4E220F] rounded-md transition-all shadow-sm"
            id="reassess_skills_btn"
          >
            New Path Generator
          </button>
          <button
            onClick={() => onNavigate("mentor")}
            className="px-4 py-2 bg-[#9D6638] text-white hover:bg-[#a87447] text-xs font-bold rounded-md transition-all shadow-md"
            id="talk_mentor_btn"
          >
            Consult AI Mentor
          </button>
        </div>
      </div>

      {/* Main Stats metrics bar */}
      <div className="stats-grid mb-6 sm:mb-8">
        
        <div className="stats-card bg-white p-4 sm:p-5 border border-[#4E220F]/10 border-b-4 border-[#B0BA99] shadow-sm hover:shadow-md transition-all rounded-lg flex items-center space-x-3 sm:space-x-3.5">
          <span className="p-2 sm:p-2.5 bg-[#FAF6EB] rounded-full flex-shrink-0">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#9D6638]" />
          </span>
          <div className="min-w-0">
            <div className="stat-value text-base sm:text-xl font-serif font-semibold text-[#4E220F] break-words">{analytics.streakDays} Days</div>
            <div className="stat-label text-[9px] sm:text-[10px] font-bold text-[#6D4230] uppercase tracking-widest font-sans">Learning Streak</div>
          </div>
        </div>

        <div className="stats-card bg-white p-4 sm:p-5 border border-[#4E220F]/10 border-b-4 border-[#B0BA99] shadow-sm hover:shadow-md transition-all rounded-lg flex items-center space-x-3 sm:space-x-3.5">
          <span className="p-2 sm:p-2.5 bg-[#FAF6EB] rounded-full flex-shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#9D6638]" />
          </span>
          <div className="min-w-0">
            <div className="stat-value text-base sm:text-xl font-serif font-semibold text-[#4E220F] break-words">{analytics.weeklyStudyHours} Hours</div>
            <div className="stat-label text-[9px] sm:text-[10px] font-bold text-[#6D4230] uppercase tracking-widest font-sans">Weekly Goal</div>
          </div>
        </div>

        <div className="stats-card bg-white p-4 sm:p-5 border border-[#4E220F]/10 border-b-4 border-[#9D6638] shadow-sm hover:shadow-md transition-all rounded-lg flex items-center space-x-3 sm:space-x-3.5">
          <span className="p-2 sm:p-2.5 bg-[#FAF6EB] rounded-full flex-shrink-0">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#9D6638]" />
          </span>
          <div className="min-w-0">
            <div className="stat-value text-base sm:text-xl font-serif font-semibold text-[#9D6638] break-words">{completionPercentage}%</div>
            <div className="stat-label text-[9px] sm:text-[10px] font-bold text-[#6D4230] uppercase tracking-widest font-sans">Path Completed</div>
          </div>
        </div>

        <div className="stats-card bg-white p-4 sm:p-5 border border-[#4E220F]/10 border-b-4 border-[#9D6638] shadow-sm hover:shadow-md transition-all rounded-lg flex items-center space-x-3 sm:space-x-3.5">
          <span className="p-2 sm:p-2.5 bg-[#FAF6EB] rounded-full flex-shrink-0">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#9D6638]" />
          </span>
          <div className="min-w-0">
            <div className="stat-value text-base sm:text-xl font-serif font-semibold text-[#4E220F] break-words">{analytics.performanceScore}/100</div>
            <div className="stat-label text-[9px] sm:text-[10px] font-bold text-[#6D4230] uppercase tracking-widest font-sans">Expertise index</div>
          </div>
        </div>

      </div>

      {/* Main dashboard body splitting column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        {/* Left Column: Visual Roadmap Timeline containing modules */}
        <div className="lg:col-span-8 space-y-6 relative">
          
          {/* Section title & Big typography watermark behind modules timeline */}
          <div className="absolute -top-12 left-0 text-[80px] sm:text-[100px] font-serif font-black opacity-[0.025] select-none uppercase tracking-tighter pointer-events-none">
            Roadmap
          </div>

          <div className="flex justify-between items-end border-b border-[#4E220F]/10 pb-3 relative z-10 mt-4">
            <div>
              <h3 className="font-serif font-black text-xl text-[#4E220F]">
                {activePath ? activePath.title : "Assemble A New Roadmap"}
              </h3>
              <p className="text-[11px] font-bold text-[#6D4230] uppercase tracking-wider mt-1">
                {activePath ? `Objective: ${activePath.goal}` : "No structured AI Path generated yet."}
              </p>
            </div>
            
            {activePath && (
              <span className="text-[10px] font-mono font-bold text-amber-950 bg-[#B0BA99]/30 border border-[#4E220F]/10 px-2 py-0.5 rounded uppercase">
                {activePath.duration || "8 weeks"}
              </span>
            )}
          </div>

          {modules.length === 0 ? (
            <div className="bg-[#FAF6EB]/40 border border-[#4E220F]/10 p-8 text-center space-y-4 rounded-xl">
              <Compass className="w-12 h-12 text-[#9D6638] mx-auto animate-pulse" />
              <h4 className="font-serif font-bold text-lg">No Active Curriculum Map Found</h4>
              <p className="text-xs font-semibold text-[#6D4230] max-w-sm mx-auto leading-relaxed">
                Begin by filling out the skills assessment questionnaire so the server-side AI model can generate your personalized syllabus sequence.
              </p>
              <button
                onClick={() => onNavigate("assessment")}
                className="px-6 py-2.5 bg-[#9D6638] text-white hover:bg-[#a87447] text-xs font-semibold rounded-md transition-all shadow"
              >
                Assess My Skills Now
              </button>
            </div>
          ) : (
            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-4 before:w-[1px] before:bg-[#4E220F]/10">
              
              {modules.map((mod: Module, index: number) => {
                const prog = progressList.find((p: any) => p.module_id === mod.id);
                const isCompleted = prog?.status === "completed";
                const isInProgress = prog?.status === "in_progress";
                const completionPercentageMod = prog?.completion_percentage || 0;

                const modResources = resources.filter((r: any) => r.module_id === mod.id);

                return (
                  <div key={mod.id} className="flex space-x-6 relative group animate-fade-in">
                    
                    {/* Circle Node indicator */}
                    <div className={`w-8 h-8 rounded-full border border-[#4E220F]/20 flex items-center justify-center font-mono text-xs font-bold z-10 flex-shrink-0 transition-all ${
                      isCompleted ? "bg-[#B0BA99] text-white" : isInProgress ? "bg-[#9D6638] text-white shadow-md scale-110" : "bg-white text-[#4E220F]/50"
                    }`}>
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : index + 1}
                    </div>

                    {/* Module detail card - Artistic Flair bottom border accent */}
                    <div className={`flex-1 bg-white p-6 border-b-4 border border-[#4E220F]/5 rounded-xl shadow-sm transition-all hover:shadow-md ${
                      isCompleted ? "border-b-4 border-[#B0BA99]" : isInProgress ? "border-b-4 border-[#9D6638] shadow-md scale-[1.01] relative z-10" : "border-b-4 border-gray-100 opacity-90"
                    }`}>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                        <div>
                          <span className={`text-[9px] font-sans font-extrabold uppercase px-2 py-0.5 rounded-sm ${
                            mod.difficulty === "Advanced" ? "bg-red-50 text-red-700 border border-red-200" : mod.difficulty === "Intermediate" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-green-50 text-green-700 border border-green-200"
                          }`}>
                            {mod.difficulty || "Beginner"} Stage
                          </span>
                          <h4 className="font-serif font-extrabold text-xl text-[#4E220F] mt-1.5 leading-snug tracking-tight transition-colors duration-200 group-hover:text-[#9D6638]">{mod.title}</h4>
                        </div>
                        
                        <div className="flex flex-row items-center gap-2">
                          <span className="text-xs font-semibold text-[#9D6638] whitespace-nowrap">
                            ⏱ {mod.estimated_time || "12 hours"}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#6D4230]/90 leading-relaxed mb-4">
                        {mod.description}
                      </p>

                      {/* Step by step show sub-timeline */}
                      <div className="mt-5 space-y-4 pt-4 border-t border-[#4E220F]/10">
                        <div className="text-[10px] font-sans font-black uppercase tracking-wider text-[#9D6638] mb-1">
                          Detailed Action Steps
                        </div>
                        
                        {/* Step 1: Study Materials */}
                        <div className="flex items-start space-x-3 text-xs">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FAF6EB] text-[#4E220F]/60 border border-[#4E220F]/10 font-mono text-[10px] font-bold flex-shrink-0">
                            1
                          </span>
                          <div className="flex-1">
                            <p className="font-bold text-[#4E220F]">Study Core Curriculum</p>
                            <p className="text-[11px] text-[#6D4230]/75 leading-normal mt-0.5 mb-2">Examine recommended readings and conceptual documentation prepared for this stage:</p>
                            {modResources.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-[#FAF6EB]/30 p-2.5 rounded-lg border border-[#4E220F]/5">
                                {modResources.map((res: Resource) => (
                                  <a
                                    key={res.id}
                                    href={res.url}
                                    target="_blank"
                                    rel="referrer"
                                    className="text-[11px] font-semibold text-[#4E220F]/90 hover:text-[#9D6638] flex items-center gap-1.5 hover:underline truncate"
                                  >
                                    <span className="w-1.5 h-1.5 bg-[#9D6638]/40 rounded-full flex-shrink-0"></span>
                                    <span className="truncate">[{res.type}] {res.title}</span>
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="text-[11px] text-[#6D4230]/60 italic font-medium">No supplementary reading required for this core unit.</p>
                            )}
                          </div>
                        </div>

                        {/* Step 2: Practical Milestone */}
                        {mod.milestone && (
                          <div className="flex items-start space-x-3 text-xs">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FAF6EB] text-[#4E220F]/60 border border-[#4E220F]/10 font-mono text-[10px] font-bold flex-shrink-0">
                              2
                            </span>
                            <div className="flex-1">
                              <p className="font-bold text-[#4E220F]">Practical Deliverable Target</p>
                              <p className="text-[11px] text-[#6D4230]/75 leading-normal mt-0.5">Submit, demo, or build the selected showcase project:</p>
                              <div className="mt-1 flex items-center gap-2 text-xs text-[#9D6638] font-bold italic">
                                <Award className="w-4 h-4 flex-shrink-0 text-[#9D6638]" />
                                <span className="not-italic text-[#4E220F]">{mod.milestone}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 3: Diagnostic Assessment */}
                        <div className="flex items-start space-x-3 text-xs">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FAF6EB] text-[#4E220F]/60 border border-[#4E220F]/10 font-mono text-[10px] font-bold flex-shrink-0">
                            {mod.milestone ? "3" : "2"}
                          </span>
                          <div className="flex-1">
                            <p className="font-bold text-[#4E220F]">Demonstrate Competency</p>
                            <p className="text-[11px] text-[#6D4230]/75 leading-normal mt-0.5 mb-2.5">Pass the diagnostic checkpoint quiz to verify understanding and award curriculum index credits:</p>
                            
                            {/* Completion Progress control bar */}
                            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-[#FAF6EB]/50 p-3 rounded-xl border border-[#4E220F]/5">
                              <div className="flex items-center space-x-2">
                                <div className="w-24 sm:w-32 bg-[#F7F1DE] h-1.5 rounded-full overflow-hidden border border-[#4E220F]/5">
                                  <div
                                    className="bg-[#9D6638] h-full transition-all duration-300"
                                    style={{ width: `${completionPercentageMod}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold text-[#6D4230]">
                                  {completionPercentageMod}%
                                </span>
                              </div>

                              <div className="flex gap-1.5 justify-end">
                                {!prog || prog.status === "not_started" ? (
                                  <button
                                    onClick={() => handleStartModule(mod.id)}
                                    className="px-3 py-1 font-sans text-[11px] font-black uppercase tracking-wider text-white bg-[#9D6638] hover:bg-[#a87447] rounded transition-all duration-150"
                                  >
                                    Start Chapter
                                  </button>
                                ) : prog.status === "in_progress" ? (
                                  <>
                                    <button
                                      onClick={() => openQuizModal(mod)}
                                      className="px-3 py-1 font-sans text-[11px] font-black uppercase tracking-wider bg-[#9D6638] text-white hover:bg-[#a87447] rounded transition-all duration-150 flex items-center gap-1"
                                    >
                                      <HelpCircle className="w-3.5 h-3.5" />
                                      <span>Take Quiz</span>
                                    </button>
                                    <button
                                      onClick={() => handleCompleteModule(mod.id)}
                                      className="px-2 py-1 text-[9px] font-sans font-black uppercase tracking-wider bg-[#B0BA99] text-[#4E220F] hover:bg-[#99a382] rounded"
                                    >
                                      Skip to Done
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-xs font-bold text-green-700 flex items-center gap-1 font-sans">
                                    <CheckCircle className="w-3.5 h-3.5 text-green-700" /> Approved
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* Right Column: Mini Widgets - Restyled in Artistic Flair theme */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Skills Profile */}
          <div className="bg-white p-6 border border-[#4E220F]/10 rounded-xl shadow-sm">
            <h4 className="font-serif font-black text-sm uppercase text-[#4E220F] border-b border-[#4E220F]/10 pb-2 mb-4 flex justify-between items-center">
              <span>Active Strengths</span>
              <span className="text-xs font-bold text-[#9D6638]">({userSkills.length})</span>
            </h4>

            {userSkills.length === 0 ? (
              <p className="text-xs font-semibold text-[#6D4230] italic">
                No active strengths updated in diagnostic logs.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {userSkills.map((s: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-bold bg-[#F7F1DE]/40 border border-[#4E220F]/5 p-2 rounded-lg">
                    <div>
                      <span className="block truncate font-serif text-[#4E220F]">{s.skill_name}</span>
                      <span className="text-[9px] text-[#6D4230]/70 font-semibold">{s.category}</span>
                    </div>
                    <span className="text-[10px] bg-[#B0BA99]/30 text-[#4E220F]/85 border border-[#4E220F]/10 px-2 py-0.5 rounded font-mono">
                      {s.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Actions / Quick Task List widget */}
          <div className="bg-white p-6 border border-[#4E220F]/10 rounded-xl shadow-sm">
            <h4 className="font-serif font-black text-sm uppercase text-[#4E220F] border-b border-[#4E220F]/10 pb-2 mb-4 flex items-center gap-1.5">
              <ListTodo className="w-4 h-4 text-[#9D6638]" />
              <span>Diagnostic Checklist</span>
            </h4>
            <div className="space-y-3 font-semibold text-xs text-[#6D4230]">
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#9D6638] rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Active Target: <strong className="text-[#4E220F]">{analytics.upcomingTask}</strong></span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#B0BA99] rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Complete recommended video course readings link inside Stage Card.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#9D6638]/40 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>Pass the diagnostic checkpoint quiz to unlock complete metrics.</span>
              </div>
            </div>
            
            <button
              onClick={() => onNavigate("analytics")}
              className="w-full mt-4 text-[10px] font-bold uppercase text-[#9D6638] tracking-widest text-center hover:underline flex items-center justify-center gap-1 font-sans"
            >
              <span>Examine detailed reports</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Mentor Call widget card - Styled high contrast like the design */}
          <div className="bg-gradient-to-br from-[#9D6638] to-[#91582a] text-[#F7F1DE] p-6 rounded-2xl shadow-md border border-[#4E220F]/10">
            <Sparkles className="w-6 h-6 text-[#F7F1DE] mb-3 animate-pulse" />
            <h5 className="font-serif font-bold text-base leading-snug">Stuck on layout configurations or type constraints?</h5>
            <p className="text-xs opacity-90 mt-2 leading-relaxed">
              Our scholar AI mentor Barnaby Sterling stands ready to diagnose compiler errors and layout alignments.
            </p>
            <button
              onClick={() => onNavigate("mentor")}
              className="w-full mt-4 bg-[#F7F1DE] text-[#4E220F] hover:bg-white py-2 text-xs font-bold tracking-wider rounded-lg transition-colors font-sans uppercase shadow-sm"
            >
              Open Consult Panel
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}