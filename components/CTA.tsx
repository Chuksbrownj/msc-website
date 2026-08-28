import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-secondary)] py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Have a Problem Worth Solving?
          </h2>
          <p className="mt-4 text-lg text-[var(--color-muted)]">
            Tell MSC what you&apos;re trying to build, automate, or improve.
          </p>
          <div className="mt-8">
            <Button href="#contact" variant="primary" size="lg">
              Start a Conversation
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
