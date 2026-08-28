import { PROCESS_STEPS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";

export function Process() {
  return (
    <section id="process" className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
            How We Work
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            From Idea to Production
          </h2>
          <p className="mt-4 text-lg text-[var(--color-muted)]">
            A clear, structured process that keeps you informed and in control
            every step of the way.
          </p>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step) => (
            <article key={step.title} className="relative">
              <div className="mb-4 text-4xl font-bold text-[var(--color-border)] transition-colors group-hover:text-[var(--color-accent)]/20">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                {step.description}
              </p>
              {/* Connector line on larger screens */}
              {step.step !== "04" && (
                <div className="absolute right-0 top-6 hidden h-px w-8 bg-[var(--color-border)] lg:block" />
              )}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
