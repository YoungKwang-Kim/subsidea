import Link from "next/link";
import { Section } from "@/components/layout/section";
import { StructuredData } from "@/components/seo/structured-data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { absoluteUrl, createMetadata } from "@/lib/seo/metadata";
import { getGuides } from "@/lib/guides";
import { siteConfig } from "@/lib/constants/site";

const copy = {
  title: "지원금 해설 가이드",
  description:
    "지원금 제도를 처음 이해할 때 도움이 되는 해설형 콘텐츠를 모았습니다. 청년, 주거, 소상공인, 신청 서류와 실수 방지 팁까지 한 번에 확인할 수 있습니다.",
  eyebrow: "해설 가이드",
  action: "지원금 찾으러 가기",
};

export const metadata = createMetadata({
  title: copy.title,
  description: copy.description,
  path: "/guides",
  keywords: ["지원금 가이드", "신청 팁", "서류 준비", "청년 지원금"],
});

export default function GuidesPage() {
  const guides = getGuides();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: copy.title,
    description: copy.description,
    url: absoluteUrl("/guides"),
    inLanguage: "ko-KR",
    publisher: {
      "@type": "Organization",
      name: siteConfig.organizationName,
      url: absoluteUrl("/"),
    },
  };

  return (
    <main>
      <StructuredData data={structuredData} />

      <Section surface="light" containerSize="wide">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          action={<Button href="/search">{copy.action}</Button>}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
            marginTop: "32px",
          }}
        >
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              style={{
                display: "grid",
                gap: "14px",
                padding: "28px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-divider-soft)",
                background: "rgba(255, 255, 255, 0.86)",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
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
                <span style={{ color: "var(--color-ink-muted)", fontSize: "13px", lineHeight: 1.4 }}>
                  {guide.readingTime}
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: "28px", lineHeight: 1.2, fontWeight: 600 }}>{guide.title}</h2>
              <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "17px", lineHeight: 1.65 }}>
                {guide.description}
              </p>
              <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "14px", lineHeight: 1.6 }}>
                추천 대상: {guide.audience}
              </p>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}