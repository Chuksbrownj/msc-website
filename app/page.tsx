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
    <main className="min-h-screen bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
      <Navbar />
      <Hero />
      <Services />
      <Solutions />
      <Process />
      <Technologies />
      <About />
      <CTA />
      <Contact />
      <Footer />
    </main>
  );
}
