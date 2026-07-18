import Link from "next/link";
import { StructuredData } from "@/components/seo/structured-data";
import { GrantCard } from "@/components/grants/grant-card";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIsoDate } from "@/lib/formatters/date";
import { getGuides } from "@/lib/guides";
import { getClosingGrants, getFeaturedGrants } from "@/lib/grants/get-grants";
import { categoryMap } from "@/lib/grants/taxonomy";
import { absoluteUrl, createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/constants/site";
import { getUpdates } from "@/lib/updates/get-updates";

const quickLinks = ["youth", "family", "business"] as const;
const updateTypeLabelMap = {
  new: "신규",
  changed: "변경",
  closing: "마감",
} as const;

const copy = {
  metadataTitle: "정부지원금 메인",
  metadataDescription:
    "내게 맞는 정부지원금을 검색, 탐색, 자격 체크 흐름으로 빠르게 확인할 수 있습니다.",
  eyebrow: "정부지원금 가이드",
  heroTitle: "내게 맞는 정부지원금을 지금 바로 찾아보세요",
  heroDescription:
    "흩어진 공공 지원 정보를 한곳에 모아, 더 쉬운 말과 더 빠른 탐색으로 다시 정리합니다.",
  popularEyebrow: "인기 지원금",
  popularTitle: "이번 달 가장 많이 찾는 지원금",
  popularDescription:
    "많이 찾는 지원금을 먼저 모아 보고, 내 상황에 맞는 항목을 빠르게 비교할 수 있게 준비했습니다.",
  categoryAction: "대상별 보기",
  closingEyebrow: "마감 임박",
  closingTitle: "신청 기한을 놓치기 쉬운 지원금",
  closingDescription:
    "지금 신청해야 할 정책을 먼저 확인하고, 마감 전에 공식 안내까지 바로 이어지게 돕습니다.",
  latestEyebrow: "최신 업데이트",
  latestTitle: "새로 생기거나 바뀐 정책을 빠르게 확인",
  latestDescription:
    "신규 지원, 조건 변경, 마감 소식을 한곳에서 보고 필요한 정보로 바로 이동할 수 있습니다.",
  updatesAction: "업데이트 보기",
  guidesEyebrow: "해설 가이드",
  guidesTitle: "지원금 이해를 돕는 읽을거리",
  guidesDescription:
    "단순 목록이 아니라 신청 전에 알아두면 좋은 기준과 실수 방지 팁을 해설형 콘텐츠로 정리했습니다.",
  guidesAction: "가이드 전체 보기",
  checkerEyebrow: "자격 체크",
  checkerTitle: "내가 받을 수 있는 지원금을 설문형 흐름으로 바로 찾기",
  checkerAction: "자격 체크 시작하기",
} as const;

export const metadata = createMetadata({
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  path: "/",
  keywords: ["메인", "지원금 추천", "자격 체크"],
});

export default async function HomePage() {
  const [featuredGrants, closingGrants, updates] = await Promise.all([
    getFeaturedGrants(3),
    getClosingGrants(3),
    getUpdates(),
  ]);
  const guides = getGuides().slice(0, 3);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.organizationName,
      url: absoluteUrl("/"),
      description: siteConfig.description,
      email: siteConfig.contactEmail,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: absoluteUrl("/"),
      description: siteConfig.description,
      inLanguage: "ko-KR",
      potentialAction: {
        "@type": "SearchAction",
        target: `${absoluteUrl("/search")}?query={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <main>
      <StructuredData data={structuredData} />

      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "32px", alignItems: "center" }}>
          <div style={{ maxWidth: "760px" }}>
            <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px", lineHeight: 1.43 }}>
              {copy.eyebrow}
            </p>
            <h1
              className="text-keep"
              style={{
                margin: "16px 0 0",
                maxWidth: "13ch",
                fontSize: "var(--text-hero-size)",
                lineHeight: 1.07,
                letterSpacing: "-0.28px",
                fontWeight: 600,
              }}
            >
              {copy.heroTitle}
            </h1>
            <p
              className="text-pretty text-keep"
              style={{
                margin: "18px 0 0",
                maxWidth: "22em",
                color: "var(--color-ink-muted)",
                fontSize: "var(--text-subhead-size)",
                lineHeight: 1.5,
              }}
            >
              {copy.heroDescription}
            </p>
          </div>

          <div style={{ display: "grid", gap: "16px", maxWidth: "760px" }}>
            <SearchInput />
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {quickLinks.map((key) => (
                <Button key={key} href={`/category/${key}`} variant="secondary" size="sm">
                  {categoryMap[key].label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        <SectionHeading
          eyebrow={copy.popularEyebrow}
          title={copy.popularTitle}
          description={copy.popularDescription}
          action={
            <Button href="/category/youth" variant="secondary">
              {copy.categoryAction}
            </Button>
          }
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--grid-gap)",
            marginTop: "32px",
          }}
        >
          {featuredGrants.map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </div>
      </Section>

      <Section surface="dark" containerSize="wide">
        <SectionHeading
          eyebrow={copy.closingEyebrow}
          title={copy.closingTitle}
          description={copy.closingDescription}
        />
        <div style={{ display: "grid", gap: "16px", marginTop: "32px" }}>
          {closingGrants.map((grant) => (
            <Link
              key={grant.id}
              href={`/grant/${grant.slug}`}
              style={{
                display: "grid",
                gap: "12px",
                padding: "24px",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "var(--radius-lg)",
                background: "rgba(255, 255, 255, 0.02)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "start" }}>
                <div>
                  <p style={{ margin: 0, color: "var(--color-primary-on-dark)", fontSize: "12px" }}>
                    {grant.category.join(" · ")}
                  </p>
                  <h3 style={{ margin: "10px 0 0", fontSize: "28px", lineHeight: 1.14, fontWeight: 600 }}>
                    {grant.name}
                  </h3>
                </div>
                <StatusBadge status={grant.status} />
              </div>
              <p style={{ margin: 0, color: "var(--color-body-muted-dark)" }}>{grant.summary}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section surface="light" containerSize="wide">
        <SectionHeading
          eyebrow={copy.latestEyebrow}
          title={copy.latestTitle}
          description={copy.latestDescription}
          action={
            <Button href="/updates" variant="secondary">
              {copy.updatesAction}
            </Button>
          }
        />
        <div style={{ display: "grid", gap: "12px", marginTop: "32px" }}>
          {updates.slice(0, 4).map((update) => (
            <Link
              key={update.id}
              href={`/grant/${update.grant_slug}`}
              style={{
                display: "grid",
                gap: "6px",
                padding: "20px 0",
                borderBottom: "1px solid var(--color-divider-soft)",
              }}
            >
              <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "12px" }}>
                [{updateTypeLabelMap[update.type]}] {formatIsoDate(update.published_at)}
              </p>
              <strong style={{ fontSize: "21px", lineHeight: 1.24 }}>{update.title}</strong>
              <span style={{ color: "var(--color-ink-muted)" }}>
                {update.type === "closing"
                  ? "마감 일정과 신청 가능 여부를 먼저 확인해 보세요."
                  : "변경된 조건과 신청 방법을 상세 페이지에서 바로 확인해 보세요."}
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        <SectionHeading
          eyebrow={copy.guidesEyebrow}
          title={copy.guidesTitle}
          description={copy.guidesDescription}
          action={
            <Button href="/guides" variant="secondary">
              {copy.guidesAction}
            </Button>
          }
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
                gap: "12px",
                padding: "28px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-divider-soft)",
                background: "rgba(255, 255, 255, 0.86)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <span style={{ color: "var(--color-primary)", fontSize: "13px", lineHeight: 1.4 }}>
                  {guide.category}
                </span>
                <span style={{ color: "var(--color-ink-muted)", fontSize: "13px", lineHeight: 1.4 }}>
                  {guide.readingTime}
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: "26px", lineHeight: 1.22, fontWeight: 600 }}>{guide.title}</h3>
              <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "16px", lineHeight: 1.7 }}>
                {guide.description}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        <div style={{ display: "grid", gap: "18px", justifyItems: "start" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>{copy.checkerEyebrow}</p>
          <h2
            className="text-keep"
            style={{
              margin: 0,
              maxWidth: "640px",
              fontSize: "var(--text-display-size)",
              lineHeight: 1.1,
              fontWeight: 600,
            }}
          >
            {copy.checkerTitle}
          </h2>
          <Button href="/checker">{copy.checkerAction}</Button>
        </div>
      </Section>
    </main>
  );
}