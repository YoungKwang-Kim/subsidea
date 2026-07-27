import type { GrantEditorial, GrantScenario } from "@/types/grant";

const scenarioOutcomeMap: Record<
  GrantScenario["outcome"],
  { label: string; color: string; background: string }
> = {
  likely: {
    label: "가능성 높음",
    color: "var(--color-success)",
    background: "rgba(29, 131, 72, 0.08)",
  },
  check: {
    label: "추가 확인",
    color: "var(--color-warning)",
    background: "rgba(183, 121, 31, 0.08)",
  },
  unlikely: {
    label: "가능성 낮음",
    color: "var(--color-danger)",
    background: "rgba(192, 57, 43, 0.08)",
  },
};

function DetailList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gap: "12px" }}>
      {items.map((item) => (
        <li key={item} style={{ color: "var(--color-ink-muted)", lineHeight: 1.75 }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function ScenarioCard({ scenario }: { scenario: GrantScenario }) {
  const outcome = scenarioOutcomeMap[scenario.outcome];

  return (
    <article
      style={{
        display: "grid",
        gap: "12px",
        padding: "22px",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-hairline)",
        background: "rgba(255,255,255,0.9)",
      }}
    >
      <span
        style={{
          width: "fit-content",
          padding: "5px 9px",
          borderRadius: "var(--radius-pill)",
          color: outcome.color,
          background: outcome.background,
          fontSize: "12px",
          lineHeight: 1.3,
        }}
      >
        {outcome.label}
      </span>
      <h3 style={{ margin: 0, fontSize: "21px", lineHeight: 1.3 }}>{scenario.title}</h3>
      <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.75 }}>{scenario.description}</p>
    </article>
  );
}

function EditorialListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ display: "grid", gap: "16px", maxWidth: "var(--max-width-text)" }}>
      <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>{title}</h2>
      <DetailList items={items} />
    </div>
  );
}

export function GrantEditorialContent({ editorial }: { editorial: GrantEditorial }) {
  return (
    <>
      <div style={{ display: "grid", gap: "20px" }}>
        <div style={{ display: "grid", gap: "10px", maxWidth: "var(--max-width-text)" }}>
          <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>
            실제 상황으로 신청 가능성 살펴보기
          </h2>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.75 }}>
            아래 사례는 이해를 돕기 위한 예시입니다. 실제 결과는 가구 구성, 소득·재산 조사와 운영 기관 심사에 따라 달라질 수 있습니다.
          </p>
        </div>
        <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {editorial.scenarios.map((scenario) => (
            <ScenarioCard key={scenario.title} scenario={scenario} />
          ))}
        </div>
      </div>

      <EditorialListSection title="제외되거나 추가 확인이 필요한 경우" items={editorial.exclusions} />
      <EditorialListSection title="금액과 부담을 계산해보는 예시" items={editorial.calculation_examples} />
      <EditorialListSection title="신청부터 지원까지의 흐름" items={editorial.timeline} />

      <div style={{ display: "grid", gap: "16px", maxWidth: "var(--max-width-text)" }}>
        <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>공식 근거와 검토 정보</h2>
        <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.7 }}>
          검토: {editorial.reviewer} · 확인일: {editorial.verified_at}
        </p>
        <div style={{ display: "grid", gap: "14px" }}>
          {editorial.evidence.map((evidence) => (
            <article
              key={evidence.url}
              style={{
                display: "grid",
                gap: "8px",
                padding: "18px 0",
                borderBottom: "1px solid var(--color-divider-soft)",
              }}
            >
              <a
                href={evidence.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--color-primary)", fontSize: "17px", fontWeight: 600 }}
              >
                {evidence.title}
              </a>
              <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.65 }}>
                확인 항목: {evidence.supports.join(", ")} · 확인일 {evidence.checked_at}
              </p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}