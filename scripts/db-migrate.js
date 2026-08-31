#!/usr/bin/env node
/**
 * MSC Website — Neon PostgreSQL Migration Runner
 *
 * Reads .sql files from db/migrations/ and executes them in order.
 * Requires DATABASE_URL environment variable.
 *
 * Usage: node scripts/db-migrate.js
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ Missing DATABASE_URL environment variable.");
    console.error("   Set DATABASE_URL to your Neon connection string.");
    process.exit(1);
  }

  const migrationsDir = resolve("db/migrations");

  let files;
  try {
    files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();
  } catch {
    console.error(`❌ No migrations directory found at ${migrationsDir}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log("⚠️  No migration files found.");
    return;
  }

  console.log("🔧 MSC Website — Neon PostgreSQL Migration");
  console.log("===========================================\n");

  const sql = neon(databaseUrl);

  for (const file of files) {
    const filePath = join(migrationsDir, file);
    const sqlContent = readFileSync(filePath, "utf-8");

    console.log(`📄 Running: ${file}`);
    try {
      await sql(sqlContent);
      console.log("   ✅ Done\n");
    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}`);
      process.exit(1);
    }
  }

  console.log("🎉 All migrations complete!");
}

main();
