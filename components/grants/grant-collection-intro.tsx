import type { GrantHubContent } from "@/lib/grants/hub-content";
import type { Grant } from "@/types/grant";

type GrantCollectionIntroProps = {
  content: GrantHubContent;
  grants: Grant[];
};

export function GrantCollectionIntro({
  content,
  grants,
}: GrantCollectionIntroProps) {
  const actionableCount = grants.filter(
    (grant) => grant.status === "open" || grant.status === "closing",
  ).length;

  return (
    <div style={{ display: "grid", gap: "32px" }}>
      <div style={{ display: "grid", gap: "12px", maxWidth: "800px" }}>
        <p
          style={{
            margin: 0,
            color: "var(--color-primary)",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          먼저 확인할 기준
        </p>
        <h2
          className="text-balance text-keep"
          style={{
            margin: 0,
            fontSize: "var(--text-display-size)",
            lineHeight: 1.14,
            fontWeight: 600,
          }}
        >
          지원금 이름보다 내 상황부터 나눠보세요
        </h2>
        <p
          className="text-pretty"
          style={{
            margin: 0,
            color: "var(--color-ink-muted)",
            fontSize: "var(--text-body-lg-size)",
            lineHeight: 1.75,
          }}
        >
          {content.intro}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
          gap: "16px",
        }}
      >
        {content.checkpoints.map((checkpoint, index) => (
          <article
            key={checkpoint.title}
            style={{
              display: "grid",
              alignContent: "start",
              gap: "14px",
              padding: "24px",
              border: "1px solid var(--color-hairline)",
              borderRadius: "var(--radius-lg)",
              background: "rgba(255, 255, 255, 0.82)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                display: "grid",
                placeItems: "center",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--color-ink)",
                color: "var(--color-on-dark)",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              {index + 1}
            </span>
            <h3 className="text-keep" style={{ margin: 0, fontSize: "21px", lineHeight: 1.3 }}>
              {checkpoint.title}
            </h3>
            <p
              className="text-pretty"
              style={{
                margin: 0,
                color: "var(--color-ink-muted)",
                lineHeight: 1.7,
              }}
            >
              {checkpoint.description}
            </p>
          </article>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gap: "10px",
          padding: "22px 24px",
          borderLeft: "3px solid var(--color-primary)",
          background: "rgba(0, 102, 204, 0.06)",
        }}
      >
        <strong style={{ color: "var(--color-primary)" }}>선택 팁</strong>
        <p className="text-pretty" style={{ margin: 0, lineHeight: 1.7 }}>
          {content.selectionTip}
        </p>
      </div>

      <p
        style={{
          margin: 0,
          color: "var(--color-ink-muted)",
          fontSize: "14px",
          lineHeight: 1.65,
        }}
      >
        현재 {grants.length}개 제도를 정리했으며, 사이트 표기상 신청 가능
        또는 마감 임박 상태는 {actionableCount}개입니다. 실제 신청 전에는 각
        상세 페이지의 확인일과 공식 공고를 다시 확인하세요.
      </p>
    </div>
  );
}
