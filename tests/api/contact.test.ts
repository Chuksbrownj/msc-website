import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  contactSubmissionSchema,
  ALLOWED_SERVICES,
} from "@/lib/validation";

// ---------------------------------------------------------------------------
// Validation Schema Tests
// ---------------------------------------------------------------------------

describe("contactSubmissionSchema", () => {
  const validSubmission = {
    name: "John Doe",
    email: "john@example.com",
    company: "Example Ltd",
    service: "AI Automation",
    message: "We need help automating our workflow.",
  };

  it("accepts a valid submission", () => {
    const result = contactSubmissionSchema.safeParse(validSubmission);
    expect(result.success).toBe(true);
  });

  it("accepts submission without company", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      company: undefined,
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty company as undefined", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      company: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.company).toBeUndefined();
    }
  });

  // --- Name validation ---

  it("rejects missing name", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name exceeding 100 characters", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      name: "A".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("accepts name at exactly 100 characters", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      name: "A".repeat(100),
    });
    expect(result.success).toBe(true);
  });

  it("trims whitespace from name", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      name: "  John Doe  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("John Doe");
    }
  });

  // --- Email validation ---

  it("rejects missing email", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      email: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email format", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects email exceeding 254 characters", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      email: `${"a".repeat(243)}@example.com`,
    });
    expect(result.success).toBe(false);
  });

  // --- Service validation ---

  it("rejects missing service", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      service: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid service option", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      service: "Not a real service",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid service options", () => {
    for (const service of ALLOWED_SERVICES) {
      const result = contactSubmissionSchema.safeParse({
        ...validSubmission,
        service,
      });
      expect(result.success).toBe(true);
    }
  });

  // --- Message validation ---

  it("rejects missing message", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      message: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects message exceeding 3000 characters", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      message: "A".repeat(3001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts message at exactly 3000 characters", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      message: "A".repeat(3000),
    });
    expect(result.success).toBe(true);
  });

  // --- Company validation ---

  it("rejects company exceeding 150 characters", () => {
    const result = contactSubmissionSchema.safeParse({
      ...validSubmission,
      company: "A".repeat(151),
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// API Route Tests
// ---------------------------------------------------------------------------

// Use vi.hoisted so the values are available inside vi.mock factories
const { mockInsert, mockGetAll, mockCheckRateLimit } = vi.hoisted(() => ({
  mockInsert: vi.fn().mockResolvedValue({
    id: "test-id-001",
    name: "John Doe",
    email: "john@example.com",
    company: "Example Ltd",
    service: "AI Automation",
    message: "We need help automating our workflow.",
    created_at: "2026-08-28T00:00:00Z",
  }),
  mockGetAll: vi.fn().mockResolvedValue([
    {
      id: "test-id-001",
      name: "John Doe",
      email: "john@example.com",
      company: "Example Ltd",
      service: "AI Automation",
      message: "We need help automating our workflow.",
      created_at: "2026-08-28T00:00:00Z",
    },
  ]),
  mockCheckRateLimit: vi.fn().mockReturnValue({
    allowed: true,
    remaining: 4,
    retryAfterMs: 0,
  }),
}));

vi.mock("@/lib/db", () => ({
  insertContactSubmission: mockInsert,
  getContactSubmissions: mockGetAll,
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: mockCheckRateLimit,
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

import { POST, GET, PUT } from "@/app/api/contact/route";
import {
  insertContactSubmission,
  getContactSubmissions,
} from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

function makeRequest(
  body: unknown,
  headers?: Record<string, string>
): Request {
  return new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-restore default return values after clearAllMocks
    mockInsert.mockResolvedValue({
      id: "test-id-001",
      name: "John Doe",
      email: "john@example.com",
      company: "Example Ltd",
      service: "AI Automation",
      message: "We need help automating our workflow.",
      created_at: "2026-08-28T00:00:00Z",
    });
    mockGetAll.mockResolvedValue([
      {
        id: "test-id-001",
        name: "John Doe",
        email: "john@example.com",
        company: "Example Ltd",
        service: "AI Automation",
        message: "We need help automating our workflow.",
        created_at: "2026-08-28T00:00:00Z",
      },
    ]);
    mockCheckRateLimit.mockReturnValue({
      allowed: true,
      remaining: 4,
      retryAfterMs: 0,
    });
  });

  const validBody = {
    name: "John Doe",
    email: "john@example.com",
    company: "Example Ltd",
    service: "AI Automation",
    message: "We need help automating our workflow.",
    _ts: Date.now() - 10000, // Submitted 10 seconds ago (passes timing check)
  };

  it("returns 201 for valid submission", async () => {
    const res = await POST(makeRequest(validBody));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Your inquiry has been received.");
    expect(insertContactSubmission).toHaveBeenCalledWith(
      expect.objectContaining({ name: "John Doe", email: "john@example.com" })
    );
  });

  it("returns 400 for missing name", async () => {
    const res = await POST(makeRequest({ ...validBody, name: "" }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toBeDefined();
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(
      makeRequest({ ...validBody, email: "not-an-email" })
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("returns 400 for invalid service", async () => {
    const res = await POST(
      makeRequest({ ...validBody, service: "Invalid Service" })
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("returns 400 for oversized message", async () => {
    const res = await POST(
      makeRequest({ ...validBody, message: "A".repeat(3001) })
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("returns 400 for malformed JSON", async () => {
    const req = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not valid json{{{",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it("returns 500 when database fails", async () => {
    mockInsert.mockRejectedValueOnce(new Error("D1 connection failed"));

    const res = await POST(makeRequest(validBody));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toBe(
      "Something went wrong. Please try again later."
    );
    // Ensure no internal details leak
    expect(data.message).not.toContain("D1");
    expect(data.message).not.toContain("connection");
  });

  it("returns 429 when rate limited", async () => {
    mockCheckRateLimit.mockReturnValue({
      allowed: false,
      remaining: 0,
      retryAfterMs: 3600000,
    });

    const res = await POST(makeRequest(validBody));
    const data = await res.json();

    expect(res.status).toBe(429);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Too many requests. Please try again later.");
  });

  it("returns fake 201 for honeypot-filled submissions", async () => {
    const botBody = {
      ...validBody,
      _hp: "filled-by-bot",
    };

    const res = await POST(makeRequest(botBody));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    // Database should NOT be called
    expect(insertContactSubmission).not.toHaveBeenCalled();
  });

  it("returns 400 for submissions too fast (timing check)", async () => {
    const fastBody = {
      name: "Fast Bot",
      email: "bot@spam.com",
      service: "AI Automation",
      message: "Spam message",
      _ts: Date.now() - 1000, // Only 1 second ago
    };

    const res = await POST(makeRequest(fastBody));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Please take a moment to fill out the form.");
  });

  it("returns 405 for unsupported PUT request", async () => {
    const res = await PUT();
    const data = await res.json();

    expect(res.status).toBe(405);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Method not allowed.");
  });

  it("rejects non-JSON content type", async () => {
    const req = makeRequest(validBody, {
      "Content-Type": "text/plain",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(415);
    expect(data.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// GET /api/contact Tests
// ---------------------------------------------------------------------------

describe("GET /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAll.mockResolvedValue([
      {
        id: "test-id-001",
        name: "John Doe",
        email: "john@example.com",
        company: "Example Ltd",
        service: "AI Automation",
        message: "We need help automating our workflow.",
        created_at: "2026-08-28T00:00:00Z",
      },
    ]);
  });

  it("returns 200 with submissions list", async () => {
    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1);
    expect(data.data[0].name).toBe("John Doe");
    expect(getContactSubmissions).toHaveBeenCalled();
  });

  it("returns 500 when database fails", async () => {
    mockGetAll.mockRejectedValueOnce(new Error("D1 connection failed"));

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.message).toBe("Failed to retrieve submissions.");
  });
});
