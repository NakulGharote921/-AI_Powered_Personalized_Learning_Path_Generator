/**
 * Firebase Realtime Database Service (Server-side)
 *
 * Replaces the file-based db_store.json with Firebase RTDB.
 * Provides getDB() / writeDB() interfaces that match the old pattern
 * but operate against Firebase Realtime Database.
 *
 * RTDB Structure:
 *   /users/{id}            - User profiles
 *   /skills/{id}           - Skills catalog
 *   /user_skills/{id}      - User-Skill relationships
 *   /learning_paths/{id}   - Learning paths
 *   /modules/{id}          - Course modules
 *   /resources/{id}        - Module resources
 *   /progress/{id}         - User module progress
 *   /messages/{id}         - Chat messages
 */
import { getAdminDatabase } from "../config/firebase-admin";
import type { Database } from "firebase-admin/database";

// ============================================================================
// Types (matching the db_store.json structure)
// ============================================================================

interface DBUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  password?: string;
  experience_level?: string;
  career_goals?: string;
  interests?: string;
  learning_preferences?: string;
  weekly_hours?: number;
}

interface DBSkill {
  id: string;
  skill_name: string;
  category: string;
}

interface DBUserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency: string;
}

interface DBLearningPath {
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

interface DBModule {
  id: string;
  learning_path_id: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_time: string;
  sort_order: number;
  milestone: string;
}

interface DBResource {
  id: string;
  module_id: string;
  title: string;
  type: string;
  url: string;
}

interface DBProgress {
  id: string;
  user_id: string;
  module_id: string;
  status: string;
  completion_percentage: number;
  quiz_score?: number;
}

interface DBMessage {
  id: string;
  user_id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export interface DatabaseStructure {
  users: DBUser[];
  skills: DBSkill[];
  user_skills: DBUserSkill[];
  learning_paths: DBLearningPath[];
  modules: DBModule[];
  resources: DBResource[];
  progress: DBProgress[];
  messages: DBMessage[];
}

// ============================================================================
// Helper: Convert Firebase RTDB object to array
// ============================================================================

function snapshotToArray<T>(
  data: Record<string, any> | null | undefined
): any[] {
  if (!data) return [];
  return Object.keys(data).map((key) => ({
    ...data[key],
    id: data[key].id || key,
  }));
}

// ============================================================================
// Helper: Convert array to Firebase RTDB object (keyed by id or push key)
// ============================================================================

function arrayToObject(arr: any[]): Record<string, any> {
  const obj: Record<string, any> = {};
  for (const item of arr) {
    obj[item.id] = item;
  }
  return obj;
}

// ============================================================================
// Core Database Operations
// ============================================================================

let db: Database | null = null;

function getDb(): Database {
  if (!db) {
    db = getAdminDatabase();
  }
  return db;
}

/**
 * Get the entire database structure (replaces old getDB() for file-based storage).
 * Reads all top-level collections from Firebase RTDB in parallel.
 */
export async function getDB(): Promise<DatabaseStructure> {
  const database = getDb();

  try {
    const [
      usersSnap,
      skillsSnap,
      userSkillsSnap,
      learningPathsSnap,
      modulesSnap,
      resourcesSnap,
      progressSnap,
      messagesSnap,
    ] = await Promise.all([
      database.ref("users").once("value"),
      database.ref("skills").once("value"),
      database.ref("user_skills").once("value"),
      database.ref("learning_paths").once("value"),
      database.ref("modules").once("value"),
      database.ref("resources").once("value"),
      database.ref("progress").once("value"),
      database.ref("messages").once("value"),
    ]);

    return {
      users: snapshotToArray<DBUser>(usersSnap.val()),
      skills: snapshotToArray<DBSkill>(skillsSnap.val()),
      user_skills: snapshotToArray<DBUserSkill>(userSkillsSnap.val()),
      learning_paths: snapshotToArray<DBLearningPath>(learningPathsSnap.val()),
      modules: snapshotToArray<DBModule>(modulesSnap.val()),
      resources: snapshotToArray<DBResource>(resourcesSnap.val()),
      progress: snapshotToArray<DBProgress>(progressSnap.val()),
      messages: snapshotToArray<DBMessage>(messagesSnap.val()),
    };
  } catch (error) {
    console.error("[FirebaseDB] Error reading database:", error);
    throw error;
  }
}

/**
 * Write the entire database structure back to Firebase RTDB.
 * Used as a drop-in replacement for the old writeDB() file-based write.
 *
 * NOTE: This performs a batch write using the root ref to maintain atomicity.
 */
export async function writeDB(data: DatabaseStructure): Promise<void> {
  const database = getDb();

  try {
    const updates: Record<string, any> = {
      users: arrayToObject(data.users),
      skills: arrayToObject(data.skills),
      user_skills: arrayToObject(data.user_skills),
      learning_paths: arrayToObject(data.learning_paths),
      modules: arrayToObject(data.modules),
      resources: arrayToObject(data.resources),
      progress: arrayToObject(data.progress),
      messages: arrayToObject(data.messages),
    };

    await database.ref("/").update(updates);
  } catch (error) {
    console.error("[FirebaseDB] Error writing database:", error);
    throw error;
  }
}

// ============================================================================
// Granular Operations (More Efficient Alternatives)
// ============================================================================

/**
 * Get a single collection from the database.
 */
export async function getCollection<K extends keyof DatabaseStructure>(
  collection: K
): Promise<DatabaseStructure[K]> {
  const database = getDb();
  const snapshot = await database.ref(collection).once("value");
  return snapshotToArray<any>(snapshot.val()) as DatabaseStructure[K];
}

/**
 * Get a single record by ID from a collection.
 */
export async function getRecord<K extends keyof DatabaseStructure>(
  collection: K,
  id: string
): Promise<any | null> {
  const database = getDb();
  const snapshot = await database.ref(`${collection}/${id}`).once("value");
  return snapshot.exists() ? snapshot.val() : null;
}

/**
 * Add a record to a collection (uses push to generate unique key if no ID provided).
 */
export async function addRecord<K extends keyof DatabaseStructure>(
  collection: K,
  record: any
): Promise<string> {
  const database = getDb();
  if (record.id) {
    await database.ref(`${collection}/${record.id}`).set(record);
    return record.id;
  } else {
    const ref = database.ref(collection).push();
    await ref.set(record);
    return ref.key || "";
  }
}

/**
 * Update a record in a collection.
 */
export async function updateRecord<K extends keyof DatabaseStructure>(
  collection: K,
  id: string,
  data: Partial<any>
): Promise<void> {
  const database = getDb();
  await database.ref(`${collection}/${id}`).update(data);
}

/**
 * Delete a record from a collection.
 */
export async function removeRecord<K extends keyof DatabaseStructure>(
  collection: K,
  id: string
): Promise<void> {
  const database = getDb();
  await database.ref(`${collection}/${id}`).remove();
}

/**
 * Query records in a collection by a child field.
 */
export async function queryByField<K extends keyof DatabaseStructure>(
  collection: K,
  field: string,
  value: any
): Promise<any[]> {
  const database = getDb();
  const snapshot = await database
    .ref(collection)
    .orderByChild(field)
    .equalTo(value)
    .once("value");
  return snapshotToArray(snapshot.val());
}

// ============================================================================
// Initial Seed Data (for Firebase RTDB initialization)
// ============================================================================

export function getInitialSeedData(): DatabaseStructure {
  return {
    users: [
      {
        id: "admin_user",
        name: "Elizabeth Parker",
        email: "nakulgharote@gmail.com",
        role: "admin",
        created_at: new Date().toISOString(),
        password: "password123",
      },
      {
        id: "sample_student",
        name: "James Sterling",
        email: "student@learning.edu",
        role: "student",
        created_at: new Date().toISOString(),
        password: "password123",
      },
    ],
    skills: [
      { id: "s1", skill_name: "React.js", category: "Frontend Development" },
      { id: "s2", skill_name: "TypeScript", category: "Programming Languages" },
      { id: "s3", skill_name: "CSS Grid & Tailwind", category: "Frontend Design" },
      { id: "s4", skill_name: "Node.js & Express", category: "Backend Development" },
      { id: "s5", skill_name: "PostgreSQL & SQL", category: "Databases" },
      { id: "s6", skill_name: "Python & FastAPI", category: "Backend Development" },
      { id: "s7", skill_name: "Domain-Driven Design", category: "Software Architecture" },
      { id: "s8", skill_name: "Docker & Containerization", category: "DevOps" },
    ],
    user_skills: [
      { id: "us_1", user_id: "sample_student", skill_id: "s1", proficiency: "Beginner" },
      { id: "us_2", user_id: "sample_student", skill_id: "s2", proficiency: "Beginner" },
      { id: "us_3", user_id: "sample_student", skill_id: "s6", proficiency: "Intermediate" },
    ],
    learning_paths: [
      {
        id: "p1",
        user_id: "sample_student",
        title: "Production-Grade Python APIs with FastAPI & React",
        goal: "Become an elite Full-Stack developer engineering Clean Python backends and modular React frontends",
        duration: "12 Weeks",
        created_at: new Date().toISOString(),
        is_active: true,
        skill_gaps: [
          "Domain-Driven Design (DDD) Boundaries",
          "Clean APIs with FastAPI & Pytest",
          "Relational Database Performance Indexes & Postgres",
        ],
      },
    ],
    modules: [
      {
        id: "m1",
        learning_path_id: "p1",
        title: "Stage 1: Production-Grade Python APIs with FastAPI & Clean Architecture Foundations",
        description:
          "This introduces concepts systematically to cover basic gaps before integrating them into React components in later phases.",
        difficulty: "Intermediate",
        estimated_time: "38 hours",
        sort_order: 1,
        milestone:
          "Finish this module with a robust, working CRUD application that interfaces seamlessly with clean data models and local PostgreSQL instances.",
      },
      {
        id: "m2",
        learning_path_id: "p1",
        title: "Stage 2: Full-Stack React.js & Tailwind CSS Integration",
        description:
          "Establish strong foundations in building client interfaces, connecting React dashboard layouts, using Tailwind CSS.",
        difficulty: "Intermediate",
        estimated_time: "25 hours",
        sort_order: 2,
        milestone:
          "Integrate the FastAPI CRUD backend cleanly with custom React dashboard layouts, using Tailwind CSS and Vite.",
      },
      {
        id: "m3",
        learning_path_id: "p1",
        title: "Stage 3: Advanced Optimization & Enterprise Security Abstractions",
        description:
          "Deep dive into generics, CORS secure middleware proxies, relational index performance testing, token validations.",
        difficulty: "Advanced",
        estimated_time: "35 hours",
        sort_order: 3,
        milestone: "Deploy high-throughput multi-role asset hubs and execute microservices with Docker containerization.",
      },
    ],
    resources: [
      { id: "r1", module_id: "m1", title: "Fastapi Official Guidelines & Code-Driven Tutorials", type: "Documentation", url: "https://fastapi.tiangolo.com/" },
      { id: "r2", module_id: "m1", title: "Clean Architecture in Python Guides", type: "Article", url: "https://books.google.com" },
      { id: "r3", module_id: "m2", title: "React & Tailwind CSS Layout Grid Mastery", type: "Documentation", url: "https://tailwindcss.com" },
      { id: "r4", module_id: "m3", title: "Docker Execution & Container Isolation Docs", type: "Code", url: "https://docs.docker.com/" },
    ],
    progress: [
      { id: "pr1", user_id: "sample_student", module_id: "m1", status: "in_progress", completion_percentage: 45 },
      { id: "pr2", user_id: "sample_student", module_id: "m2", status: "not_started", completion_percentage: 0 },
      { id: "pr3", user_id: "sample_student", module_id: "m3", status: "not_started", completion_percentage: 0 },
    ],
    messages: [
      {
        id: "msg_init",
        user_id: "sample_student",
        sender: "mentor",
        text: "Greetings, scholars! I am your AI Mentor, Barnaby Sterling. Tell me what subject or career roadblock you are currently facing in our backend Python or frontend React architectures, and we will dissect it together with precise methodology.",
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

/**
 * Seed the Firebase RTDB with initial data (only if the database is empty).
 */
export async function seedDatabaseIfEmpty(): Promise<boolean> {
  const database = getDb();
  const rootSnap = await database.ref("/").once("value");

  if (rootSnap.exists()) {
    console.log("[FirebaseDB] Database already contains data. Skipping seed.");
    return false;
  }

  const seedData = getInitialSeedData();
  await writeDB(seedData);
  console.log("[FirebaseDB] Database seeded with initial data successfully.");
  return true;
}