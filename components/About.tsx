import { Container } from "@/components/ui/Container";

export function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-10 md:grid-cols-[1fr_1.5fr] md:items-start">
            <div>
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
                About MSC
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Practical Engineering. Real Results.
              </h2>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-[var(--color-muted)]">
              <p>
                MSC is a software engineering company built around a simple idea:
                technology should solve real business problems, not create new
                ones.
              </p>
              <p>
                We specialize in custom software, AI-powered automation,
                workflow optimization, and data-driven systems. Our work spans
                from building internal tools that save teams hours every week to
                deploying AI models that unlock new capabilities.
              </p>
              <p>
                We believe in engineering that&apos;s practical, scalable, and
                built to last — not hype-driven solutions that fall apart after
                the demo.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
