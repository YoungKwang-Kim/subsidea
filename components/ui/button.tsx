import Link from "next/link";
import type { ReactNode } from "react";

const variantStyles = {
  primary: {
    background: "var(--color-primary)",
    color: "#ffffff",
    border: "1px solid transparent",
  },
  secondary: {
    background: "transparent",
    color: "var(--color-primary)",
    border: "1px solid var(--color-primary)",
  },
  darkUtility: {
    background: "var(--color-ink)",
    color: "#ffffff",
    border: "1px solid transparent",
  },
} as const;

const sizeStyles = {
  sm: {
    fontSize: "14px",
    minHeight: "36px",
    padding: "8px 16px",
  },
  md: {
    fontSize: "17px",
    minHeight: "44px",
    padding: "11px 22px",
  },
} as const;

type ButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
};

function getBaseStyle(variant: ButtonProps["variant"], size: ButtonProps["size"]) {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "fit-content",
    maxWidth: "100%",
    borderRadius: "var(--radius-pill)",
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: "-0.2px",
    whiteSpace: "nowrap",
    flexShrink: 0,
    transition: "transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease",
    ...variantStyles[variant ?? "primary"],
    ...sizeStyles[size ?? "md"],
  };
}

export function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  size = "md",
}: ButtonProps) {
  const style = getBaseStyle(variant, size);

  if (href) {
    return (
      <Link href={href} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} style={style}>
      {children}
    </button>
  );
}