import React from "react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { BarChart as BarIcon, Calendar, Trophy, Award, BookOpen, Clock, Heart } from "lucide-react";

interface ProgressAnalyticsProps {
  analyticsData: any;
}

export default function ProgressAnalytics({ analyticsData }: ProgressAnalyticsProps) {
  // Weekly reports mock details matching standard database
  const performanceCurveData = [
    { name: "Week 1", hours: 6, score: 72 },
    { name: "Week 2", hours: 10, score: 75 },
    { name: "Week 3", hours: 12, score: 80 },
    { name: "Week 4", hours: 9, score: 85 },
    { name: "Week 5", hours: 15, score: 88 },
    { name: "Week 6", hours: 16, score: 92 }
  ];

  // Completion statuses modules detail
  const modulesMockData = [
    { title: "Stage 1: Foundational Layout", completion: 100, quiz: 95 },
    { title: "Stage 2: Strict Type System", completion: 60, quiz: 85 },
    { title: "Stage 3: Relational Architect", completion: 0, quiz: 0 }
  ];

  const categoryShare = [
    { name: "Frontend Design", value: 35, color: "#9D6638" },
    { name: "Programming Languages", value: 25, color: "#B0BA99" },
    { name: "Backend Servers", value: 20, color: "#4E220F" },
    { name: "Data Science & AI", value: 20, color: "#E5A96A" }
  ];

  const avgQuizScore = 88;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in text-[#4E220F]">
      <div className="border-b-4 border-[#4E220F] pb-4 mb-8">
        <h1 className="font-serif font-black text-3xl text-[#4E220F] flex items-center gap-2">
          <span className="p-1.5 bg-[#9D6638] text-white border-2 border-[#4E220F] rounded">
            <BarIcon className="w-6 h-6" />
          </span>
          <span>Pedagogic Analytics & Progress reports</span>
        </h1>
        <p className="text-xs font-bold text-[#9D6638] uppercase tracking-widest mt-1">
          Monitor your daily study hours, quiz scores, and subject completions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-[#FAF6EB] p-5 border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] rounded flex items-start space-x-4">
          <span className="p-3 bg-[#B0BA99]/40 border border-[#4E220F] rounded mt-0.5">
            <Clock className="w-5 h-5 text-[#9D6638]" />
          </span>
          <div>
            <span className="text-[10px] font-bold text-[#6D4230] uppercase tracking-wider block">Average Study Pace</span>
            <div className="text-2xl font-mono font-black text-[#4E220F] mt-1">11.3 Hours / week</div>
            <p className="text-[10px] text-green-800 font-semibold mt-1">✓ Matching leisure schedules benchmarks</p>
          </div>
        </div>

        <div className="bg-[#FAF6EB] p-5 border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] rounded flex items-start space-x-4">
          <span className="p-3 bg-[#B0BA99]/40 border border-[#4E220F] rounded mt-0.5">
            <Award className="w-5 h-5 text-green-800" />
          </span>
          <div>
            <span className="text-[10px] font-bold text-[#6D4230] uppercase tracking-wider block">Quiz Checkpoint Success</span>
            <div className="text-2xl font-mono font-black text-[#4E220F] mt-1">{avgQuizScore}% Average</div>
            <p className="text-[10px] text-[#6D4230]">Passed 3 key technical criteria</p>
          </div>
        </div>

        <div className="bg-[#FAF6EB] p-5 border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] rounded flex items-start space-x-4">
          <span className="p-3 bg-[#B0BA99]/40 border border-[#4E220F] rounded mt-0.5">
            <Trophy className="w-5 h-5 text-yellow-700" />
          </span>
          <div>
            <span className="text-[10px] font-bold text-[#6D4230] uppercase tracking-wider block">Certificates Gained</span>
            <div className="text-2xl font-mono font-black text-[#4E220F] mt-1">2 Milestones Logged</div>
            <p className="text-[10px] text-green-800 font-semibold mt-1">✓ Active portfolio uploaded</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Recharts Curve tracking hourly commitment */}
        <div className="lg:col-span-8 bg-[#FAF6EB] p-5 border-4 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded-lg">
          <h3 className="font-serif font-black text-lg mb-4 text-[#4E220F] flex justify-between items-center bg-[#F7F1DE] py-2 px-3 border border-[#4E220F] rounded">
            <span>Weekly Study Hour Progression</span>
            <span className="text-xs font-mono font-bold text-amber-900 uppercase">Last 6 Weeks</span>
          </h3>

          <div className="h-64 sm:h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9D6638" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#9D6638" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4E220F" strokeOpacity={0.15} />
                <XAxis dataKey="name" stroke="#4E220F" style={{ fontSize: "10px", fontWeight: "bold" }} />
                <YAxis stroke="#4E220F" style={{ fontSize: "10px", fontWeight: "bold" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FAF6EB", border: "2px solid #4E220F", color: "#4E220F", fontSize: "11px", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="hours" stroke="#9D6638" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Radar Pie chart representing proficiency splits */}
        <div className="lg:col-span-4 bg-[#FAF6EB] p-5 border-4 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded-lg flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-base uppercase text-[#4E220F] border-b-2 border-[#4E220F] pb-2 mb-4">
              Competencies Distribution
            </h3>
            
            <div className="h-44 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryShare}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#4E220F" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#FAF6EB", border: "2px solid #4E220F", fontSize: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[#4E220F]/15">
            {categoryShare.map((cat, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-bold">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 border border-[#4E220F]" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-[#6D4230]">{cat.name}</span>
                </div>
                <span>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Module Performance Logs Table */}
        <div className="bg-[#FAF6EB] p-5 border-4 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded-lg">
          <h4 className="font-serif font-bold text-base uppercase mb-3 border-b-2 border-[#4E220F] pb-2 text-[#4E220F]">
            Competency Checklist Diagnostic Log
          </h4>

          <div className="space-y-4">
            {modulesMockData.map((m, idx) => (
              <div key={idx} className="bg-[#F7F1DE] p-3 border border-[#4E220F]/40 rounded flex justify-between items-center">
                <div>
                  <h5 className="text-xs font-bold text-[#4E220F]">{m.title}</h5>
                  <span className="text-[10px] text-[#6D4230] font-semibold">Sequence Choke Point #{idx + 1}</span>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-[10px] font-bold text-amber-950 uppercase bg-[#B0BA99]/40 border border-[#4E220F]/20 px-2 py-0.5 rounded">
                    Quiz Score: {m.quiz > 0 ? `${m.quiz}%` : "Not Attempted"}
                  </div>
                  <div className="text-[9px] font-mono font-bold text-[#9D6638]">
                    {m.completion}% Completed
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recharts Bar chart displaying module achievements */}
        <div className="bg-[#FAF6EB] p-5 border-4 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded-lg">
          <h4 className="font-serif font-bold text-base uppercase mb-3 border-b-2 border-[#4E220F] pb-2 text-[#4E220F]">
            Curriculum diagnostic milestones ratings
          </h4>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceCurveData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4E220F" strokeOpacity={0.12} />
                <XAxis dataKey="name" stroke="#4E220F" style={{ fontSize: "10px", fontWeight: "bold" }} />
                <YAxis stroke="#4E220F" style={{ fontSize: "10px", fontWeight: "bold" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FAF6EB", border: "2px solid #4E220F", color: "#4E220F", fontSize: "11px", fontWeight: "bold" }}
                />
                <Bar dataKey="score" fill="#B0BA99" stroke="#4E220F" strokeWidth={1} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
