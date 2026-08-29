import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// jsdom doesn't implement scrollTo
beforeEach(() => {
  window.scrollTo = vi.fn();
});
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Services } from "@/components/Services";
import { Solutions } from "@/components/Solutions";
import { Process } from "@/components/Process";
import { Technologies } from "@/components/Technologies";
import { About } from "@/components/About";
import { CTA } from "@/components/CTA";

// ---------------------------------------------------------------------------
// Navbar Tests
// ---------------------------------------------------------------------------

describe("Navbar", () => {
  beforeEach(() => {
    window.scrollTo(0, 0);
  });

  it("renders the site name", () => {
    render(<Navbar />);
    expect(screen.getByText("MSC")).toBeInTheDocument();
  });

  it("renders all navigation items", () => {
    render(<Navbar />);
    const navItems = ["Home", "Services", "Solutions", "Process", "About", "Contact"];
    for (const item of navItems) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("has accessible hamburger button", () => {
    render(<Navbar />);
    const hamburger = screen.getByRole("button", { name: /open menu/i });
    expect(hamburger).toBeInTheDocument();
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
    expect(hamburger).toHaveAttribute("aria-controls", "mobile-menu");
  });

  it("toggles mobile menu on hamburger click", () => {
    render(<Navbar />);
    const hamburger = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(hamburger);

    expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();
    expect(hamburger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes mobile menu on Escape key", () => {
    render(<Navbar />);
    const hamburger = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(hamburger);
    expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument();
  });

  it("closes mobile menu when a nav link is clicked", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));

    // Click a mobile nav link (second occurrence of "Services")
    const servicesLinks = screen.getAllByText("Services");
    fireEvent.click(servicesLinks[servicesLinks.length - 1]);

    expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument();
  });

  it("applies scrolled background on scroll", () => {
    render(<Navbar />);
    const header = screen.getByRole("banner");
    expect(header).not.toHaveClass("backdrop-blur-sm");

    fireEvent.scroll(window, { target: { scrollY: 50 } });
    expect(header).toHaveClass("backdrop-blur-sm");
  });
});

// ---------------------------------------------------------------------------
// Hero Tests
// ---------------------------------------------------------------------------

describe("Hero", () => {
  it("renders the main heading (single H1)", () => {
    render(<Hero />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent(/we build software that moves businesses forward/i);
  });

  it("renders the tagline", () => {
    render(<Hero />);
    expect(screen.getByText(/software engineering.*ai.*automation.*data/i)).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<Hero />);
    expect(screen.getByText(/msc engineers scalable software/i)).toBeInTheDocument();
  });

  it("renders both CTA buttons with correct hrefs", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /start a project/i })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: /explore our services/i })).toHaveAttribute("href", "#services");
  });
});

// ---------------------------------------------------------------------------
// Services Tests
// ---------------------------------------------------------------------------

describe("Services", () => {
  it("renders the section heading", () => {
    render(<Services />);
    expect(screen.getByRole("heading", { level: 2, name: /engineering solutions/i })).toBeInTheDocument();
  });

  it("renders all 6 service cards", () => {
    render(<Services />);
    const titles = [
      "Software Engineering", "AI Automation", "Workflow Automation",
      "Data Analysis", "API & System Integration", "Custom Software",
    ];
    for (const title of titles) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("renders service descriptions", () => {
    render(<Services />);
    expect(screen.getByText(/custom-built software solutions/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Solutions Tests
// ---------------------------------------------------------------------------

describe("Solutions", () => {
  it("renders the section heading", () => {
    render(<Solutions />);
    expect(screen.getByRole("heading", { level: 2, name: /business problems/i })).toBeInTheDocument();
  });

  it("renders all 5 solution cards", () => {
    render(<Solutions />);
    const solutions = [
      "Automate Repetitive Work", "Build Custom Business Systems",
      "Turn Data Into Decisions", "Connect Your Technology", "Add Intelligence With AI",
    ];
    for (const title of solutions) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("renders numbered indicators", () => {
    render(<Solutions />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("05")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Process Tests
// ---------------------------------------------------------------------------

describe("Process", () => {
  it("renders the section heading", () => {
    render(<Process />);
    expect(screen.getByRole("heading", { level: 2, name: /from idea to production/i })).toBeInTheDocument();
  });

  it("renders all 4 process steps", () => {
    render(<Process />);
    for (const step of ["Discover", "Design", "Build", "Launch"]) {
      expect(screen.getByText(step)).toBeInTheDocument();
    }
  });

  it("renders step numbers", () => {
    render(<Process />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Technologies Tests
// ---------------------------------------------------------------------------

describe("Technologies", () => {
  it("renders the section heading", () => {
    render(<Technologies />);
    expect(screen.getByRole("heading", { level: 2, name: /technologies we work with/i })).toBeInTheDocument();
  });

  it("renders all 13 technology pills", () => {
    render(<Technologies />);
    const techs = [
      "TypeScript", "JavaScript", "Python", "Go", "React", "Next.js",
      "Node.js", "PostgreSQL", "Cloudflare", "Vercel", "Docker", "Git", "AI/LLM APIs",
    ];
    for (const tech of techs) {
      expect(screen.getByText(tech)).toBeInTheDocument();
    }
  });
});

// ---------------------------------------------------------------------------
// About Tests
// ---------------------------------------------------------------------------

describe("About", () => {
  it("renders the section heading", () => {
    render(<About />);
    expect(screen.getByRole("heading", { level: 2, name: /practical engineering/i })).toBeInTheDocument();
  });

  it("renders about text", () => {
    render(<About />);
    expect(screen.getByText(/technology should solve real business problems/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// CTA Tests
// ---------------------------------------------------------------------------

describe("CTA", () => {
  it("renders the heading", () => {
    render(<CTA />);
    expect(screen.getByRole("heading", { level: 2, name: /have a problem worth solving/i })).toBeInTheDocument();
  });

  it("renders the CTA button with correct href", () => {
    render(<CTA />);
    expect(screen.getByRole("link", { name: /start a conversation/i })).toHaveAttribute("href", "#contact");
  });
});

// ---------------------------------------------------------------------------
// Footer Tests
// ---------------------------------------------------------------------------

describe("Footer", () => {
  it("renders the site name", () => {
    render(<Footer />);
    expect(screen.getByText("MSC")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Footer />);
    for (const item of ["Home", "Services", "Solutions", "Process", "About", "Contact"]) {
      expect(screen.getAllByText(item).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders email link", () => {
    render(<Footer />);
    const emailLink = screen.getByRole("link", { name: /hello@msc\.dev/i });
    expect(emailLink).toHaveAttribute("href", "mailto:hello@msc.dev");
  });

  it("renders copyright with current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`${year}.*MSC.*All rights reserved`))).toBeInTheDocument();
  });

  it("renders footer landmark", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Contact Form Tests
// ---------------------------------------------------------------------------

describe("Contact", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the form heading", () => {
    render(<Contact />);
    expect(screen.getByRole("heading", { level: 2, name: /start a conversation/i })).toBeInTheDocument();
  });

  it("renders all form fields with labels", () => {
    render(<Contact />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project description/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    render(<Contact />);
    expect(screen.getByRole("button", { name: /send inquiry/i })).toBeInTheDocument();
  });

  it("renders the honeypot field (hidden from real users)", () => {
    render(<Contact />);
    const honeypot = screen.getByLabelText(/leave this empty/i);
    expect(honeypot).toHaveAttribute("name", "website_url");
    expect(honeypot.closest("[aria-hidden]")).toBeInTheDocument();
  });

  it("shows privacy notice", () => {
    render(<Contact />);
    expect(screen.getByText(/by submitting this form/i)).toBeInTheDocument();
  });

  it("renders service dropdown with all options", () => {
    render(<Contact />);
    const select = screen.getByLabelText(/service/i);
    const options = select.querySelectorAll("option");
    expect(options.length).toBe(7); // 1 placeholder + 6 services
  });

  it("has proper label-input associations", () => {
    render(<Contact />);
    expect(screen.getByLabelText(/name/i)).toHaveAttribute("id", "name");
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("id", "email");
    expect(screen.getByLabelText(/service/i)).toHaveAttribute("id", "service");
    expect(screen.getByLabelText(/project description/i)).toHaveAttribute("id", "description");
  });

  it("shows error when submitted too fast (timing check)", () => {
    render(<Contact />);

    // Fill form via fireEvent (bypasses timing)
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Test User" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/service/i), { target: { value: "AI Automation" } });
    fireEvent.change(screen.getByLabelText(/project description/i), { target: { value: "Test message" } });

    // Submit immediately (timer at 0ms, needs 3000ms)
    fireEvent.submit(screen.getByRole("button", { name: /send inquiry/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/please take a moment/i);
  });

  it("renders form with noValidate attribute", () => {
    render(<Contact />);
    const form = document.querySelector("form");
    expect(form).toHaveAttribute("novalidate");
  });

  it("has required attributes on required fields", () => {
    render(<Contact />);
    expect(screen.getByLabelText(/name/i)).toHaveAttribute("required");
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("required");
    expect(screen.getByLabelText(/service/i)).toHaveAttribute("required");
    expect(screen.getByLabelText(/project description/i)).toHaveAttribute("required");
  });

  it("has maxLength attributes matching server validation", () => {
    render(<Contact />);
    expect(screen.getByLabelText(/name/i)).toHaveAttribute("maxlength", "100");
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("maxlength", "254");
    expect(screen.getByLabelText(/company/i)).toHaveAttribute("maxlength", "150");
    expect(screen.getByLabelText(/project description/i)).toHaveAttribute("maxlength", "3000");
  });
});
