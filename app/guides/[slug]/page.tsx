import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/section";
import { StructuredData } from "@/components/seo/structured-data";
import { Button } from "@/components/ui/button";
import { absoluteUrl, createMetadata } from "@/lib/seo/metadata";
import { getGuideBySlug, getGuideSlugs } from "@/lib/guides";
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    inLanguage: "ko-KR",
    mainEntityOfPage: absoluteUrl(`/guides/${guide.slug}`),
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
              이 가이드는 {guide.audience}를 기준으로 이해하기 쉽게 정리했습니다.
            </p>
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

      <Section surface="parchment" containerSize="text">
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