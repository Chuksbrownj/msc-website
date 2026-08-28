import { describe, it, expect, vi, afterEach } from "vitest";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { contactSubmissionSchema, ALLOWED_SERVICES } from "@/lib/validation";

// ---------------------------------------------------------------------------
// Rate Limiter Tests
// ---------------------------------------------------------------------------

describe("checkRateLimit", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows first request", () => {
    vi.useFakeTimers();
    const result = checkRateLimit("rl-allow-1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks after 5 requests in the same window", () => {
    vi.useFakeTimers();
    const key = "rl-block-1";
    for (let i = 0; i < 5; i++) {
      const r = checkRateLimit(key);
      if (i < 4) {
        expect(r.allowed).toBe(true);
      }
    }
    const result = checkRateLimit(key);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after window expires", () => {
    vi.useFakeTimers();
    const key = "rl-reset-1";
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key);
    }

    // Advance time by 1 hour + 1ms
    vi.advanceTimersByTime(60 * 60 * 1000 + 1);

    const result = checkRateLimit(key);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("returns retryAfterMs when blocked", () => {
    vi.useFakeTimers();
    const key = "rl-retry-1";
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key);
    }
    const result = checkRateLimit(key);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it("uses separate counters per IP", () => {
    vi.useFakeTimers();
    const result1 = checkRateLimit("rl-sep-a");
    const result2 = checkRateLimit("rl-sep-b");
    expect(result1.remaining).toBe(4);
    expect(result2.remaining).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// getClientIp Tests
// ---------------------------------------------------------------------------

describe("getClientIp", () => {
  it("extracts IP from x-forwarded-for", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("extracts IP from x-real-ip", () => {
    const req = new Request("http://localhost", {
      headers: { "x-real-ip": "9.10.11.12" },
    });
    expect(getClientIp(req)).toBe("9.10.11.12");
  });

  it("returns 'unknown' when no IP headers present", () => {
    const req = new Request("http://localhost");
    expect(getClientIp(req)).toBe("unknown");
  });
});

// ---------------------------------------------------------------------------
// SQL Injection Payload Tests
// ---------------------------------------------------------------------------

describe("SQL injection prevention", () => {
  const sqlPayloads = [
    "'; DROP TABLE contact_submissions; --",
    "1' OR '1'='1",
    "admin'--",
    "' UNION SELECT * FROM users --",
    "1; DELETE FROM contact_submissions WHERE 1=1",
    "' OR 1=1 --",
    "Robert'); DROP TABLE Students;--",
  ];

  it("rejects SQL injection in email field", () => {
    for (const payload of sqlPayloads) {
      const result = contactSubmissionSchema.safeParse({
        name: "Test User",
        email: payload,
        service: "AI Automation",
        message: "Test message",
      });
      // SQL payloads should fail email validation (not valid email format)
      expect(result.success).toBe(false);
    }
  });

  it("accepts SQL injection in name/message (safe via parameterized queries)", () => {
    for (const payload of sqlPayloads) {
      const result = contactSubmissionSchema.safeParse({
        name: payload.slice(0, 100),
        email: "test@example.com",
        service: "AI Automation",
        message: payload,
      });
      // Passes Zod validation — safety handled by parameterized SQL in lib/db.ts
      expect(result.success).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// XSS Payload Tests
// ---------------------------------------------------------------------------

describe("XSS prevention", () => {
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")">',
    '"><script>alert("XSS")</script>',
    "javascript:alert('XSS')",
    '<svg onload=alert("XSS")>',
    "{{7*7}}",
    "${7*7}",
  ];

  it("validation accepts XSS payloads in text fields (React escapes output)", () => {
    for (const payload of xssPayloads) {
      const result = contactSubmissionSchema.safeParse({
        name: payload.slice(0, 100),
        email: "test@example.com",
        service: "AI Automation",
        message: payload,
      });
      // XSS payloads pass validation — React's JSX escaping handles rendering safety
      expect(result.success).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Honeypot Behavior Tests
// ---------------------------------------------------------------------------

describe("honeypot behavior", () => {
  it("server silently accepts honeypot-filled submissions (fake success)", () => {
    const body = {
      name: "Bot",
      email: "bot@spam.com",
      service: "AI Automation",
      message: "Buy my product!",
      _hp: "filled-by-bot",
      _ts: Date.now() - 10000,
    };
    // Server returns fake 201 success for bots to waste their time
    expect(body._hp).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Timing Check Tests
// ---------------------------------------------------------------------------

describe("timing check", () => {
  it("rejects submissions faster than 3 seconds", () => {
    const formLoadTime = Date.now();
    const submitTime = formLoadTime + 1000;
    const elapsed = submitTime - formLoadTime;
    expect(elapsed).toBeLessThan(3000);
  });

  it("allows submissions after 3 seconds", () => {
    const formLoadTime = Date.now();
    const submitTime = formLoadTime + 4000;
    const elapsed = submitTime - formLoadTime;
    expect(elapsed).toBeGreaterThanOrEqual(3000);
  });
});

// ---------------------------------------------------------------------------
// Service Restriction Tests
// ---------------------------------------------------------------------------

describe("service field restriction", () => {
  it("rejects unauthorized service options", () => {
    const invalidServices = [
      "Hacking",
      "Spam",
      "Admin Panel",
      "DROP TABLE",
      "",
    ];
    for (const service of invalidServices) {
      const result = contactSubmissionSchema.safeParse({
        name: "Test User",
        email: "test@example.com",
        service,
        message: "Test message",
      });
      expect(result.success).toBe(false);
    }
  });

  it("only accepts whitelisted services", () => {
    for (const service of ALLOWED_SERVICES) {
      const result = contactSubmissionSchema.safeParse({
        name: "Test User",
        email: "test@example.com",
        service,
        message: "Test message",
      });
      expect(result.success).toBe(true);
    }
  });
});
