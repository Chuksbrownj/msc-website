import { SOLUTIONS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";

export function Solutions() {
  return (
    <section
      id="solutions"
      className="border-y border-[var(--color-border)] bg-[var(--color-secondary)] py-20 md:py-28"
    >
      <Container>
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
            What We Solve
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Business Problems We Take On
          </h2>
          <p className="mt-4 text-lg text-[var(--color-muted)]">
            We build software that solves the problems holding your business
            back.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((solution, index) => (
            <article
              key={solution.title}
              className="group rounded-xl border border-[var(--color-border)] p-6 transition-colors hover:border-[var(--color-accent)]/40"
            >
              <span className="mb-3 inline-block text-sm font-semibold text-[var(--color-accent)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold">{solution.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                {solution.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
