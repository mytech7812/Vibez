import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type BaseProps = {
  variant?: "primary" | "outline" | "ghost";
  size?: "md" | "lg";
  children: ReactNode;
  className?: string;
};

const variantClasses: Record<NonNullable<BaseProps["variant"]>, string> = {
  primary:
    "bg-signal text-white hover:bg-signal-dim active:bg-signal-dim shadow-[0_0_0_1px_rgba(255,45,94,0.15)]",
  outline:
    "bg-transparent text-ink border border-white/25 hover:border-white/60 hover:bg-white/5",
  ghost: "bg-white/5 text-ink hover:bg-white/10",
};

const sizeClasses: Record<NonNullable<BaseProps["size"]>, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-[15px]",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm font-sans font-medium tracking-[0.01em] transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  children,
  className = "",
}: BaseProps & { href: string }) {
  return (
    <Link
      href={href}
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
