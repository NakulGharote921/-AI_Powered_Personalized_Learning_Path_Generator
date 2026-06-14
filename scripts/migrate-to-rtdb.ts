/**
 * Migration Script: db_store.json → Firebase Realtime Database
 *
 * Reads the existing db_store.json file and uploads all data to Firebase RTDB.
 * Run with: npx tsx scripts/migrate-to-rtdb.ts
 *
 * Prerequisites:
 *   1. Firebase Admin SDK service-account.json in project root
 *   2. VITE_FIREBASE_DATABASE_URL set in .env
 */
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

import { initializeFirebaseAdmin } from "../src/config/firebase-admin";

const DB_FILE = path.join(process.cwd(), "db_store.json");

async function migrate() {
  console.log("=".repeat(60));
  console.log("  Firebase RTDB Migration Tool");
  console.log("  Migrating db_store.json → Firebase Realtime Database");
  console.log("=".repeat(60));

  // Step 1: Read existing db_store.json
  if (!fs.existsSync(DB_FILE)) {
    console.error("ERROR: db_store.json not found at:", DB_FILE);
    process.exit(1);
  }

  let dbData: any;
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    dbData = JSON.parse(raw);
    console.log(`\n✓ Read db_store.json successfully`);
  } catch (err) {
    console.error("ERROR: Failed to parse db_store.json:", err);
    process.exit(1);
  }

  // Validate data structure
  const requiredSections = ["users", "skills", "learning_paths", "modules", "resources", "progress", "messages"];
  for (const section of requiredSections) {
    if (!Array.isArray(dbData[section])) {
      console.error(`ERROR: Missing or invalid section "${section}" in db_store.json`);
      process.exit(1);
    }
  }

  console.log(`\nData summary:`);
  console.log(`  users:          ${dbData.users.length} records`);
  console.log(`  skills:         ${dbData.skills.length} records`);
  console.log(`  user_skills:    ${(dbData.user_skills || []).length} records`);
  console.log(`  learning_paths: ${dbData.learning_paths.length} records`);
  console.log(`  modules:        ${dbData.modules.length} records`);
  console.log(`  resources:      ${dbData.resources.length} records`);
  console.log(`  progress:       ${dbData.progress.length} records`);
  console.log(`  messages:       ${dbData.messages.length} records`);

  // Step 2: Initialize Firebase Admin
  console.log("\nConnecting to Firebase Realtime Database...");
  const database = initializeFirebaseAdmin();

  // Step 3: Convert arrays to RTDB-compatible objects (keyed by id)
  function arrayToObject(arr: any[]): Record<string, any> {
    const obj: Record<string, any> = {};
    for (const item of arr) {
      // For user_skills that may not have IDs, generate one
      if (!item.id) {
        item.id = `${item.user_id}_${item.skill_id}`;
      }
      obj[item.id] = item;
    }
    return obj;
  }

  const updates: Record<string, any> = {
    users: arrayToObject(dbData.users),
    skills: arrayToObject(dbData.skills),
    user_skills: arrayToObject(dbData.user_skills || []),
    learning_paths: arrayToObject(dbData.learning_paths),
    modules: arrayToObject(dbData.modules),
    resources: arrayToObject(dbData.resources),
    progress: arrayToObject(dbData.progress),
    messages: arrayToObject(dbData.messages),
  };

  // Step 4: Write to Firebase RTDB
  console.log("\nUploading data to Firebase RTDB...");

  try {
    await database.ref("/").update(updates);
    console.log("✓ All data uploaded successfully!");
  } catch (err) {
    console.error("ERROR: Failed to upload data:", err);
    process.exit(1);
  }

  // Step 5: Verify the upload
  console.log("\nVerifying upload...");
  const rootSnap = await database.ref("/").once("value");
  const counts = rootSnap.val();
  
  for (const section of requiredSections) {
    const count = counts[section] ? Object.keys(counts[section]).length : 0;
    const expected = dbData[section].length;
    if (count === expected) {
      console.log(`  ✓ ${section}: ${count} records (matches source)`);
    } else {
      console.log(`  ⚠ ${section}: ${count} records (expected ${expected})`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("  Migration completed successfully!");
  console.log("  Your app now uses Firebase Realtime Database.");
  console.log("  You can keep db_store.json as a backup.");
  console.log("=".repeat(60));
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});