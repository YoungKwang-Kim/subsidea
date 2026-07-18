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

function AdviceCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article
      style={{
        display: "grid",
        gap: "12px",
        padding: "24px",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-hairline)",
        background: "rgba(255,255,255,0.9)",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>{title}</h3>
      <DetailList items={items} />
    </article>
  );
}

function getWhoShouldRead(grant: Grant, categoryLabel: string, topicLabel: string): string[] {
  const items = [
    `${categoryLabel} 지원을 찾고 있고 ${topicLabel} 관련 부담을 줄이고 싶은 분`,
    `${grant.target.income} 기준을 먼저 확인해 볼 필요가 있는 분`,
  ];

  if (grant.target.age_min && grant.target.age_max) {
    items.unshift(`${grant.target.age_min}세부터 ${grant.target.age_max}세 사이 조건에 해당하는 분`);
  } else if (grant.target.age_min) {
    items.unshift(`${grant.target.age_min}세 이상 조건에 해당하는 분`);
  }

  return items;
}

function getPreparationTips(grant: Grant): string[] {
  return [
    `${grant.application_organization} 안내 기준을 먼저 확인하고 접수 가능 기간을 체크하세요.`,
    `필수 서류인 ${grant.required_documents.slice(0, 2).join(", ")} 준비 여부를 먼저 확인하세요.`,
    grant.target.conditions[0] ?? "세부 자격 조건은 공식 공고문 기준으로 다시 확인하세요.",
  ];
}

function getMissablePoints(grant: Grant): string[] {
  return [
    "지원금 이름만 보고 신청 가능하다고 판단하지 말고, 가구 기준과 소득 기준을 함께 확인하세요.",
    "중복 수혜 제한이나 지역별 추가 기준이 있을 수 있으므로 공식 공고의 제외 대상을 꼭 확인하세요.",
    grant.benefit_details[0] ?? "지급 방식과 실제 수령 가능 범위는 공고마다 달라질 수 있습니다.",
  ];
}

function getComparisonTips(grant: Grant, topicLabel: string): string[] {
  return [
    `${topicLabel} 관련 다른 지원금과 비교할 때는 지급 금액보다 신청 가능 조건과 지급 방식을 먼저 보세요.`,
    "비슷한 제도라도 현금, 바우처, 대출, 이자 지원처럼 성격이 다를 수 있으니 사용 목적이 맞는지 확인하세요.",
    `현재 페이지 하단의 관련 지원금도 함께 비교해 보면 비슷한 조건의 다른 제도를 찾는 데 도움이 됩니다.`,
  ];
}

function getOfficialSourceTips(grant: Grant): string[] {
  return [
    "최종 신청 전에는 반드시 공식 공고문과 신청 페이지를 직접 확인하세요.",
    "접수 기간, 서류 양식, 제출 방법은 수시로 바뀔 수 있으므로 저장해 둔 정보만 믿고 진행하지 않는 것이 안전합니다.",
    `이 페이지의 공식 링크는 ${grant.application_organization} 또는 출처 기관 기준으로 연결됩니다.`,
  ];
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
  const whoShouldRead = getWhoShouldRead(grant, primaryCategory.label, primaryTopic.label);
  const preparationTips = getPreparationTips(grant);
  const missablePoints = getMissablePoints(grant);
  const comparisonTips = getComparisonTips(grant, primaryTopic.label);
  const officialSourceTips = getOfficialSourceTips(grant);

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
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>1. 이 지원금은 어떤 제도인가요?</h2>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.8 }}>{grant.overview}</p>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.8 }}>
              이 페이지는 {grant.name}의 핵심 조건, 준비 서류, 신청 전에 꼭 봐야 할 포인트를 빠르게 확인할 수 있도록 정리한 안내 페이지입니다.
            </p>
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>2. 어떤 분이 먼저 확인하면 좋을까요?</h2>
            <DetailList items={whoShouldRead} />
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>3. 신청 자격과 기본 조건</h2>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.8 }}>연령 기준: {getAgeLabel(grant)}</p>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.8 }}>소득 기준: {grant.target.income}</p>
            <DetailList items={grant.target.conditions} />
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>4. 받을 수 있는 혜택</h2>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.8 }}>
              {grant.benefit.amount} / {grant.benefit.duration} / {grant.benefit.type}
            </p>
            <DetailList items={grant.benefit_details} />
          </div>

          <div style={{ display: "grid", gap: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>5. 신청 전에 꼭 확인할 내용</h2>
            <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              <AdviceCard title="준비하면 좋은 것" items={preparationTips} />
              <AdviceCard title="자주 놓치는 포인트" items={missablePoints} />
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>6. 신청 방법</h2>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.8 }}>
              접수 기관: {grant.application_organization}
            </p>
            <DetailList items={grant.application_steps} />
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>7. 필요한 서류</h2>
            <DetailList items={grant.required_documents} />
          </div>

          <div style={{ display: "grid", gap: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>8. 비교해서 보면 좋은 포인트</h2>
            <AdviceCard title="비슷한 지원금과 비교하는 기준" items={comparisonTips} />
          </div>

          <div style={{ display: "grid", gap: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>9. 공식 공고에서 꼭 확인하세요</h2>
            <AdviceCard title="최종 신청 전 체크" items={officialSourceTips} />
          </div>

          <div style={{ display: "grid", gap: "12px", maxWidth: "var(--max-width-text)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>10. 자주 묻는 질문</h2>
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
          </div>
        </div>
      </Section>

      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "24px" }}>
          <div>
            <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>함께 보면 좋은 지원금</p>
            <h2 style={{ margin: "12px 0 0", fontSize: "var(--text-display-size)", lineHeight: 1.1, fontWeight: 600 }}>
              비슷한 조건에서 비교해 볼 수 있는 제도
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
              현재 데이터 기준으로는 자동 추천된 유사 지원금이 많지 않습니다.
            </p>
          ) : null}
        </div>
      </Section>
    </main>
  );
}