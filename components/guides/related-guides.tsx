import Link from "next/link";
import type { Guide } from "@/lib/guides";

export function RelatedGuides({ guides }: { guides: Guide[] }) {
  if (guides.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      <div style={{ display: "grid", gap: "8px" }}>
        <p
          style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}
        >
          함께 읽으면 좋은 가이드
        </p>
        <h2
          style={{
            margin: 0,
            fontSize: "var(--text-display-size)",
            lineHeight: 1.12,
            fontWeight: 600,
          }}
        >
          조건을 비교하고 신청 순서를 정리해보세요
        </h2>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "16px",
        }}
      >
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            style={{
              display: "grid",
              gap: "10px",
              padding: "22px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-hairline)",
              background: "rgba(255, 255, 255, 0.9)",
            }}
          >
            <span style={{ color: "var(--color-primary)", fontSize: "13px" }}>
              {guide.category}
            </span>
            <strong style={{ fontSize: "21px", lineHeight: 1.3 }}>
              {guide.title}
            </strong>
            <span style={{ color: "var(--color-ink-muted)", lineHeight: 1.65 }}>
              {guide.description}
            </span>
            <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>
              가이드 읽기 →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
