import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/seo/structured-data";
import { GrantCard } from "@/components/grants/grant-card";
import { Section } from "@/components/layout/section";
import { EmptyState } from "@/components/ui/empty-state";
import { getGrantsByTopic } from "@/lib/grants/get-grants";
import { topicMap } from "@/lib/grants/taxonomy";
import { absoluteUrl, createMetadata } from "@/lib/seo/metadata";
import type { GrantTopic } from "@/types/grant";

const topics = Object.keys(topicMap) as GrantTopic[];

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return topics.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!topics.includes(slug as GrantTopic)) {
    return {};
  }

  const topic = topicMap[slug as GrantTopic];

  return createMetadata({
    title: `${topic.label} 지원금`,
    description: topic.description,
    path: `/topic/${slug}`,
    keywords: [topic.label, "분야별 지원금"],
  });
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;

  if (!topics.includes(slug as GrantTopic)) {
    notFound();
  }

  const topicKey = slug as GrantTopic;
  const topic = topicMap[topicKey];
  const grants = await getGrantsByTopic(topicKey);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${topic.label} 지원금`,
    url: absoluteUrl(`/topic/${topicKey}`),
    description: topic.description,
    inLanguage: "ko-KR",
  };

  return (
    <main>
      <StructuredData data={structuredData} />

      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "20px", maxWidth: "760px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>분야별 지원금</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)", lineHeight: 1.07, fontWeight: 600 }}>
            {topic.label} 지원금 모아보기
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "var(--text-subhead-size)", lineHeight: 1.5 }}>
            {topic.description}
          </p>
          <Link href="/category/youth" style={{ color: "var(--color-primary)", fontSize: "17px" }}>
            대상별 탐색도 함께 보기
          </Link>
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        {grants.length === 0 ? (
          <EmptyState
            title="아직 등록된 지원금이 없습니다"
            description="데이터가 늘어나면 이 분야의 지원금이 자동으로 연결될 수 있게 구조를 준비해두었습니다."
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