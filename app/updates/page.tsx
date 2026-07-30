import Link from "next/link";
import { StructuredData } from "@/components/seo/structured-data";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatIsoDate } from "@/lib/formatters/date";
import { getGrantBySlug } from "@/lib/grants/get-grants";
import { absoluteUrl, createMetadata } from "@/lib/seo/metadata";
import { getUpdates } from "@/lib/updates/get-updates";

const typeLabelMap = {
  new: { label: "신규", color: "var(--color-primary)" },
  changed: { label: "변경", color: "var(--color-warning)" },
  closing: { label: "마감 임박", color: "var(--color-danger)" },
  closed: { label: "마감", color: "var(--color-ink-muted)" },
} as const;

export const metadata = createMetadata({
  title: "업데이트",
  description: "공식 자료를 확인해 반영한 신규 지원금, 정책 변경, 모집 마감 이력을 날짜순으로 확인합니다.",
  path: "/updates",
  keywords: ["지원금 업데이트", "정책 변경", "지원금 마감"],
});

export default async function UpdatesPage() {
  const updates = await getUpdates();
  const grants = await Promise.all(updates.map((item) => getGrantBySlug(item.grant_slug)));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "지원금 업데이트",
    url: absoluteUrl("/updates"),
    description: "공식 자료를 확인해 반영한 신규, 변경, 마감 지원금 업데이트 목록",
    inLanguage: "ko-KR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: updates.length,
      itemListElement: updates.map((update, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: update.title,
        url: absoluteUrl(`/grant/${update.grant_slug}`),
      })),
    },
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
            공식 기관에서 확인한 신규 모집, 조건 변경, 접수 마감 정보를 날짜순으로 안내합니다. 표시 날짜는 지원바다 편집팀이 공식 자료를 확인해 반영한 날짜입니다.
          </p>
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        <div style={{ display: "grid", gap: "20px" }}>
          {updates.length === 0 ? (
            <EmptyState
              title="아직 등록된 업데이트가 없습니다"
              description="새로운 모집이나 정책 변경을 확인하면 이곳에 안내합니다."
              actionHref="/search"
              actionLabel="지원금 찾아보기"
            />
          ) : null}
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
                    <Link
                      href={relatedGrant.source_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "var(--color-primary)", fontSize: "17px", alignSelf: "center" }}
                    >
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