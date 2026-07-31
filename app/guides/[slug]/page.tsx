import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideComparisonContent } from "@/components/guides/guide-comparison";
import { GrantCard } from "@/components/grants/grant-card";
import { Section } from "@/components/layout/section";
import { StructuredData } from "@/components/seo/structured-data";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { absoluteUrl, createMetadata } from "@/lib/seo/metadata";
import { getGuideBySlug, getGuideSlugs } from "@/lib/guides";
import { getGrantBySlug } from "@/lib/grants/get-grants";
import type { Grant } from "@/types/grant";
import { siteConfig } from "@/lib/constants/site";

export async function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return createMetadata({
      title: "가이드를 찾을 수 없습니다",
      description: "요청한 해설 가이드를 찾지 못했습니다.",
      path: `/guides/${slug}`,
    });
  }

  return createMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    keywords: [guide.category, guide.audience, "지원금 가이드"],
  });
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedGrants = (
    await Promise.all((guide.relatedGrantSlugs ?? []).map((grantSlug) => getGrantBySlug(grantSlug)))
  ).filter((grant): grant is Grant => Boolean(grant));

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    inLanguage: "ko-KR",
    mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`),
    citation: guide.sources?.map((sourceItem) => sourceItem.url),
    author: {
      "@type": "Organization",
      name: siteConfig.organizationName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.organizationName,
      url: absoluteUrl("/"),
    },
  };

  return (
    <main>
      <StructuredData data={structuredData} />

      <Section surface="light" containerSize="text">
        <div style={{ display: "grid", gap: "18px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <span
              style={{
                display: "inline-flex",
                padding: "6px 10px",
                borderRadius: "999px",
                background: "rgba(13, 110, 253, 0.08)",
                color: "var(--color-primary)",
                fontSize: "12px",
                lineHeight: 1.33,
              }}
            >
              {guide.category}
            </span>
            <span style={{ color: "var(--color-ink-muted)", fontSize: "14px" }}>
              읽는 시간 {guide.readingTime}
            </span>
            <span style={{ color: "var(--color-ink-muted)", fontSize: "14px" }}>
              업데이트 {guide.updatedAt}
            </span>
          </div>

          <div style={{ display: "grid", gap: "14px" }}>
            <h1 style={{ margin: 0, fontSize: "clamp(2.1rem, 4vw, 3.5rem)", lineHeight: 1.12, fontWeight: 600 }}>
              {guide.title}
            </h1>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "18px", lineHeight: 1.7 }}>
              {guide.description}
            </p>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "15px", lineHeight: 1.6 }}>
              이 가이드는 {guide.audience}에게 필요한 내용을 이해하기 쉽게 정리했습니다.
            </p>
            <ShareButton
              path={`/guides/${guide.slug}`}
              title={guide.title}
              text={guide.description}
            />
          </div>
        </div>
      </Section>

      <Section surface="parchment" containerSize="text">
        <div
          style={{
            display: "grid",
            gap: "14px",
            padding: "28px",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-divider-soft)",
            background: "rgba(255, 255, 255, 0.82)",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "24px", lineHeight: 1.25, fontWeight: 600 }}>핵심 요약</h2>
          <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gap: "10px", color: "var(--color-ink-muted)", lineHeight: 1.7 }}>
            {guide.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>

      {guide.comparison ? (
        <Section surface="light" containerSize="wide">
          <GuideComparisonContent comparison={guide.comparison} />
        </Section>
      ) : null}

      <Section surface="light" containerSize="text">
        <div style={{ display: "grid", gap: "20px" }}>
          {guide.sections.map((section) => (
            <article
              key={section.title}
              style={{
                display: "grid",
                gap: "14px",
                paddingBottom: "24px",
                borderBottom: "1px solid var(--color-divider-soft)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "28px", lineHeight: 1.24, fontWeight: 600 }}>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "17px", lineHeight: 1.8 }}>
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gap: "10px", color: "var(--color-ink-muted)", lineHeight: 1.7 }}>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </Section>

      {relatedGrants.length > 0 ? (
        <Section surface="light" containerSize="wide">
          <div style={{ display: "grid", gap: "24px" }}>
            <div style={{ display: "grid", gap: "8px" }}>
              <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>가이드에서 다룬 지원금</p>
              <h2 style={{ margin: 0, fontSize: "var(--text-display-size)", lineHeight: 1.12, fontWeight: 600 }}>
                세부 자격과 신청 방법 확인하기
              </h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                gap: "var(--grid-gap)",
              }}
            >
              {relatedGrants.map((grant) => (
                <GrantCard key={grant.id} grant={grant} />
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {guide.sources && guide.sources.length > 0 ? (
        <Section surface="parchment" containerSize="text">
          <div style={{ display: "grid", gap: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "24px", lineHeight: 1.25, fontWeight: 600 }}>
              공식 근거와 확인일
            </h2>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.7 }}>
              아래 공식 기관 자료를 기준으로 내용을 검토했습니다. 공고가 변경될 수 있으므로 신청 직전 다시 확인하세요.
            </p>
            <div style={{ display: "grid", gap: "12px" }}>
              {guide.sources.map((sourceItem) => (
                <a
                  key={sourceItem.url}
                  href={sourceItem.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "grid",
                    gap: "5px",
                    padding: "16px 0",
                    borderBottom: "1px solid var(--color-divider-soft)",
                    color: "var(--color-primary)",
                  }}
                >
                  <strong>{sourceItem.title}</strong>
                  <span style={{ color: "var(--color-ink-muted)", fontSize: "14px" }}>
                    확인일 {sourceItem.checkedAt}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <Section surface="light" containerSize="text">
        <div style={{ display: "grid", gap: "14px", justifyItems: "start" }}>
          <h2 style={{ margin: 0, fontSize: "24px", lineHeight: 1.25, fontWeight: 600 }}>
            실제 신청 전에는 공식 공고를 함께 확인하세요
          </h2>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "16px", lineHeight: 1.7 }}>
            이 페이지는 제도 이해를 돕기 위한 해설 콘텐츠입니다. 최종 자격, 접수 일정, 제출 서류는 공식 기관 공고문을 기준으로 다시 확인하는 것이 안전합니다.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Button href="/search">지원금 다시 찾기</Button>
            <Button href="/guides" variant="secondary">다른 가이드 보기</Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
