import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Grant } from "@/types/grant";

type GrantCardProps = {
  grant: Grant;
};

export function GrantCard({ grant }: GrantCardProps) {
  return (
    <Link
      href={`/grant/${grant.slug}`}
      className="grant-card"
      style={{
        display: "block",
        height: "100%",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-hairline)",
        background: "rgba(255, 255, 255, 0.88)",
        padding: "24px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        boxShadow: "none",
      }}
    >
      <div className="grant-card-header">
        <div style={{ display: "grid", gap: "10px", minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              color: "var(--color-primary)",
              fontSize: "12px",
              lineHeight: 1.33,
              letterSpacing: "-0.12px",
              textTransform: "capitalize",
            }}
          >
            {grant.category.join(" · ")}
          </p>
          <h3
            className="grant-card-title text-pretty text-keep"
            style={{
              margin: 0,
              fontSize: "var(--text-title-size)",
              lineHeight: 1.14,
              fontWeight: 600,
              letterSpacing: "-0.2px",
            }}
          >
            {grant.name}
          </h3>
        </div>
        <StatusBadge status={grant.status} />
      </div>

      <p
        className="grant-card-summary text-pretty text-keep"
        style={{
          margin: "16px 0 0",
          color: "var(--color-ink-muted)",
          fontSize: "var(--text-body-size)",
          lineHeight: 1.55,
        }}
      >
        {grant.summary}
      </p>

      <dl className="grant-card-meta">
        <div>
          <dt
            style={{
              color: "var(--color-ink-muted)",
              fontSize: "12px",
              margin: 0,
            }}
          >
            지원 금액
          </dt>
          <dd style={{ margin: "6px 0 0", fontSize: "var(--text-body-size)", fontWeight: 600 }}>
            {grant.benefit.amount}
          </dd>
        </div>
        <div>
          <dt
            style={{
              color: "var(--color-ink-muted)",
              fontSize: "12px",
              margin: 0,
            }}
          >
            신청 상태
          </dt>
          <dd style={{ margin: "6px 0 0", fontSize: "var(--text-body-size)", fontWeight: 600 }}>
            {grant.period.is_ongoing ? "상시 또는 진행중" : "기간 확인 필요"}
          </dd>
        </div>
      </dl>
    </Link>
  );
}