import Link from "next/link";
import { getContactSubmissions } from "@/lib/db";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let submissions: Awaited<ReturnType<typeof getContactSubmissions>> = [];
  let error: string | null = null;

  try {
    submissions = await getContactSubmissions();
  } catch (err) {
    console.error("Failed to fetch submissions:", err);
    error = "Failed to load submissions. Check database connection.";
  }

  return (
    <main className="min-h-screen bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
      <Container>
        <div className="py-10 md:py-16">
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Contact Submissions
              </h1>
              <p className="mt-1 text-[var(--color-muted)]">
                {error
                  ? "Error loading data"
                  : `${submissions.length} total inquiries`}
              </p>
            </div>
            <Link
              href="/"
              className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary-foreground)]"
            >
              ← Back to Site
            </Link>
          </div>

          {/* Error state */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!error && submissions.length === 0 && (
            <div className="rounded-xl border border-[var(--color-border)] p-12 text-center">
              <p className="text-lg text-[var(--color-muted)]">
                No submissions yet.
              </p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Submissions from the contact form will appear here.
              </p>
            </div>
          )}

          {/* Submissions list */}
          {!error && submissions.length > 0 && (
            <div className="space-y-4">
              {submissions.map((sub) => (
                <article
                  key={sub.id}
                  className="rounded-xl border border-[var(--color-border)] p-6 transition-colors hover:border-[var(--color-accent)]/30"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-semibold">{sub.name}</h2>
                        <span className="rounded-full bg-[var(--color-accent)]/10 px-3 py-0.5 text-xs font-medium text-[var(--color-accent)]">
                          {sub.service}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--color-muted)]">
                        <a
                          href={`mailto:${sub.email}`}
                          className="transition-colors hover:text-[var(--color-accent)]"
                        >
                          {sub.email}
                        </a>
                        {sub.company && <span>{sub.company}</span>}
                      </div>
                    </div>
                    <time
                      dateTime={sub.created_at}
                      className="whitespace-nowrap text-xs text-[var(--color-muted)]"
                    >
                      {new Date(sub.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-muted)]">
                    {sub.message}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
