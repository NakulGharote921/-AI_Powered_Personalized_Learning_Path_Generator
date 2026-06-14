import React from "react";
import { BookOpen, Sparkles, Compass, GraduationCap, Award, CheckCircle, ArrowRight, ShieldCheck, ChevronRight, MessageSquare, BarChart, Users } from "lucide-react";

interface LandingPageProps {
  onEnterApp: () => void;
  onGoToAuth: () => void;
}

export default function LandingPage({ onEnterApp, onGoToAuth }: LandingPageProps) {
  // Mock previews of roads for the "AI Learning Journey Preview"
  const previewMilestones = [
    { title: "Stage 1: Foundational Layout Design", duration: "12 Hours", challenge: "Figma wireframe mapping" },
    { title: "Stage 2: Strict State Machine Architectures", duration: "24 Hours", challenge: "JSON schema validators" },
    { title: "Stage 3: Cloud Ingress Security", duration: "36 Hours", challenge: "Firestore ABAC rules deployment" }
  ];

  return (
    <div className="min-h-screen bg-[#F7F1DE] selection:bg-[#9D6638] selection:text-[#FFFDF6] overflow-x-hidden animate-fade-in text-[#4E220F]">
      {/* Premium Header */}
      <header className="border-b-4 border-[#4E220F] bg-[#FAF6EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex justify-between items-center gap-2 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <span className="p-1.5 sm:p-2 bg-[#9D6638] text-[#FFFDF6] border-2 border-[#4E220F] shadow-[2px_2px_0px_#4E220F] rounded flex-shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <span className="font-serif font-black text-lg sm:text-xl tracking-tight uppercase truncate">
              Chronicle <span className="text-[#9D6638]">AI</span>
            </span>
          </div>
          <nav className="hidden md:flex space-x-6 lg:space-x-8 font-semibold text-sm flex-shrink-0">
            <a href="#how-it-works" className="hover:text-[#9D6638] transition-colors">How It Works</a>
            <a href="#preview" className="hover:text-[#9D6638] transition-colors">Path Preview</a>
            <a href="#features" className="hover:text-[#9D6638] transition-colors">Curricular Grid</a>
            <a href="#faq" className="hover:text-[#9D6638] transition-colors">Scholarly FAQ</a>
          </nav>
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <button
              onClick={onGoToAuth}
              className="min-touch px-3 sm:px-4 py-2 text-sm font-bold border-2 border-[#4E220F] bg-transparent hover:bg-[#B0BA99] transition-all duration-150 whitespace-nowrap"
              id="header_login_btn"
            >
              Sign In
            </button>
            <button
              onClick={onEnterApp}
              className="min-touch px-4 sm:px-5 py-2 text-sm font-bold bg-[#9D6638] text-[#FFFDF6] border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#4E220F] transition-all whitespace-nowrap"
              id="header_get_started_btn"
            >
              Enter Academy
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 sm:pb-20 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-[#B0BA99] text-[#4E220F] px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-[#4E220F] rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#4E220F] mb-6 sm:mb-8">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
          <span>Generative Scholarly Paths Engineered Daily</span>
        </div>

        <h1 className="font-serif font-black responsive-hero max-w-5xl mx-auto tracking-normal">
          Assess Your Gaps. <br />
          <span className="text-[#9D6638] italic">AI-Generated</span> Curriculums.
        </h1>

        <p className="mt-4 sm:mt-6 responsive-subtitle text-[#6D4230] max-w-2xl mx-auto font-medium">
          Ditch scattered links. Map your current skill level, set your goals constraints, and deploy a structured aesthetic pathway curated with real-world resources and academic mentorship.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 px-0">
          <button
            onClick={onEnterApp}
            className="w-full sm:w-auto min-touch px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold bg-[#9D6638] text-[#FFFDF6] border-4 border-[#4E220F] shadow-[5px_5px_0px_#4E220F] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[9px_9px_0px_#4E220F] transition-all"
            id="hero_cta_generate"
          >
            Create My AI Path Now
          </button>
          <a
            href="#preview"
            className="w-full sm:w-auto min-touch px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold bg-[#B0BA99] text-[#4E220F] border-4 border-[#4E220F] shadow-[5px_5px_0px_#4E220F] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#4E220F] transition-all text-center"
          >
            Audit Sample Roadmaps
          </a>
        </div>

        {/* Success Metrics Block */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 px-3 sm:px-4 py-6 sm:py-8 bg-[#FAF6EB] border-4 border-[#4E220F] shadow-[6px_6px_0px_#4E220F] max-w-5xl mx-auto rounded-lg">
          <div className="text-center p-2 sm:p-4">
            <div className="font-serif text-xl sm:text-2xl md:text-4xl font-extrabold text-[#9D6638]">45,000+</div>
            <div className="text-[10px] sm:text-xs font-bold text-[#6D4230] mt-0.5 sm:mt-1 tracking-wider uppercase">Paths Deployed</div>
          </div>
          <div className="text-center p-2 sm:p-4 border-l-0 sm:border-l-2 border-[#4E220F]/30">
            <div className="font-serif text-xl sm:text-2xl md:text-4xl font-extrabold text-[#9D6638]">94.6%</div>
            <div className="text-[10px] sm:text-xs font-bold text-[#6D4230] mt-0.5 sm:mt-1 tracking-wider uppercase">Gap Remediation</div>
          </div>
          <div className="text-center p-2 sm:p-4 border-l-0 sm:border-l-2 border-[#4E220F]/30">
            <div className="font-serif text-xl sm:text-2xl md:text-4xl font-extrabold text-[#9D6638]">30 hours</div>
            <div className="text-[10px] sm:text-xs font-bold text-[#6D4230] mt-0.5 sm:mt-1 tracking-wider uppercase">Avg. Saved per Topic</div>
          </div>
          <div className="text-center p-2 sm:p-4 border-l-0 sm:border-l-2 border-[#4E220F]/30">
            <div className="font-serif text-xl sm:text-2xl md:text-4xl font-extrabold text-[#9D6638]">380+</div>
            <div className="text-[10px] sm:text-xs font-bold text-[#6D4230] mt-0.5 sm:mt-1 tracking-wider uppercase">Expert Lecturers</div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-[#B0BA99] border-t-4 border-b-4 border-[#4E220F] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto px-0">
            <h2 className="font-serif font-black responsive-section-title">The Systematic Pedagogic Cycle</h2>
            <p className="mt-3 sm:mt-4 responsive-subtitle text-[#3E4C1E] font-semibold">
              Three clear stages designed around your time slots and learning behaviors.
            </p>
          </div>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-[#FAF6EB] card-p-responsive border-4 border-[#4E220F] shadow-[5px_5px_0px_#4E220F] rounded-lg relative overflow-hidden">
              <div className="absolute top-4 right-4 text-4xl sm:text-6xl font-serif font-bold text-[#B0BA99]/40">I</div>
              <Compass className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#9D6638] mb-4 sm:mb-6" />
              <h3 className="font-serif font-black text-lg sm:text-xl mb-2 sm:mb-3">1. Custom Skill Assessment</h3>
              <p className="responsive-small font-medium text-[#6D4230]">
                Mark down your active tools, comfort levels, weekly study hours, role interest, and professional target goals.
              </p>
            </div>

            <div className="bg-[#FAF6EB] card-p-responsive border-4 border-[#4E220F] shadow-[5px_5px_0px_#4E220F] rounded-lg relative overflow-hidden">
              <div className="absolute top-4 right-4 text-4xl sm:text-6xl font-serif font-bold text-[#B0BA99]/40">II</div>
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#9D6638] mb-4 sm:mb-6" />
              <h3 className="font-serif font-black text-lg sm:text-xl mb-2 sm:mb-3">2. AI Synthesis & Gap Analysis</h3>
              <p className="responsive-small font-medium text-[#6D4230]">
                Our server queries Gemini models to contrast your skills, identifying key blindspots and generating matching modules instantly.
              </p>
            </div>

            <div className="bg-[#FAF6EB] card-p-responsive border-4 border-[#4E220F] shadow-[5px_5px_0px_#4E220F] rounded-lg relative overflow-hidden sm:col-span-2 md:col-span-1">
              <div className="absolute top-4 right-4 text-4xl sm:text-6xl font-serif font-bold text-[#B0BA99]/40">III</div>
              <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#9D6638] mb-4 sm:mb-6" />
              <h3 className="font-serif font-black text-lg sm:text-xl mb-2 sm:mb-3">3. Interactive Path Milestone</h3>
              <p className="responsive-small font-medium text-[#6D4230]">
                Follow stages, earn streaks, read documents, watch courses, pass checkpoints, and consult with your dedicated AI Mentor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Journey Preview Workspace */}
      <section id="preview" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-[#9D6638] font-bold tracking-widest text-[10px] sm:text-xs uppercase block mb-2">Curriculum Preview</span>
            <h2 className="font-serif font-black responsive-section-title leading-tight">
              Aesthetically Structured Learning Pathways
            </h2>
            <p className="mt-4 text-[#6D4230] font-medium responsive-body leading-relaxed">
              No more random bookmarked tutorials. Each path is mapped to real deliverables. See exactly how modules build from primary concepts into complex capstone achievements.
            </p>

            <ul className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              <li className="flex items-start space-x-3 font-semibold responsive-small">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#9D6638] flex-shrink-0 mt-0.5" />
                <span>Beginner to Advanced progression structures</span>
              </li>
              <li className="flex items-start space-x-3 font-semibold responsive-small">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#9D6638] flex-shrink-0 mt-0.5" />
                <span>Curated resources (YouTube tutorials, docs, certifications)</span>
              </li>
              <li className="flex items-start space-x-3 font-semibold responsive-small">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#9D6638] flex-shrink-0 mt-0.5" />
                <span>Weekly diagnostic reports & analytics charts</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7 bg-[#FAF6EB] card-p-responsive border-4 border-[#4E220F] shadow-[6px_6px_0px_#4E220F] rounded-lg">
            <div className="flex flex-col sm:flex-row border-b-2 border-[#4E220F] pb-4 justify-between items-start sm:items-center bg-[#F7F1DE]/60 p-3 sm:p-3 rounded mb-4 sm:mb-6 gap-2">
              <div>
                <div className="font-serif font-black text-xs sm:text-sm text-[#9D6638] uppercase">Roadmap Blueprint</div>
                <div className="text-[10px] sm:text-xs font-bold text-[#4E220F]">ROLE: SPECIALIST CLOUD ENGINEER</div>
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-bold bg-[#B0BA99] px-2 sm:px-2.5 py-0.5 sm:py-1 border border-[#4E220F] uppercase whitespace-nowrap">Active Plan</span>
            </div>

            {/* Timeline Milestones preview */}
            <div className="space-y-4 sm:space-y-6 relative before:absolute before:inset-y-0 before:left-3 before:w-0.5 before:bg-[#4E220F]">
              {previewMilestones.map((milestone, idx) => (
                <div key={idx} className="flex space-x-3 sm:space-x-4 relative">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#9D6638] border-2 border-[#4E220F] flex items-center justify-center font-mono text-[10px] sm:text-xs text-[#FFFDF6] font-bold z-10 flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-[#4E220F] leading-snug">{milestone.title}</h4>
                    <span className="text-[11px] sm:text-xs font-mono text-[#9D6638] font-semibold">{milestone.duration} estimated completion</span>
                    <div className="mt-1 bg-[#F7F1DE] px-2 sm:px-3 py-1 sm:py-1.5 border border-[#4E220F] text-[11px] sm:text-xs font-mono flex items-center space-x-1.5 text-[#6D4230] rounded">
                      <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#9D6638]" />
                      <span>Deliverable: {milestone.challenge}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-[#FAF6EB] border-t-4 border-b-4 border-[#4E220F] py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 px-0">
            <span className="text-[#9D6638] font-bold tracking-widest text-[10px] sm:text-xs uppercase block mb-1">State-Of-The-Art Features</span>
            <h2 className="font-serif font-black responsive-section-title">Engineered for Lifelong Competency</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-[#F7F1DE] card-p-responsive border-2 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#9D6638] mb-3 sm:mb-4" />
              <h4 className="font-serif font-bold text-base sm:text-lg mb-2">Dual Login Modes</h4>
              <p className="responsive-tiny font-medium text-[#6D4230]">
                Authenticate with secure email endpoints. Fully prepared to bind with Google Auth or custom JWT databases instantly.
              </p>
            </div>

            <div className="bg-[#F7F1DE] card-p-responsive border-2 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded">
              <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-[#9D6638] mb-3 sm:mb-4" />
              <h4 className="font-serif font-bold text-base sm:text-lg mb-2">Automated Skill Assessment</h4>
              <p className="responsive-tiny font-medium text-[#6D4230]">
                Input current expertise using predefined lists or categories. Get instant mapping to industry-demanded goals.
              </p>
            </div>

            <div className="bg-[#F7F1DE] card-p-responsive border-2 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#9D6638] mb-3 sm:mb-4" />
              <h4 className="font-serif font-bold text-base sm:text-lg mb-2">AI-Driven Path Generation</h4>
              <p className="responsive-tiny font-medium text-[#6D4230]">
                Analyze skill gaps through server-side Gemini prompts. Design custom structures containing modules, timing constraints and targets.
              </p>
            </div>

            <div className="bg-[#F7F1DE] card-p-responsive border-2 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded">
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-[#9D6638] mb-3 sm:mb-4" />
              <h4 className="font-serif font-bold text-base sm:text-lg mb-2">AI Mentor Chat</h4>
              <p className="responsive-tiny font-medium text-[#6D4230]">
                Consult the digital scholar Barnaby Sterling for deep conceptual breakdowns, system guides, or personalized advice.
              </p>
            </div>

            <div className="bg-[#F7F1DE] card-p-responsive border-2 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded">
              <BarChart className="w-8 h-8 sm:w-10 sm:h-10 text-[#9D6638] mb-3 sm:mb-4" />
              <h4 className="font-serif font-bold text-base sm:text-lg mb-2">Progress Analytics</h4>
              <p className="responsive-tiny font-medium text-[#6D4230]">
                Monitor real completion stats, diagnostic quizzes scores, and study streak tracking inside an interactive chart panel.
              </p>
            </div>

            <div className="bg-[#F7F1DE] card-p-responsive border-2 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] rounded">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-[#9D6638] mb-3 sm:mb-4" />
              <h4 className="font-serif font-bold text-base sm:text-lg mb-2">Scholarly Faculty Panel</h4>
              <p className="responsive-tiny font-medium text-[#6D4230]">
                Monitor operational databases metrics, modify default resource options, or examine simulated user schemas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="font-serif font-black responsive-section-title text-center mb-8 sm:mb-12">Academic Inquiries (FAQ)</h2>
        <div className="space-y-4 sm:space-y-6">
          <div className="card-p-responsive bg-[#FAF6EB] border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] rounded">
            <h4 className="font-serif font-bold text-sm sm:text-base mb-1 sm:mb-2">How accurate are the generated AI modules?</h4>
            <p className="responsive-tiny text-[#6D4230] leading-relaxed">
              We leverage the industry-standard Gemini-3.5 models. The generator evaluates your pre-selected strengths against target role parameters to synthesize custom, structured curriculum checkpoints instantly.
            </p>
          </div>
          <div className="card-p-responsive bg-[#FAF6EB] border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] rounded">
            <h4 className="font-serif font-bold text-sm sm:text-base mb-1 sm:mb-2">Can I utilize this without an external Firebase setup?</h4>
            <p className="responsive-tiny text-[#6D4230] leading-relaxed">
              Absolutely. Our platform is configured with an automated dual-auth system. If the cloud database configuration file is omitted, we engage a premium offline sandbox, giving you immediately functional dashboards out of the box.
            </p>
          </div>
          <div className="card-p-responsive bg-[#FAF6EB] border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] rounded">
            <h4 className="font-serif font-bold text-sm sm:text-base mb-1 sm:mb-2">Where do the resource links come from?</h4>
            <p className="responsive-tiny text-[#6D4230] leading-relaxed">
              Our backend matches active topics against known textbook URLs, specialized web standards (MDN, w3, Coursera), and reputable tutorial providers, ensuring you avoid broken or unsafe directories.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#9D6638] border-t-4 border-[#4E220F] py-16 sm:py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto text-[#FFFDF6]">
          <h2 className="font-serif font-black responsive-section-title leading-tight">Begin Your Personal Learning Chronicles Today</h2>
          <p className="mt-3 sm:mt-4 text-[#F7F1DE] max-w-2xl mx-auto font-medium responsive-subtitle">
            Equip yourself with structured, AI-generated courses, diagnostic quizzes, progress analytics, and expert-level counsel.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto min-touch px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold bg-[#F7F1DE] text-[#4E220F] border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#4E220F] transition-all"
            >
              Get Started for Free
            </button>
            <button
              onClick={onGoToAuth}
              className="w-full sm:w-auto min-touch px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold bg-[#B0BA99] text-[#4E220F] border-2 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#4E220F] transition-all"
            >
              Access Account Portal
            </button>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-[#FAF6EB] border-t-4 border-[#4E220F] py-8 sm:py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[11px] sm:text-xs font-bold text-[#6D4230] space-y-3 md:space-y-0 gap-2">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#9D6638]" />
            <span>CHRONICLE ACADEMY INC. © 2026</span>
          </div>
          <div className="text-center md:text-left">
            <span>Premium Modern-Vintage Educational Technology Systems, inc.</span>
          </div>
          <div className="flex space-x-4 sm:space-x-6">
            <a href="#" className="hover:text-[#9D6638] transition-colors">Privacy Charter</a>
            <a href="#" className="hover:text-[#9D6638] transition-colors">Academic Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}