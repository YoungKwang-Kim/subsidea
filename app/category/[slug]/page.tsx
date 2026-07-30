import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GrantCollectionIntro } from "@/components/grants/grant-collection-intro";
import { GrantCard } from "@/components/grants/grant-card";
import { RelatedGuides } from "@/components/guides/related-guides";
import { Section } from "@/components/layout/section";
import { StructuredData } from "@/components/seo/structured-data";
import { EmptyState } from "@/components/ui/empty-state";
import { getGrantsByCategory } from "@/lib/grants/get-grants";
import { categoryHubContent } from "@/lib/grants/hub-content";
import { categoryMap } from "@/lib/grants/taxonomy";
import { getGuideBySlug } from "@/lib/guides";
import { absoluteUrl, createMetadata } from "@/lib/seo/metadata";
import type { GrantCategory } from "@/types/grant";

const categories = Object.keys(categoryMap) as GrantCategory[];

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return categories.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!categories.includes(slug as GrantCategory)) {
    return {};
  }

  const category = categoryMap[slug as GrantCategory];

  return createMetadata({
    title: `2026 ${category.label} 지원금 모아보기`,
    description: category.description,
    path: `/category/${slug}`,
    keywords: [category.label, "대상별 지원금", "2026 정부지원금"],
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (!categories.includes(slug as GrantCategory)) {
    notFound();
  }

  const categoryKey = slug as GrantCategory;
  const category = categoryMap[categoryKey];
  const hubContent = categoryHubContent[categoryKey];
  const grants = await getGrantsByCategory(categoryKey);
  const relatedGuides = hubContent.relatedGuideSlugs.flatMap((guideSlug) => {
    const guide = getGuideBySlug(guideSlug);
    return guide ? [guide] : [];
  });
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `2026 ${category.label} 지원금`,
    url: absoluteUrl(`/category/${categoryKey}`),
    description: category.description,
    inLanguage: "ko-KR",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: grants.length,
      itemListElement: grants.map((grant, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: grant.name,
        url: absoluteUrl(`/grant/${grant.slug}`),
      })),
    },
  };

  return (
    <main>
      <StructuredData data={structuredData} />

      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "20px", maxWidth: "780px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>
            대상별 지원금
          </p>
          <h1
            className="text-balance text-keep"
            style={{
              margin: 0,
              fontSize: "var(--text-hero-size)",
              lineHeight: 1.07,
              fontWeight: 600,
            }}
          >
            2026 {category.label} 지원금 모아보기
          </h1>
          <p
            className="text-pretty"
            style={{
              margin: 0,
              color: "var(--color-ink-muted)",
              fontSize: "var(--text-subhead-size)",
              lineHeight: 1.5,
            }}
          >
            {category.description}
          </p>
          <Link href="/checker" style={{ color: "var(--color-primary)", fontSize: "17px" }}>
            내 조건으로 지원금 찾기
          </Link>
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        <div style={{ display: "grid", gap: "56px" }}>
          <GrantCollectionIntro content={hubContent} grants={grants} />
          <RelatedGuides guides={relatedGuides} />
        </div>
      </Section>

      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "28px" }}>
          <div style={{ display: "grid", gap: "8px" }}>
            <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>
              지원금 목록
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
              현재 확인할 수 있는 {category.label} 지원금
            </h2>
          </div>
          {grants.length === 0 ? (
            <EmptyState
              title="아직 등록된 지원금이 없습니다"
              description="현재 확인된 지원금이 없습니다. 다른 대상이나 분야를 선택해 관련 제도를 확인해보세요."
              actionHref="/checker"
              actionLabel="자격 체크하기"
            />
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                gap: "var(--grid-gap)",
              }}
            >
              {grants.map((grant) => (
                <GrantCard key={grant.id} grant={grant} />
              ))}
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}
