import Link from "next/link";
import { StructuredData } from "@/components/seo/structured-data";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { formatIsoDate } from "@/lib/formatters/date";
import { getGrantBySlug } from "@/lib/grants/get-grants";
import { absoluteUrl, createMetadata } from "@/lib/seo/metadata";
import { getUpdates } from "@/lib/updates/get-updates";

const typeLabelMap = {
  new: { label: "신규", color: "var(--color-primary)" },
  changed: { label: "변경", color: "var(--color-warning)" },
  closing: { label: "마감", color: "var(--color-danger)" },
} as const;

export const metadata = createMetadata({
  title: "업데이트",
  description: "신규, 변경, 마감 임박 지원금 업데이트를 타임라인으로 확인합니다.",
  path: "/updates",
  keywords: ["업데이트", "정책 변경", "마감 임박"],
});

export default async function UpdatesPage() {
  const updates = await getUpdates();
  const grants = await Promise.all(updates.map((item) => getGrantBySlug(item.grant_slug)));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "지원금 업데이트",
    url: absoluteUrl("/updates"),
    description: "신규, 변경, 마감 임박 지원금 업데이트 목록",
    inLanguage: "ko-KR",
  };

  return (
    <main>
      <StructuredData data={structuredData} />

      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "20px", maxWidth: "760px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>업데이트</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)", lineHeight: 1.07, fontWeight: 600 }}>
            신규·변경·마감 소식을 빠르게 확인하기
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "var(--text-subhead-size)", lineHeight: 1.5 }}>
            크롤링 데이터가 확장되면 이 타임라인도 자동으로 풍부해질 수 있도록 별도 구조로 분리해두었습니다.
          </p>
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        <div style={{ display: "grid", gap: "20px" }}>
          {updates.map((update, index) => {
            const relatedGrant = grants[index];
            const typeMeta = typeLabelMap[update.type];

            return (
              <article
                key={update.id}
                style={{
                  display: "grid",
                  gap: "10px",
                  padding: "24px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-hairline)",
                  background: "rgba(255,255,255,0.9)",
                }}
              >
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ color: typeMeta.color, fontSize: "12px", fontWeight: 600 }}>{typeMeta.label}</span>
                  <span style={{ color: "var(--color-ink-muted)", fontSize: "12px" }}>{formatIsoDate(update.published_at)}</span>
                </div>
                <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>{update.title}</h2>
                <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>{update.summary}</p>
                {relatedGrant ? (
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <Button href={`/grant/${relatedGrant.slug}`} size="sm">
                      관련 지원금 보기
                    </Button>
                    <Link href={relatedGrant.source_url} style={{ color: "var(--color-primary)", fontSize: "17px", alignSelf: "center" }}>
                      공식 출처 보기
                    </Link>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </Section>
    </main>
  );
}