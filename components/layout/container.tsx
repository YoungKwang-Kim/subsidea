import type { ReactNode } from "react";

const maxWidths = {
  default: "var(--max-width-content)",
  wide: "var(--max-width-wide)",
  text: "var(--max-width-text)",
} as const;

type ContainerProps = {
  children: ReactNode;
  size?: keyof typeof maxWidths;
  className?: string;
};

export function Container({
  children,
  size = "default",
  className,
}: ContainerProps) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        maxWidth: maxWidths[size],
        margin: "0 auto",
        paddingInline: "var(--container-padding)",
      }}
    >
      {children}
    </div>
  );
}