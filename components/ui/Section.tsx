import { Container } from "./Container";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  withContainer?: boolean;
}

export function Section({
  children,
  className = "",
  id,
  withContainer = true,
}: SectionProps) {
  const content = (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      {children}
    </section>
  );

  if (withContainer) {
    return <Container>{content}</Container>;
  }

  return content;
}
