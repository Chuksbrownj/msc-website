/**
 * MSC Website — POST /api/contact
 *
 * Accepts contact/project inquiry submissions.
 * Validates with Zod, stores in Neon PostgreSQL.
 * Rate-limited, honeypot-protected, timing-checked.
 * Server-side only — no secrets exposed to browser.
 */

import { NextResponse } from "next/server";
import { contactSubmissionSchema } from "@/lib/validation";
import { insertContactSubmission, getContactSubmissions } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Maximum request body size: 64KB
const MAX_BODY_SIZE = 64 * 1024;

// Minimum time (ms) a human needs to fill out the form
const MIN_SUBMIT_TIME_MS = 3000;

export async function POST(request: Request) {
  try {
    // Validate content type
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, message: "Content-Type must be application/json." },
        { status: 415 }
      );
    }

    // Check content length before parsing
    const contentLength = parseInt(
      request.headers.get("content-length") || "0",
      10
    );
    if (contentLength > MAX_BODY_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Request body too large. Maximum size is 64KB.",
        },
        { status: 413 }
      );
    }

    // --- Rate limiting ---
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)),
          },
        }
      );
    }

    // Parse JSON body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    // --- Honeypot check (server-side) ---
    // If the hidden field is filled, it's a bot — silently reject
    if (body._hp) {
      return NextResponse.json(
        { success: true, message: "Your inquiry has been received." },
        { status: 201 }
      );
    }

    // --- Timing check (server-side) ---
    const submitTime = typeof body._ts === "number" ? body._ts : 0;
    const elapsed = submitTime > 0 ? Date.now() - submitTime : Infinity;
    if (elapsed < MIN_SUBMIT_TIME_MS && elapsed >= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please take a moment to fill out the form.",
        },
        { status: 400 }
      );
    }

    // --- Validate with Zod ---
    // Strip honeypot/timing fields before validation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _hp, _ts, ...submissionData } = body;
    const result = contactSubmissionSchema.safeParse(submissionData);
    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          message: firstError?.message || "Validation failed.",
        },
        { status: 400 }
      );
    }

    // --- Insert into database ---
    await insertContactSubmission(result.data);

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been received.",
      },
      { status: 201 }
    );
  } catch (error) {
    // Log server-side only, never expose to client
    console.error("Contact form submission error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const submissions = await getContactSubmissions();
    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve submissions." },
      { status: 500 }
    );
  }
}

// Reject unsupported HTTP methods
export async function PUT() {
  return NextResponse.json(
    { success: false, message: "Method not allowed." },
    { status: 405, headers: { Allow: "GET, POST" } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: "Method not allowed." },
    { status: 405, headers: { Allow: "GET, POST" } }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { success: false, message: "Method not allowed." },
    { status: 405, headers: { Allow: "GET, POST" } }
  );
}
