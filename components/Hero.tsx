import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-[90vh] items-center pt-20 md:pt-0"
    >
      <Container>
        <div className="max-w-3xl animate-fade-in-up">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
            Software Engineering &middot; AI &middot; Automation &middot; Data
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            We Build Software That Moves Businesses Forward.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)] sm:text-xl">
            MSC engineers scalable software, AI-powered solutions, automated
            workflows, and data-driven systems that help businesses operate
            smarter.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="#contact" variant="primary" size="lg">
              Start a Project
            </Button>
            <Button href="#services" variant="outline" size="lg">
              Explore Our Services
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
