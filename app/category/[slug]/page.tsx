import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/seo/structured-data";
import { GrantCard } from "@/components/grants/grant-card";
import { Section } from "@/components/layout/section";
import { EmptyState } from "@/components/ui/empty-state";
import { getGrantsByCategory } from "@/lib/grants/get-grants";
import { categoryMap } from "@/lib/grants/taxonomy";
import { absoluteUrl, createMetadata } from "@/lib/seo/metadata";
import type { GrantCategory } from "@/types/grant";

const categories = Object.keys(categoryMap) as GrantCategory[];

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return categories.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!categories.includes(slug as GrantCategory)) {
    return {};
  }

  const category = categoryMap[slug as GrantCategory];

  return createMetadata({
    title: `${category.label} 지원금`,
    description: category.description,
    path: `/category/${slug}`,
    keywords: [category.label, "대상별 지원금"],
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (!categories.includes(slug as GrantCategory)) {
    notFound();
  }

  const categoryKey = slug as GrantCategory;
  const category = categoryMap[categoryKey];
  const grants = await getGrantsByCategory(categoryKey);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.label} 지원금`,
    url: absoluteUrl(`/category/${categoryKey}`),
    description: category.description,
    inLanguage: "ko-KR",
  };

  return (
    <main>
      <StructuredData data={structuredData} />

      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "20px", maxWidth: "760px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>대상별 지원금</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)", lineHeight: 1.07, fontWeight: 600 }}>
            {category.label} 지원금 모아보기
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "var(--text-subhead-size)", lineHeight: 1.5 }}>
            {category.description}
          </p>
          <Link href="/topic/housing" style={{ color: "var(--color-primary)", fontSize: "17px" }}>
            분야별 탐색도 함께 보기
          </Link>
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
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
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--grid-gap)",
            }}
          >
            {grants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}