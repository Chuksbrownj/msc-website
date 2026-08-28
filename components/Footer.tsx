import { SITE_CONFIG, NAV_ITEMS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-12 md:py-16">
      <Container>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div>
            <a
              href="#hero"
              className="text-lg font-bold tracking-tight text-[var(--color-primary-foreground)]"
            >
              {SITE_CONFIG.name}
            </a>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
              Software engineering, AI automation, workflow optimization, and
              data-driven systems.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-primary-foreground)]">
              Navigation
            </h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary-foreground)]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--color-primary-foreground)]">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary-foreground)]"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary-foreground)]"
                >
                  Start a Project
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-border)] pt-6">
          <p className="text-center text-sm text-[var(--color-muted)]">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights
            reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
