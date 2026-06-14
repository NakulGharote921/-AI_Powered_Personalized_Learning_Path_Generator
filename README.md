<div align="center">
  <br />
  <h1>🎓 Chronicle Academy</h1>
  <h3>Personalized Learning Path Generator</h3>
  <p><em>An AI-powered platform that generates tailored curriculum roadmaps and guides learners with an intelligent mentor.</em></p>
  <br />
</div>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Express-4.21-000000?style=flat&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Gemini_AI-API-8E75B2?style=flat&logo=googlegemini" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat&logo=firebase" alt="Firebase Auth" />
  <img src="https://img.shields.io/badge/Recharts-3.8-22B5BF?style=flat" alt="Recharts" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat" alt="MIT License" />
</p>

<br />

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the App](#running-the-app)
- [Usage Guide](#-usage-guide)
  - [Authentication](#1-authentication)
  - [Skill Assessment](#2-skill-assessment)
  - [Dashboard](#3-dashboard)
  - [Learning Paths](#4-learning-paths)
  - [Resource Library](#5-resource-library)
  - [Progress Analytics](#6-progress-analytics)
  - [AI Mentor Chat](#7-ai-mentor-chat)
  - [Scholar Profile](#8-scholar-profile)
  - [Admin Panel](#9-admin-panel)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Building for Production](#-building-for-production)
- [License](#-license)

---

## 📖 Overview

**Chronicle Academy** is a full-stack personalized learning platform that uses **Google Gemini AI** to generate custom curriculum roadmaps based on a learner's goals, current skill level, and preferences. It features a vintage academic aesthetic with a character-driven AI mentor — *Barnaby Sterling* — who provides guidance, resources, and motivation throughout the learning journey.

The platform simulates a relational database using a local JSON file (`db_store.json`), making it easy to run without setting up a dedicated database server. Firebase Authentication is optionally integrated for social login, while a built-in local auth system handles registration and login out of the box.

---

## ✨ Features

### Core Features

| Feature | Description |
|---|---|
| **🧭 AI-Powered Curriculum Generation** | Uses Google Gemini AI to generate structured, multi-stage learning paths with modules, milestones, and curated resources. Works offline with a smart fallback generator when no API key is configured. |
| **📊 Interactive Dashboard** | Central control desk showing active learning path, completion progress, skill overview, weekly analytics (study hours, streak days, quizzes taken, performance score), and quick-access controls. |
| **📚 Module-Based Learning** | Each learning path is broken down into stages (Beginner → Intermediate → Advanced) with detailed descriptions, estimated time, and clear milestones. |
| **✅ Progress Tracking** | Track completion percentage per module, mark modules complete via quiz submissions, and visualize your overall journey progress. |
| **🎯 Skill Assessment** | Onboarding flow to assess current skills, experience level, career goals, interests, learning preferences, and weekly availability — used to tailor the learning path. |
| **🤖 AI Mentor Chat** | Chat with *Barnaby Sterling*, an AI mentor with a vintage academic personality. Powered by Gemini AI with intelligent fallback responses for offline mode. |
| **📈 Progress Analytics** | Visual analytics dashboard with charts for study patterns, quiz scores, skill distribution, and completion metrics using Recharts. |
| **📖 Resource Library** | Curated learning resources per module including courses, documentation, YouTube tutorials, and articles. |
| **👤 Scholar Profile** | Personal profile card with user details, skill inventory, and account settings. |
| **🔐 Authentication** | Dual auth system: local email/password registration + optional Firebase Authentication (Google Sign-In). Role-based access (student/admin). |
| **🛠️ Admin Panel** | Faculty dashboard with platform-wide metrics (total users, paths, modules, completion rates), user management, and skill administration. |
| **📱 Responsive Design** | Fully responsive UI with a mobile sidebar navigation, optimized for all screen sizes. |
| **🏛️ Vintage Aesthetic** | Unique academic-themed design with serif typography, warm earth tones, and a refined "Chronicle Academy" brand identity. |

### Bonus

- **Offline-Ready Fallback**: When no Gemini API key is provided, the app generates complete learning paths and mentor responses locally using intelligent templates.
- **Simulated Relational DB**: All data is persisted in a single `db_store.json` file with relational-style joins performed in-memory — no external database needed.

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS framework |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Recharts](https://recharts.org/) | Charting & analytics visualizations |
| [Framer Motion (motion)](https://motion.dev/) | Animations |

### Backend

| Technology | Purpose |
|---|---|
| [Express.js](https://expressjs.com/) | HTTP server & REST API |
| [TypeScript](https://www.typescriptlang.org/) | Server-side type safety |
| [tsx](https://tsx.is/) | TypeScript execution for Node.js |
| Google Generative AI SDK | Gemini AI SDK for content generation & chat |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable management |

### Authentication

| Technology | Purpose |
|---|---|
| [Firebase Authentication](https://firebase.google.com/docs/auth) | Optional OAuth / Google Sign-In |
| [Built-in Local Auth](https://github.com/) | Email/password registration & login (stored in `db_store.json`) |

### Data

- **JSON File Database**: `db_store.json` acts as a self-contained relational data store (users, skills, paths, modules, resources, progress, messages).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- (Optional) **Gemini API Key** for AI features
- (Optional) **Firebase Project** for Google Sign-In authentication

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/personalized-learning-path-generator.git
cd personalized-learning-path-generator

# Install dependencies
npm install
```

### Configuration

#### 1. Set up Gemini API Key (Optional — for AI features)

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **⚠️ Note:** If you skip this step, the app falls back to a built-in template engine that generates realistic learning paths and mentor responses without AI. This is great for testing the UI or demoing without an API key.

#### 2. Set up Firebase (Optional — for Google Sign-In)

1. Create a project in Firebase Console.
2. Enable **Authentication** → **Sign-in method** → **Google**.
3. Create a web app in your Firebase project.
4. Copy the Firebase config object and update `src/firebase.ts` with your credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

> The app also works perfectly fine using only the built-in local authentication.

### Running the App

```bash
# Start in development mode (Vite HMR + Express API)
npm run dev
```

The app will be available at **http://localhost:3000**.

---

## 📖 Usage Guide

### 1. Authentication

- **Landing Page**: Click **"Enter the Academy"** or **"Sign In"** to get started.
- **Register**: Create an account with name, email, and password.
- **Login**: Sign in with your email and password.
- **Firebase Sync**: If configured, you can also sign in with Google.
- **Demo Accounts** (pre-seeded): 
  - Student: `student@learning.edu` / `password123`
  - Admin: `nakulgharote@gmail.com` / `password123`

### 2. Skill Assessment

After logging in for the first time (or clicking **"NEW ROADMAP"** in the header):

1. Select the skills you already know from the available list.
2. Set your experience level (Beginner / Intermediate / Advanced).
3. Enter your career goals and interests.
4. Choose your learning preferences (Visual, Reading, Hands-on, etc.).
5. Set your weekly study hours.
6. Click **"Generate Roadmap"** — the AI will create a personalized learning path.

### 3. Dashboard

The **Control Desk** is your home base showing:

- **Active Learning Path** — your current curriculum with title, goal, duration, and skill gaps.
- **Completion Progress** — overall percentage bar and per-module progress.
- **Skill Overview** — your current skills and proficiency levels.
- **Weekly Analytics** — study hours, quizzes taken, completed modules, streak days, performance score.
- **Quick Actions** — resume learning, take a quiz, or switch paths.

### 4. Learning Paths

The **Curriculums Map** displays:

- **Active Path** — your current learning journey with all stages.
- **Path History** — all previous learning paths you've generated.
- **Stage Details** — each module shows title, description, difficulty level, estimated time, and milestone.
- **Progress Indicators** — see at a glance which modules are not started, in progress, or completed.
- **Switch Paths** — activate a different learning path from your history.

### 5. Resource Library

Each module comes with curated resources:

- Filter by module or resource type (Course, Documentation, YouTube Tutorial, Article).
- External links to learning materials to support each stage.

### 6. Progress Analytics

Visual analytics with charts:

- **Performance Trends** — quiz scores and module completion over time.
- **Skill Distribution** — see your proficiency breakdown across different skill categories.
- **Study Patterns** — weekly hours committed vs. ideal schedule.
- **Completion Metrics** — overall progress and milestone tracking.

### 7. AI Mentor Chat

Click **"Consult AI Mentor"** to open a conversation with *Barnaby Sterling*:

- Ask questions about your learning path, career advice, or technical concepts.
- The AI responds with structured, action-oriented guidance in a refined vintage academic tone.
- Works offline with intelligent fallback responses when no API key is configured.

### 8. Scholar Profile

Your personal profile card showing:

- Name, email, role, and join date.
- Experience level and career goals.
- Current skills and their proficiency levels.
- Account actions (sign out).

### 9. Admin Panel

Available to users with the `admin` role:

- **Platform Metrics** — total users, learning paths, modules, completion rates.
- **User Management** — view all users, their active paths, and completed modules.
- **Skill Management** — add new skills to the global skill library.

---

## 📡 API Reference

All API endpoints are served from `http://localhost:3000/api/`.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login with email & password |
| `POST` | `/api/auth/firebase-sync` | Sync a Firebase-authenticated user |
| `POST` | `/api/auth/logout` | Logout current session |
| `GET` | `/api/auth/session` | Get current session user |

### Skills & Assessment

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/skills` | List all available skills |
| `POST` | `/api/assessment` | Submit skill assessment & preferences |

### Learning Paths

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/learning-path/generate` | Generate a new AI-powered learning path |
| `POST` | `/api/learning-path/activate` | Switch active learning path |

### Dashboard & Progress

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard-data?userId=` | Get full dashboard data with relational joins |
| `POST` | `/api/progress/update` | Update module progress (percentage & status) |
| `POST` | `/api/quizzes/submit` | Submit quiz score & mark module complete |

### AI Mentor

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/mentor/chat` | Send a message to the AI mentor |
| `GET` | `/api/mentor/chat/history?userId=` | Get chat history for a user |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/overview` | Get platform-wide admin metrics & user summaries |
| `POST` | `/api/admin/skills/add` | Add a new skill to the global library |

---

## 📁 Project Structure

```
personalized-learning-path-generator/
├── index.html                  # Vite entry HTML
├── server.ts                   # Express backend (API + Vite middleware)
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies & scripts
├── .env.local                  # Environment variables (GEMINI_API_KEY)
├── db_store.json               # JSON-based database (auto-generated)
├── firebase-applet-config.json # Firebase configuration reference
├── assets/                     # Built static assets (after build)
├── dist/                       # Production build output
│   ├── index.html
│   ├── server.cjs
│   └── assets/
└── src/
    ├── main.tsx                # React entry point
    ├── App.tsx                 # Main app component with routing & sidebar
    ├── index.css               # Global styles (Tailwind imports)
    ├── firebase.ts             # Firebase Authentication setup
    ├── types.ts                # TypeScript interfaces
    ├── components/
    │   ├── LandingPage.tsx     # Welcome / hero landing page
    │   ├── AuthPage.tsx        # Login & registration forms
    │   ├── SkillAssessment.tsx # Onboarding skill assessment wizard
    │   ├── Dashboard.tsx       # Main control desk dashboard
    │   ├── LearningPathView.tsx# Learning path curriculum viewer
    │   ├── ResourceLibrary.tsx # Filterable resource library
    │   ├── ProgressAnalytics.tsx# Charts & analytics views
    │   ├── AIMentorChat.tsx    # AI mentor chat interface
    │   ├── UserProfile.tsx     # Scholar profile card
    │   └── AdminPanel.tsx      # Faculty admin dashboard
    └── config/
```

---

## 🏗 Building for Production

```bash
# Build the frontend (Vite) + bundle the server (esbuild)
npm run build

# Start the production server
npm start
```

The production server serves compiled assets from `dist/` on port **3000**.

### Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Start development server (HMR + API) |
| `npm run build` | Build frontend + bundle server |
| `npm run start` | Start production server |
| `npm run preview` | Preview Vite build |
| `npm run lint` | Run TypeScript type checking |
| `npm run clean` | Remove build artifacts |

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <br />
  <p><strong>Built with ❤️ for lifelong learners</strong></p>
  <p><em>Chronicle Academy • Established 2026</em></p>
  <br />
</div>"# -AI_Powered_Personalized_Learning_Path_Generator" 
