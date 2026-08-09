import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RelatedGuides } from "@/components/guides/related-guides";
import { StructuredData } from "@/components/seo/structured-data";
import { Breadcrumbs } from "@/components/grants/breadcrumbs";
import { CoreDecisionGuide } from "@/components/grants/core-decision-guide";
import { GrantCard } from "@/components/grants/grant-card";
import { GrantEditorialContent } from "@/components/grants/grant-editorial";
import { GrantSummaryCard } from "@/components/grants/grant-summary-card";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { getGrantBySlug, getGrantSlugs, getRelatedGrants } from "@/lib/grants/get-grants";
import { getCoreDecisionGuide } from "@/lib/grants/core-decision-guides";
import { isIndexableGrantSlug } from "@/lib/grants/index-policy-core.mjs";
import { getGuidesForGrant } from "@/lib/guides";
import { categoryMap, topicMap } from "@/lib/grants/taxonomy";
import { absoluteUrl, createMetadata } from "@/lib/seo/metadata";
import type { Grant, GrantCategory, GrantTopic } from "@/types/grant";

function DetailList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gap: "12px" }}>
      {items.map((item) => (
        <li key={item} style={{ color: "var(--color-ink-muted)", lineHeight: 1.7 }}>
          {item}
        </li>
      ))}
    </ul>
  );
}

function getAgeLabel(grant: Grant) {
  if (grant.target.age_min && grant.target.age_max) {
    return `${grant.target.age_min}세 ~ ${grant.target.age_max}세`;
  }

  if (grant.target.age_min) {
    return `${grant.target.age_min}세 이상`;
  }

  return "세부 공고 기준 확인";
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
    title: `${grant.name} 신청 방법과 자격 조건`,
    description: grant.summary,
    path: `/grant/${grant.slug}`,
    keywords: [...grant.category, ...grant.topic, ...grant.tags],
    type: "article",
    robots: {
      index: isIndexableGrantSlug(grant.slug),
      follow: true,
    },
  });
}

export default async function GrantDetailPage({ params }: GrantDetailPageProps) {
  const { slug } = await params;
  const grant = await getGrantBySlug(slug);

  if (!grant) {
    notFound();
  }

  const relatedGrants = await getRelatedGrants(grant, 3);
  const relatedGuides = getGuidesForGrant(grant.slug);
  const primaryCategory = categoryMap[grant.category[0] as GrantCategory];
  const primaryTopic = topicMap[grant.topic[0] as GrantTopic];
  const coreDecisionGuide = getCoreDecisionGuide(grant.slug);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: grant.name,
      description: grant.summary,
      url: absoluteUrl(`/grant/${grant.slug}`),
      inLanguage: "ko-KR",
      dateModified: grant.last_updated,
      citation: grant.editorial?.evidence.map((item) => item.url),
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
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>제도 핵심</h2>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.8 }}>{grant.overview}</p>
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>신청 자격과 기본 조건</h2>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.8 }}>연령 기준: {getAgeLabel(grant)}</p>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.8 }}>소득 기준: {grant.target.income}</p>
            <DetailList items={grant.target.conditions} />
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>받을 수 있는 혜택</h2>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.8 }}>
              {grant.benefit.amount} / {grant.benefit.duration} / {grant.benefit.type}
            </p>
            <DetailList items={grant.benefit_details} />
          </div>

          {coreDecisionGuide ? <CoreDecisionGuide guide={coreDecisionGuide} /> : null}

          {grant.editorial ? <GrantEditorialContent editorial={grant.editorial} /> : null}

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>신청 방법</h2>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.8 }}>
              접수 기관: {grant.application_organization}
            </p>
            <DetailList items={grant.application_steps} />
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>필요한 서류</h2>
            <DetailList items={grant.required_documents} />
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>자주 묻는 질문</h2>
            <div style={{ display: "grid", gap: "16px" }}>
              {grant.faq.map((item) => (
                <div
                  key={item.question}
                  style={{
                    padding: "20px",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--color-hairline)",
                    background: "rgba(255,255,255,0.9)",
                  }}
                >
                  <strong style={{ display: "block", fontSize: "17px" }}>{item.question}</strong>
                  <p style={{ margin: "10px 0 0", color: "var(--color-ink-muted)", lineHeight: 1.7 }}>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Button href={grant.apply_url}>공식 신청 바로가기</Button>
            <Button href={grant.source_url} variant="secondary">공식 출처 보기</Button>
            <Button href={`/topic/${grant.topic[0]}`} variant="secondary">{primaryTopic.label} 지원 더 보기</Button>
            <ShareButton
              path={`/grant/${grant.slug}`}
              title={`${grant.name} 신청 방법과 자격 조건`}
              text={grant.summary}
            />
          </div>
        </div>
      </Section>

      {relatedGuides.length > 0 ? (
        <Section surface="parchment" containerSize="wide">
          <RelatedGuides guides={relatedGuides} />
        </Section>
      ) : null}

      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "24px" }}>
          <div>
            <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>함께 보면 좋은 지원금</p>
            <h2 style={{ margin: "12px 0 0", fontSize: "var(--text-display-size)", lineHeight: 1.1, fontWeight: 600 }}>
              지원 목적이 이어지는 제도도 함께 확인하세요
            </h2>
            <p style={{ margin: "10px 0 0", color: "var(--color-ink-muted)" }}>
              추천 항목은 동시 수급을 보장하지 않으므로 각 제도의 자격과 중복 기준을 별도로 확인하세요.
            </p>
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
              현재 데이터 기준으로는 자동 추천된 유사 지원금이 많지 않습니다.
            </p>
          ) : null}
        </div>
      </Section>
    </main>
  );
}
