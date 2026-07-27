import Link from "next/link";
import type { GuideComparison } from "@/lib/guides";

export function GuideComparisonContent({
  comparison,
}: {
  comparison: GuideComparison;
}) {
  return <SectionContent comparison={comparison} />;
}

function SectionContent({ comparison }: { comparison: GuideComparison }) {
  return (
    <div style={{ display: "grid", gap: "22px" }}>
      <div
        style={{
          display: "grid",
          gap: "10px",
          maxWidth: "var(--max-width-text)",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "28px",
            lineHeight: 1.24,
            fontWeight: 600,
          }}
        >
          {comparison.title}
        </h2>
        <p
          style={{
            margin: 0,
            color: "var(--color-ink-muted)",
            fontSize: "17px",
            lineHeight: 1.75,
          }}
        >
          {comparison.description}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
          gap: "16px",
        }}
      >
        {comparison.items.map((item) => {
          const content = (
            <>
              <span
                style={{
                  width: "fit-content",
                  padding: "5px 9px",
                  borderRadius: "var(--radius-pill)",
                  background: "rgba(0, 102, 204, 0.08)",
                  color: "var(--color-primary)",
                  fontSize: "12px",
                  lineHeight: 1.3,
                }}
              >
                {item.label}
              </span>
              <h3
                style={{
                  margin: 0,
                  fontSize: "21px",
                  lineHeight: 1.3,
                  fontWeight: 600,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "var(--color-ink-muted)",
                  lineHeight: 1.7,
                }}
              >
                {item.description}
              </p>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "18px",
                  display: "grid",
                  gap: "8px",
                  color: "var(--color-ink-muted)",
                  lineHeight: 1.6,
                }}
              >
                {item.checkpoints.map((checkpoint) => (
                  <li key={checkpoint}>{checkpoint}</li>
                ))}
              </ul>
              {item.href ? (
                <span
                  style={{ color: "var(--color-primary)", fontWeight: 600 }}
                >
                  상세 조건 확인하기 →
                </span>
              ) : null}
            </>
          );

          const cardStyle = {
            display: "grid",
            alignContent: "start",
            gap: "12px",
            padding: "22px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-hairline)",
            background: "rgba(255, 255, 255, 0.88)",
          } as const;

          return item.href ? (
            <Link key={item.title} href={item.href} style={cardStyle}>
              {content}
            </Link>
          ) : (
            <article key={item.title} style={cardStyle}>
              {content}
            </article>
          );
        })}
      </div>
    </div>
  );
}
