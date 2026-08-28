import { TECHNOLOGIES } from "@/lib/constants";
import { Container } from "@/components/ui/Container";

export function Technologies() {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-secondary)] py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
            Our Toolkit
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Technologies We Work With
          </h2>
          <p className="mt-4 text-lg text-[var(--color-muted)]">
            We choose the right tools for the job. These are the technologies
            we&apos;re experienced with — not a checklist of everything we&apos;ve
            ever touched.
          </p>
        </div>
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {TECHNOLOGIES.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
