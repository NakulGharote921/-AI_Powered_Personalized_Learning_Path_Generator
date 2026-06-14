export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
  experience_level?: string;
  career_goals?: string;
  interests?: string;
  learning_preferences?: string;
  weekly_hours?: number;
}

export interface Skill {
  id: string;
  skill_name: string;
  category: string;
}

export interface UserSkill {
  id?: string;
  skill_name: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced";
  category?: string;
}

export interface LearningPath {
  id: string;
  user_id: string;
  title: string;
  goal: string;
  duration: string;
  created_at: string;
  is_active: boolean;
  skill_gaps: string[];
  is_simulated?: boolean;
}

export interface Module {
  id: string;
  learning_path_id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | string;
  estimated_time: string;
  sort_order: number;
  milestone: string;
}

export interface Resource {
  id: string;
  module_id: string;
  title: string;
  type: "Course" | "YouTube Tutorial" | "Documentation" | "Article" | "Certification" | string;
  url: string;
}

export interface Progress {
  id: string;
  user_id: string;
  module_id: string;
  status: "not_started" | "in_progress" | "completed";
  completion_percentage: number;
  quiz_score?: number;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  weeklyStudyHours: number;
  quizzesTaken: number;
  modulesCompleted: number;
  streakDays: number;
  performanceScore: number;
  upcomingTask: string;
}

export interface DashboardData {
  activePath: LearningPath | null;
  allUserPaths: LearningPath[];
  modules: Module[];
  resources: Resource[];
  progress: Progress[];
  userSkills: UserSkill[];
  analytics: AnalyticsSummary;
  completionPercentage: number;
}
