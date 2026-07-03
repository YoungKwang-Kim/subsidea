import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/seo/structured-data";
import { Breadcrumbs } from "@/components/grants/breadcrumbs";
import { GrantCard } from "@/components/grants/grant-card";
import { GrantSummaryCard } from "@/components/grants/grant-summary-card";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { getGrantBySlug, getGrantSlugs, getRelatedGrants } from "@/lib/grants/get-grants";
import { categoryMap, topicMap } from "@/lib/grants/taxonomy";
import { absoluteUrl, createMetadata } from "@/lib/seo/metadata";
import type { GrantCategory, GrantTopic } from "@/types/grant";

function DetailList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gap: "12px" }}>
      {items.map((item) => (
        <li key={item} style={{ color: "var(--color-ink-muted)" }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

type GrantDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getGrantSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GrantDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const grant = await getGrantBySlug(slug);

  if (!grant) {
    return {};
  }

  return createMetadata({
    title: `${grant.name} 신청방법`,
    description: grant.summary,
    path: `/grant/${grant.slug}`,
    keywords: [...grant.category, ...grant.topic, ...grant.tags],
    type: "article",
  });
}

export default async function GrantDetailPage({ params }: GrantDetailPageProps) {
  const { slug } = await params;
  const grant = await getGrantBySlug(slug);

  if (!grant) {
    notFound();
  }

  const relatedGrants = await getRelatedGrants(grant, 3);
  const primaryCategory = categoryMap[grant.category[0] as GrantCategory];
  const primaryTopic = topicMap[grant.topic[0] as GrantTopic];
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: grant.name,
      description: grant.summary,
      url: absoluteUrl(`/grant/${grant.slug}`),
      inLanguage: "ko-KR",
      dateModified: grant.last_updated,
      author: {
        "@type": "Organization",
        name: "지원바다",
      },
      publisher: {
        "@type": "Organization",
        name: "지원바다",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: grant.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <main>
      <StructuredData data={structuredData} />

      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "24px" }}>
          <Breadcrumbs
            items={[
              { href: "/", label: "홈" },
              { href: `/category/${grant.category[0]}`, label: primaryCategory.label },
              { label: grant.name },
            ]}
          />
          <GrantSummaryCard grant={grant} />
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        <div style={{ display: "grid", gap: "40px" }}>
          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>1. 이 지원금이 뭔가요?</h2>
            <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>{grant.overview}</p>
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>2. 신청 자격 조건</h2>
            <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>소득 기준: {grant.target.income}</p>
            <DetailList items={grant.target.conditions} />
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>3. 지원 금액·혜택</h2>
            <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
              {grant.benefit.amount} / {grant.benefit.duration} / {grant.benefit.type}
            </p>
            <DetailList items={grant.benefit_details} />
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>4. 신청 방법</h2>
            <DetailList items={grant.application_steps} />
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>5. 필요 서류</h2>
            <DetailList items={grant.required_documents} />
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>6. 자주 묻는 질문</h2>
            <div style={{ display: "grid", gap: "16px" }}>
              {grant.faq.map((item) => (
                <div key={item.question} style={{ padding: "20px", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-hairline)", background: "rgba(255,255,255,0.9)" }}>
                  <strong style={{ display: "block", fontSize: "17px" }}>{item.question}</strong>
                  <p style={{ margin: "10px 0 0", color: "var(--color-ink-muted)" }}>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Button href={grant.apply_url}>공식 신청 바로가기</Button>
            <Button href={grant.source_url} variant="secondary">공식 출처 보기</Button>
            <Button href={`/topic/${grant.topic[0]}`} variant="secondary">{primaryTopic.label} 더 보기</Button>
          </div>
        </div>
      </Section>

      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "24px" }}>
          <div>
            <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>함께 받을 수 있는 지원금</p>
            <h2 style={{ margin: "12px 0 0", fontSize: "var(--text-display-size)", lineHeight: 1.1, fontWeight: 600 }}>
              비슷한 조건에서 같이 살펴볼 만한 지원금
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--grid-gap)",
            }}
          >
            {relatedGrants.map((relatedGrant) => (
              <GrantCard key={relatedGrant.id} grant={relatedGrant} />
            ))}
          </div>
          {relatedGrants.length === 0 ? (
            <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
              현재 샘플 데이터 기준으로는 자동 추천된 유사 지원금이 많지 않습니다.
            </p>
          ) : null}
        </div>
      </Section>
    </main>
  );
}