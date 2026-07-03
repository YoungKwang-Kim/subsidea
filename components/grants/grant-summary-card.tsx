import { StatusBadge } from "@/components/ui/status-badge";
import type { Grant } from "@/types/grant";

type GrantSummaryCardProps = {
  grant: Grant;
};

export function GrantSummaryCard({ grant }: GrantSummaryCardProps) {
  const ageLabel =
    grant.target.age_min && grant.target.age_max
      ? `만 ${grant.target.age_min}~${grant.target.age_max}세`
      : grant.target.age_min
        ? `만 ${grant.target.age_min}세 이상`
        : "조건별 상이";

  return (
    <div
      style={{
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-hairline)",
        background: "linear-gradient(180deg, rgba(0,102,204,0.06), rgba(255,255,255,0.98))",
        padding: "24px",
      }}
    >
      <div
        className="grant-summary-header"
        style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "start" }}
      >
        <div>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "12px" }}>핵심 요약</p>
          <h1 className="text-keep" style={{ margin: "12px 0 0", fontSize: "var(--text-display-size)", lineHeight: 1.1, fontWeight: 600 }}>
            {grant.name}
          </h1>
        </div>
        <StatusBadge status={grant.status} />
      </div>

      <dl
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "18px",
          margin: "24px 0 0",
        }}
      >
        <div>
          <dt style={{ color: "var(--color-ink-muted)", fontSize: "12px" }}>대상</dt>
          <dd style={{ margin: "6px 0 0", fontSize: "17px", fontWeight: 600 }}>{ageLabel}</dd>
        </div>
        <div>
          <dt style={{ color: "var(--color-ink-muted)", fontSize: "12px" }}>지원 금액</dt>
          <dd style={{ margin: "6px 0 0", fontSize: "17px", fontWeight: 600 }}>{grant.benefit.amount}</dd>
        </div>
        <div>
          <dt style={{ color: "var(--color-ink-muted)", fontSize: "12px" }}>신청 기관</dt>
          <dd style={{ margin: "6px 0 0", fontSize: "17px", fontWeight: 600 }}>{grant.application_organization}</dd>
        </div>
        <div>
          <dt style={{ color: "var(--color-ink-muted)", fontSize: "12px" }}>지원 형태</dt>
          <dd style={{ margin: "6px 0 0", fontSize: "17px", fontWeight: 600 }}>{grant.benefit.type}</dd>
        </div>
      </dl>
    </div>
  );
}