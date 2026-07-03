import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: SectionHeadingProps) {
  return (
    <div className="section-heading" style={{ textAlign: align }}>
      <div className="section-heading-main">
        {eyebrow ? (
          <p
            style={{
              margin: 0,
              color: "var(--color-primary)",
              fontSize: "14px",
              lineHeight: 1.43,
              letterSpacing: "-0.224px",
            }}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          className="text-balance text-keep"
          style={{
            margin: eyebrow ? "10px 0 0" : 0,
            fontSize: "var(--text-display-size)",
            lineHeight: 1.1,
            letterSpacing: "-0.28px",
            fontWeight: 600,
          }}
        >
          {title}
        </h2>
        {description ? (
          <p
            className="text-pretty text-keep"
            style={{
              margin: "14px 0 0",
              color: "var(--color-ink-muted)",
              fontSize: "var(--text-body-lg-size)",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="section-heading-action">{action}</div> : null}
    </div>
  );
}