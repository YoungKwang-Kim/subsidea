import { StatusBadge } from "@/components/ui/status-badge";
import type { Grant } from "@/types/grant";

type GrantSummaryCardProps = {
  grant: Grant;
};

function getAgeLabel(grant: Grant) {
  if (grant.target.age_min && grant.target.age_max) {
    return `${grant.target.age_min}세 ~ ${grant.target.age_max}세`;
  }

  if (grant.target.age_min) {
    return `${grant.target.age_min}세 이상`;
  }

  return "세부 공고 기준 확인";
}

function getPeriodLabel(grant: Grant) {
  if (grant.period.is_ongoing) {
    return "상시 또는 연중 운영";
  }

  if (grant.period.start && grant.period.end) {
    return `${grant.period.start} ~ ${grant.period.end}`;
  }

  return "공식 공고 일정 확인 필요";
}

export function GrantSummaryCard({ grant }: GrantSummaryCardProps) {
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
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "12px" }}>지원금 요약</p>
          <h1 className="text-keep" style={{ margin: "12px 0 0", fontSize: "var(--text-display-size)", lineHeight: 1.1, fontWeight: 600 }}>
            {grant.name}
          </h1>
          <p style={{ margin: "14px 0 0", color: "var(--color-ink-muted)", maxWidth: "720px", lineHeight: 1.7 }}>
            {grant.summary}
          </p>
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
          <dt style={{ color: "var(--color-ink-muted)", fontSize: "12px" }}>주요 대상</dt>
          <dd style={{ margin: "6px 0 0", fontSize: "17px", fontWeight: 600 }}>{getAgeLabel(grant)}</dd>
        </div>
        <div>
          <dt style={{ color: "var(--color-ink-muted)", fontSize: "12px" }}>지원 금액</dt>
          <dd style={{ margin: "6px 0 0", fontSize: "17px", fontWeight: 600 }}>{grant.benefit.amount}</dd>
        </div>
        <div>
          <dt style={{ color: "var(--color-ink-muted)", fontSize: "12px" }}>신청 일정</dt>
          <dd style={{ margin: "6px 0 0", fontSize: "17px", fontWeight: 600 }}>{getPeriodLabel(grant)}</dd>
        </div>
        <div>
          <dt style={{ color: "var(--color-ink-muted)", fontSize: "12px" }}>접수 기관</dt>
          <dd style={{ margin: "6px 0 0", fontSize: "17px", fontWeight: 600 }}>{grant.application_organization}</dd>
        </div>
      </dl>
    </div>
  );
}