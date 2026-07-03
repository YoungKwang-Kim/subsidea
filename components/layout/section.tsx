import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";

const surfaceClassNames = {
  light: "surface-light",
  parchment: "surface-parchment",
  dark: "surface-dark",
} as const;

type SectionProps = {
  children: ReactNode;
  surface?: keyof typeof surfaceClassNames;
  containerSize?: "default" | "wide" | "text";
  className?: string;
  id?: string;
};

export function Section({
  children,
  surface = "light",
  containerSize = "default",
  className,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${surfaceClassNames[surface]}${className ? ` ${className}` : ""}`}
      style={{ paddingBlock: "var(--spacing-section)" }}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
