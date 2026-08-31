/**
 * MSC Website — Neon PostgreSQL Database Module
 *
 * Server-side only. Never import this in client components.
 * Uses @neondatabase/serverless for serverless-friendly HTTP queries.
 */

import { neon } from "@neondatabase/serverless";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string;
  message: string;
  created_at: string;
}

export interface InsertContactSubmission {
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Database Client
// ---------------------------------------------------------------------------

function getSql() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "Missing DATABASE_URL environment variable. " +
        "Set DATABASE_URL to your Neon connection string."
    );
  }

  return neon(databaseUrl);
}

// ---------------------------------------------------------------------------
// Public API — Contact Submissions
// ---------------------------------------------------------------------------

export async function insertContactSubmission(
  submission: InsertContactSubmission
): Promise<ContactSubmission> {
  const sql = getSql();

  const rows = await sql(
    `INSERT INTO contact_submissions (name, email, company, service, message)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      submission.name,
      submission.email,
      submission.company ?? null,
      submission.service,
      submission.message,
    ]
  );

  return rows[0] as ContactSubmission;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const sql = getSql();

  const rows = await sql(
    `SELECT * FROM contact_submissions ORDER BY created_at DESC`
  );

  return rows as ContactSubmission[];
}

export async function getContactSubmissionById(
  id: string
): Promise<ContactSubmission | null> {
  const sql = getSql();

  const rows = await sql(
    `SELECT * FROM contact_submissions WHERE id = $1`,
    [id]
  );

  return (rows[0] as ContactSubmission) ?? null;
}

// ---------------------------------------------------------------------------
// Migration helper — run SQL file
// ---------------------------------------------------------------------------

/**
 * Executes raw SQL against Neon. Intended for migration scripts only.
 * In production this is restricted to server-side code paths.
 */
export async function executeMigration(query: string): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL environment variable.");
  }

  const sql = neon(databaseUrl);
  await sql(query);
}
