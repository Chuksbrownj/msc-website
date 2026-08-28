import { SERVICES } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { ServiceIcon } from "@/components/ServiceIcon";

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
            What We Do
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Engineering Solutions for Real Problems
          </h2>
          <p className="mt-4 text-lg text-[var(--color-muted)]">
            End-to-end software solutions tailored to your business — from
            concept to deployment.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="group rounded-xl border border-[var(--color-border)] p-6 transition-colors hover:border-[var(--color-accent)]/40"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] transition-colors group-hover:bg-[var(--color-accent)]/20">
                <ServiceIcon icon={service.icon} />
              </div>
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
