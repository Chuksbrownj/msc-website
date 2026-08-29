"use client";

import { useState, useEffect } from "react";
import { SITE_CONFIG, NAV_ITEMS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        isScrolled
          ? "bg-[var(--color-primary)]/95 backdrop-blur-sm border-b border-[var(--color-border)]"
          : "bg-transparent"
      }`}
    >
      <nav aria-label="Main navigation">
        <Container>
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo */}
            <a
              href="#hero"
              className="text-xl font-bold tracking-tight text-[var(--color-primary-foreground)]"
            >
              {SITE_CONFIG.name}
            </a>

            {/* Desktop nav */}
            <ul className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary-foreground)]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:text-[var(--color-primary-foreground)] md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div
              id="mobile-menu"
              className="border-t border-[var(--color-border)] py-4 md:hidden animate-fade-in"
            >
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={handleNavClick}
                      className="block rounded-lg px-3 py-2.5 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-primary-foreground)]/5 hover:text-[var(--color-primary-foreground)]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </nav>
    </header>
  );
}
