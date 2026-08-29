import {
  Navbar,
  Hero,
  Services,
  Solutions,
  Process,
  Technologies,
  About,
  CTA,
  Contact,
  Footer,
} from "@/components";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
      {/* Skip to content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--color-accent-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-primary)]"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Services />
        <Solutions />
        <Process />
        <Technologies />
        <About />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
