import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  description,
  actionHref = "/",
  actionLabel = "홈으로 이동",
}: EmptyStateProps) {
  return (
    <div
      style={{
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-hairline)",
        background: "rgba(255, 255, 255, 0.88)",
        padding: "32px",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>{title}</h2>
      <p style={{ margin: "12px 0 0", color: "var(--color-ink-muted)" }}>{description}</p>
      <Link
        href={actionHref}
        style={{
          display: "inline-flex",
          marginTop: "20px",
          color: "var(--color-primary)",
          fontSize: "17px",
        }}
      >
        {actionLabel}
      </Link>
    </div>
  );
}

