import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent)]/90",
  secondary:
    "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary)]/90",
  outline:
    "border border-[var(--color-border)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-foreground)]/10",
  ghost:
    "text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-foreground)]/10",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3 text-lg",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  disabled = false,
  type = "button",
  onClick,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:pointer-events-none disabled:opacity-50";
  const combined = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={combined}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combined}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
