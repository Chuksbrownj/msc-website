/**
 * MSC Website — Shared utilities and constants.
 */

export const SITE_CONFIG = {
  name: "MSC",
  title: "MSC — Software Engineering & AI Automation",
  description:
    "MSC builds modern software, AI-powered solutions, automated workflows, and data-driven systems for businesses.",
  url: "https://msc.dev",
  email: "hello@msc.dev",
} as const;

export const NAV_ITEMS = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#solutions" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const SERVICES = [
  {
    title: "Software Engineering",
    description:
      "Custom-built software solutions engineered for performance, scalability, and long-term maintainability.",
    icon: "code" as const,
  },
  {
    title: "AI Automation",
    description:
      "Intelligent systems powered by machine learning and AI that reduce manual work and unlock new capabilities.",
    icon: "brain" as const,
  },
  {
    title: "Workflow Automation",
    description:
      "Streamline operations by automating repetitive processes, approvals, and cross-system data flows.",
    icon: "workflow" as const,
  },
  {
    title: "Data Analysis",
    description:
      "Transform raw data into actionable insights through analytics, dashboards, and reporting systems.",
    icon: "chart" as const,
  },
  {
    title: "API & System Integration",
    description:
      "Seamlessly connect your tools, platforms, and third-party services through robust APIs and integrations.",
    icon: "connect" as const,
  },
  {
    title: "Custom Software",
    description:
      "Tailored applications built from the ground up to solve your unique business challenges.",
    icon: "gear" as const,
  },
] as const;

export const SOLUTIONS = [
  {
    title: "Automate Repetitive Work",
    description:
      "Eliminate manual tasks and free your team to focus on work that actually matters.",
  },
  {
    title: "Build Custom Business Systems",
    description:
      "Purpose-built software that fits your workflows, not the other way around.",
  },
  {
    title: "Turn Data Into Decisions",
    description:
      "Analytics and reporting that give you clarity on what's working and what isn't.",
  },
  {
    title: "Connect Your Technology",
    description:
      "Integrate your existing tools so data flows where it needs to — without the headaches.",
  },
  {
    title: "Add Intelligence With AI",
    description:
      "Deploy AI models and automation that augment your team's capabilities.",
  },
] as const;

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discover",
    description:
      "We learn your business, your users, and the problem you're solving — so we build the right thing.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Architecture, workflows, and interfaces planned with precision before a single line of code is written.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Iterative development with regular check-ins, so you see progress and stay in control.",
  },
  {
    step: "04",
    title: "Launch",
    description:
      "Tested, deployed, and supported — we make sure your software works when it matters.",
  },
] as const;

export const TECHNOLOGIES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Cloudflare",
  "Vercel",
  "Docker",
  "Git",
  "AI/LLM APIs",
] as const;
