import React, { useState, useEffect } from "react";
import { Compass, Sparkles, BookOpen, Clock, Heart, Award, CheckCircle, Info } from "lucide-react";

interface SkillItem {
  name: string;
  category: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced";
}

interface SkillAssessmentProps {
  userId: string;
  onGenerationComplete: (newPathId: string) => void;
  onGoToDashboard: () => void;
}

export default function SkillAssessment({ userId, onGenerationComplete, onGoToDashboard }: SkillAssessmentProps) {
  // Preconfigured catalogue of selectable skill tags to recommend
  const recommendSkills = [
    { name: "React.js", category: "Frontend Development" },
    { name: "TypeScript", category: "Programming Languages" },
    { name: "Tailwind CSS", category: "Frontend Design" },
    { name: "Node.js & Express", category: "Backend Development" },
    { name: "PostgreSQL", category: "Databases" },
    { name: "Python Basics", category: "Data Science & AI" },
    { name: "Machine Learning Foundations", category: "Data Science & AI" },
    { name: "Docker & Containerization", category: "DevOps" },
    { name: "UI/UX & Figma", category: "Design" }
  ];

  const [selectedSkills, setSelectedSkills] = useState<SkillItem[]>([
    { name: "React.js", category: "Frontend Development", proficiency: "Beginner" }
  ]);
  const [customSkillInput, setCustomSkillInput] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("Beginner");
  const [careerGoals, setCareerGoals] = useState<string>("");
  const [interests, setInterests] = useState<string>("");
  const [learningPreferences, setLearningPreferences] = useState<string>("Visual tutorials");
  const [weeklyHours, setWeeklyHours] = useState<number>(12);

  // Status flags during generation loaders
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const toggleSkillItem = (recommend: { name: string; category: string }) => {
    const exists = selectedSkills.find((s) => s.name === recommend.name);
    if (exists) {
      setSelectedSkills(selectedSkills.filter((s) => s.name !== recommend.name));
    } else {
      setSelectedSkills([...selectedSkills, { name: recommend.name, category: recommend.category, proficiency: "Beginner" }]);
    }
  };

  const handleCustomSkillAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillInput.trim()) return;
    
    const exists = selectedSkills.find((s) => s.name.toLowerCase() === customSkillInput.trim().toLowerCase());
    if (!exists) {
      setSelectedSkills([...selectedSkills, { name: customSkillInput.trim(), category: "Custom Category", proficiency: "Beginner" }]);
    }
    setCustomSkillInput("");
  };

  const updateProficiency = (skillName: string, level: "Beginner" | "Intermediate" | "Advanced") => {
    setSelectedSkills(
      selectedSkills.map((s) => (s.name === skillName ? { ...s, proficiency: level } : s))
    );
  };

  const handleAssessmentSubmit = async () => {
    if (!careerGoals.trim()) {
      setErrorMsg("Please specify your desired career path or professional goal.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setGenerationStep("Analyzing skill catalog gaps...");

    try {
      // Step A: Submit assessment details to user record
      const assessRes = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          selectedSkills,
          experienceLevel,
          careerGoals,
          interests,
          learningPreferences,
          weeklyHours
        })
      });

      if (!assessRes.ok) {
        throw new Error("Unable to record assessment characteristics");
      }

      setGenerationStep("Querying server-side Gemini intelligence models...");
      
      // Step B: Trigger AI Path Generator
      const pathRes = await fetch("/api/learning-path/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          title: `Personal Path to ${careerGoals}`,
          goal: careerGoals,
          level: experienceLevel,
          skillsToLearn: selectedSkills.map((s) => `${s.name} (${s.proficiency})`).join(", "),
          preferences: `${learningPreferences}. Time allocation: ${weeklyHours} hours per week. Interests include ${interests}.`,
          durationWeeks: Math.ceil((weeklyHours > 0 ? 120 / weeklyHours : 10)) // dynamic calculated duration based on hours
        })
      });

      const pathData = await pathRes.json();
      if (!pathRes.ok) {
        throw new Error(pathData.error || "Failed while parsing generating path details");
      }

      setGenerationStep("Saving generated pathway credentials to database...");
      setTimeout(() => {
        onGenerationComplete(pathData.learningPathId);
      }, 700);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "An operational failure halted path engineering. Please review configuration.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in text-[#4E220F]">
      {/* Loading overlay for AI generation */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-[#4E220F]/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#FAF6EB] border-4 border-[#4E220F] shadow-[8px_8px_0px_#4E220F] rounded-lg p-8 max-w-md w-full text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <span className="absolute inset-0 border-4 border-[#B0BA99] rounded-full animate-ping opacity-75"></span>
              <span className="absolute inset-0 border-4 border-[#9D6638] rounded-full animate-spin border-t-transparent"></span>
            </div>
            
            <h3 className="font-serif font-black text-xl text-[#9D6638] uppercase tracking-wide">
              Scholarly Path Engine Cooking...
            </h3>
            <p className="text-sm font-semibold text-[#4E220F] bg-[#B0BA99]/30 px-3 py-2 rounded-md border border-[#4E220F]">
              {generationStep}
            </p>
            <div className="text-xs text-[#6D4230] italic">
              "We synthesize curriculum sequences to matching your professional milestones cleanly."
            </div>
          </div>
        </div>
      )}

      {/* Header and description */}
      <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#4E220F] flex items-center space-x-3">
        <span className="p-1.5 bg-[#9D6638] text-[#FFFDF6] border-2 border-[#4E220F] rounded">
          <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
        </span>
        <span>Aesthetic Curriculums Assessment Form</span>
      </h1>
      <p className="text-xs font-bold text-[#9D6638] uppercase tracking-widest mt-1 mb-8">
        Catalog your current characteristics to engineer matching learning maps
      </p>

      {errorMsg && (
        <div className="mb-6 bg-red-100 border-2 border-red-800 text-red-900 p-3 text-xs font-bold rounded flex items-center space-x-2">
          <Info className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column Input elements */}
        <div className="lg:col-span-8 bg-[#FAF6EB] p-6 sm:p-8 border-4 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded-lg space-y-8">
          
          {/* Target objective / Role */}
          <div className="space-y-2">
            <label className="block text-xs font-serif font-extrabold uppercase tracking-wider text-[#9D6638]">
              1. Desired Skill Focus or Career Target
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lead React Architect, Machine Learning Scientist, UX Designer"
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              className="w-full px-4 py-2 bg-[#F7F1DE] border-2 border-[#4E220F] font-semibold text-sm focus:outline-none focus:bg-[#FFFDF6] rounded"
            />
            <p className="text-[10px] text-[#6D4230] leading-snug">
              This acts as the primary goal parameter. It dictates what modules are generated for your path.
            </p>
          </div>

          {/* Core expertise level */}
          <div className="space-y-4">
            <label className="block text-xs font-serif font-extrabold uppercase tracking-wider text-[#9D6638]">
              2. Your Overall Experience Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setExperienceLevel(lvl)}
                  className={`py-2 px-3 border-2 text-xs font-bold rounded ${
                    experienceLevel === lvl
                      ? "bg-[#9D6638] text-[#FFFDF6] border-[#4E220F]"
                      : "bg-[#F7F1DE] hover:bg-[#B0BA99]/20 border-[#4E220F]/60"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Selectable Skill directory */}
          <div className="space-y-4">
            <label className="block text-xs font-serif font-extrabold uppercase tracking-wider text-[#9D6638]">
              3. Highlight Skills You Have Touched (Optional)
            </label>
            
            <div className="flex flex-wrap gap-2">
              {recommendSkills.map((rec) => {
                const isActive = selectedSkills.some((s) => s.name === rec.name);
                return (
                  <button
                    key={rec.name}
                    type="button"
                    onClick={() => toggleSkillItem(rec)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded border ${
                      isActive
                        ? "bg-[#B0BA99] text-[#4E220F] border-[#4E220F] font-bold"
                        : "bg-[#F7F1DE] text-[#4E220F]/80 border-[#4E220F]/30"
                    }`}
                  >
                    {isActive ? "✓ " : "+ "} {rec.name}
                  </button>
                );
              })}
            </div>

            {/* Custom skill manual insertion */}
            <form onSubmit={handleCustomSkillAdd} className="flex gap-2">
              <input
                type="text"
                placeholder="Insert custom strength..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                className="flex-1 px-3 py-1 bg-[#F7F1DE] border border-[#4E220F]/60 text-xs font-semibold rounded"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-[#B0BA99] border-2 border-[#4E220F] text-xs font-bold rounded shadow-[1px_1px_0px_#4E220F]"
              >
                Add
              </button>
            </form>
          </div>

          {/* Learning preference and study speed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="block text-xs font-serif font-extrabold uppercase tracking-wider text-[#9D6638]">
                4. Primary Format Interest
              </label>
              <select
                value={learningPreferences}
                onChange={(e) => setLearningPreferences(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F1DE] border-2 border-[#4E220F] font-semibold text-xs focus:outline-none rounded"
              >
                <option>Visual tutorials & courses</option>
                <option>Official Documentation guides</option>
                <option>Academic Textbooks & Whitepapers</option>
                <option>Hands-on Practice projects</option>
                <option>Professional Certifications</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-serif font-extrabold uppercase tracking-wider text-[#9D6638]">
                  5. Weekly Study Allocation
                </label>
                <span className="font-mono text-xs font-bold text-[#9D6638] bg-[#FAF6EB] border border-[#4E220F] px-2 py-0.5 rounded">
                  {weeklyHours} hrs
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="40"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                className="w-full accent-[#9D6638]"
              />
              <div className="flex justify-between text-[10px] font-bold text-[#6D4230]/70 uppercase">
                <span>Leisure (3h)</span>
                <span>Standard (15h)</span>
                <span>Scholarly Boot (40h)</span>
              </div>
            </div>
          </div>

          {/* Interests text parameters */}
          <div className="space-y-2">
            <label className="block text-xs font-serif font-extrabold uppercase tracking-wider text-[#9D6638]">
              6. Subjects of Interest or Focus Niches (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Responsive layout designs, system proxies, data analysis pipelines..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full px-4 py-2 bg-[#F7F1DE] border-2 border-[#4E220F] font-semibold text-sm focus:outline-none rounded"
            />
          </div>

        </div>

        {/* Right column Selected Skills status overview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#B0BA99] border-4 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] p-6 rounded-lg text-amber-950">
            <BookOpen className="w-8 h-8 text-[#4E220F] mb-4" />
            <h4 className="font-serif font-black text-lg mb-2">Curriculum Builder Guidelines</h4>
            <p className="text-xs leading-relaxed font-semibold mb-4">
              Providing specific goal values optimizes the model. If you already understand specific components, configure their level to bypass redundant material of beginner lectures.
            </p>
            <div className="flex items-center space-x-2 bg-[#FAF6EB]/40 p-2.5 rounded border border-[#4E220F]/20 text-[11px] font-bold">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>Typical path takes 80-120 net study hours.</span>
            </div>
          </div>

          {selectedSkills.length > 0 && (
            <div className="bg-[#FAF6EB] border-4 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] p-6 rounded-lg space-y-4">
              <h5 className="font-serif font-bold text-sm text-[#4E220F] uppercase border-b border-[#4E220F] pb-2">Active Assessments (Strength Map)</h5>
              <div className="max-h-60 overflow-y-auto space-y-3.5 pr-2">
                {selectedSkills.map((s) => (
                  <div key={s.name} className="bg-[#F7F1DE] p-2.5 border border-[#4E220F]/60 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold leading-tight">{s.name}</span>
                      <span className="text-[9px] font-mono font-bold bg-[#B0BA99]/40 px-1.5 py-0.5 rounded border border-[#4E220F]/20">{s.proficiency}</span>
                    </div>
                    {/* Proficiency selector */}
                    <div className="flex gap-1.5 pt-1">
                      {["Beginner", "Intermediate", "Advanced"].map((plevel) => (
                        <button
                          key={plevel}
                          type="button"
                          onClick={() => updateProficiency(s.name, plevel as any)}
                          className={`text-[8px] font-black uppercase tracking-wider flex-1 py-1 rounded border ${
                            s.proficiency === plevel
                              ? "bg-[#9D6638] text-white border-[#4E220F]"
                              : "bg-[#FAF6EB] text-[#4E220F]/70 border-[#4E220F]/20"
                          }`}
                        >
                          {plevel.substr(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleAssessmentSubmit}
              className="w-full py-4 bg-[#9D6638] text-[#FFFDF6] font-serif font-black text-lg border-4 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#4E220F] rounded-lg transition-all"
            >
              Generate AI Learning Path
            </button>
            <button
              onClick={onGoToDashboard}
              className="w-full py-2 bg-[#FAF6EB] text-[#4E220F] text-xs font-bold border-2 border-[#4E220F]/80 text-center rounded hover:bg-[#B0BA99]/20 transition-all"
            >
              Cancel & Back to Dashboard
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
