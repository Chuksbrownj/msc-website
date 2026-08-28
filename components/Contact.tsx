"use client";

import { useState, useRef } from "react";
import { SERVICES } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

// Minimum time (ms) a human needs to fill out the form
const MIN_SUBMIT_TIME_MS = 3000;

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formLoadTime = useRef(Date.now());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // --- Honeypot check (client-side, silently reject) ---
    const honeypot = String(formData.get("website_url") || "");
    if (honeypot) {
      // Bot filled the hidden field — fake success to waste their time
      setSubmitted(true);
      form.reset();
      setIsSubmitting(false);
      return;
    }

    // --- Timing check ---
    const elapsed = Date.now() - formLoadTime.current;
    if (elapsed < MIN_SUBMIT_TIME_MS) {
      setError("Please take a moment to fill out the form.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      company: String(formData.get("company") || "").trim() || undefined,
      service: String(formData.get("service") || "").trim(),
      message: String(formData.get("description") || "").trim(),
      // Honeypot + timing sent to server for server-side verification
      _hp: honeypot,
      _ts: formLoadTime.current,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      form.reset();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
              Get in Touch
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Start a Conversation
            </h2>
            <p className="mt-4 text-lg text-[var(--color-muted)]">
              Tell us about your project. We&apos;ll get back to you within 24
              hours.
            </p>
          </div>

          {submitted ? (
            <div className="animate-fade-in rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-8 text-center">
              <div className="mb-4 text-4xl">✓</div>
              <h3 className="text-xl font-semibold">Inquiry Sent</h3>
              <p className="mt-2 text-[var(--color-muted)]">
                Thank you for reaching out. We&apos;ll review your message and
                get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  {error}
                </div>
              )}

              {/* Honeypot field — hidden from real users, bots will fill it */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  opacity: 0,
                  height: 0,
                  width: 0,
                  overflow: "hidden",
                  pointerEvents: "none",
                }}
              >
                <label htmlFor="website_url">Leave this empty</label>
                <input
                  type="text"
                  id="website_url"
                  name="website_url"
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Name <span className="text-[var(--color-accent)]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    maxLength={100}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Email <span className="text-[var(--color-accent)]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    maxLength={254}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="company"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  maxLength={150}
                  placeholder="Company name (optional)"
                  autoComplete="organization"
                />
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Service <span className="text-[var(--color-accent)]">*</span>
                </label>
                <select id="service" name="service" required defaultValue="">
                  <option value="" disabled>
                    Select a service
                  </option>
                  {SERVICES.map((service) => (
                    <option key={service.title} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Project Description{" "}
                  <span className="text-[var(--color-accent)]">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  maxLength={3000}
                  placeholder="Tell us about your project, goals, and timeline..."
                />
              </div>

              {/* Privacy notice */}
              <p className="text-xs leading-relaxed text-[var(--color-muted)]">
                By submitting this form, you agree that MSC may use the
                information provided to respond to your inquiry.
              </p>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Inquiry"}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
