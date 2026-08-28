/**
 * MSC Website — Cloudflare D1 Database Module
 *
 * Server-side only. Never import this in client components.
 * Uses wrangler CLI for local development and REST API for production.
 */

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
// Configuration
// ---------------------------------------------------------------------------

function getConfig() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;

  if (!accountId || !apiToken || !databaseId) {
    throw new Error(
      "Missing Cloudflare D1 environment variables. " +
        "Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, and CLOUDFLARE_D1_DATABASE_ID."
    );
  }

  return { accountId, apiToken, databaseId };
}

// ---------------------------------------------------------------------------
// REST API Client (production)
// ---------------------------------------------------------------------------

interface D1Response<T = unknown> {
  result?: { results?: T[]; success: boolean; meta?: { changed_db?: boolean } };
  errors: Array<{ code: number; message: string }>;
  success: boolean;
}

async function executeSql<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const { accountId, apiToken, databaseId } = getConfig();

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`D1 API request failed (${response.status}): ${text}`);
  }

  const data: D1Response<T> = await response.json();

  if (!data.success) {
    const errorMessages = data.errors.map((e) => e.message).join("; ");
    throw new Error(`D1 query failed: ${errorMessages}`);
  }

  return data.result?.results ?? [];
}

// ---------------------------------------------------------------------------
// Public API — Contact Submissions
// ---------------------------------------------------------------------------

export async function insertContactSubmission(
  submission: InsertContactSubmission
): Promise<ContactSubmission> {
  const id = crypto.randomUUID();

  const results = await executeSql<ContactSubmission>(
    `INSERT INTO contact_submissions (id, name, email, company, service, message)
     VALUES (?, ?, ?, ?, ?, ?)
     RETURNING *`,
    [
      id,
      submission.name,
      submission.email,
      submission.company ?? null,
      submission.service,
      submission.message,
    ]
  );

  return results[0];
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  return executeSql<ContactSubmission>(
    `SELECT * FROM contact_submissions ORDER BY created_at DESC`
  );
}

export async function getContactSubmissionById(
  id: string
): Promise<ContactSubmission | null> {
  const results = await executeSql<ContactSubmission>(
    `SELECT * FROM contact_submissions WHERE id = ?`,
    [id]
  );

  return results[0] ?? null;
}

// ---------------------------------------------------------------------------
// Migration helper — run SQL file
// (Used via `npm run db:migrate` which calls wrangler CLI)
// ---------------------------------------------------------------------------

/**
 * Executes raw SQL against D1. Intended for migration scripts only.
 * In production this is restricted to server-side code paths.
 */
export async function executeMigration(sql: string): Promise<void> {
  const { accountId, apiToken, databaseId } = getConfig();

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`D1 migration failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  if (!data.success) {
    const errorMessages = data.errors
      .map((e: { message: string }) => e.message)
      .join("; ");
    throw new Error(`D1 migration failed: ${errorMessages}`);
  }
}
