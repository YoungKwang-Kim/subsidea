import Link from "next/link";
import { StructuredData } from "@/components/seo/structured-data";
import { GrantCard } from "@/components/grants/grant-card";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatIsoDate } from "@/lib/formatters/date";
import {
  getClosingGrants,
  getFeaturedGrants,
} from "@/lib/grants/get-grants";
import { categoryMap } from "@/lib/grants/taxonomy";
import { absoluteUrl, createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/constants/site";
import { getUpdates } from "@/lib/updates/get-updates";

const quickLinks = ["youth", "family", "business"] as const;
const updateTypeLabelMap = {
  new: "\uC2E0\uADDC",
  changed: "\uBCC0\uACBD",
  closing: "\uB9C8\uAC10",
} as const;

const copy = {
  metadataTitle: "\uC815\uBD80\uC9C0\uC6D0\uAE08 \uBA54\uC778",
  metadataDescription:
    "\uB0B4\uAC8C \uB9DE\uB294 \uC815\uBD80\uC9C0\uC6D0\uAE08\uC744 \uAC80\uC0C9, \uD0D0\uC0C9, \uC790\uACA9 \uCCB4\uD06C \uD750\uB984\uC73C\uB85C \uBE60\uB974\uAC8C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  eyebrow: "\uC815\uBD80\uC9C0\uC6D0\uAE08 \uAC00\uC774\uB4DC",
  heroTitle: "\uB0B4\uAC8C \uB9DE\uB294 \uC815\uBD80\uC9C0\uC6D0\uAE08\uC744 \uC9C0\uAE08 \uBC14\uB85C \uCC3E\uC544\uBCF4\uC138\uC694",
  heroDescription:
    "\uD769\uC5B4\uC9C4 \uACF5\uACF5 \uC9C0\uC6D0 \uC815\uBCF4\uB97C \uD55C\uACF3\uC5D0 \uBAA8\uC544, \uB354 \uC26C\uC6B4 \uB9D0\uACFC \uB354 \uBE60\uB978 \uD0D0\uC0C9\uC73C\uB85C \uB2E4\uC2DC \uC815\uB9AC\uD569\uB2C8\uB2E4.",
  popularEyebrow: "\uC778\uAE30 \uC9C0\uC6D0\uAE08",
  popularTitle: "\uC774\uBC88 \uB2EC \uAC00\uC7A5 \uB9CE\uC774 \uCC3E\uB294 \uC9C0\uC6D0\uAE08",
  popularDescription:
    "\uB9CE\uC774 \uCC3E\uB294 \uC9C0\uC6D0\uAE08\uC744 \uBA3C\uC800 \uBAA8\uC544 \uBCF4\uACE0, \uB0B4 \uC0C1\uD669\uC5D0 \uB9DE\uB294 \uD56D\uBAA9\uC744 \uBE60\uB974\uAC8C \uBE44\uAD50\uD560 \uC218 \uC788\uAC8C \uC900\uBE44\uD588\uC2B5\uB2C8\uB2E4.",
  categoryAction: "\uB300\uC0C1\uBCC4 \uBCF4\uAE30",
  closingEyebrow: "\uB9C8\uAC10 \uC784\uBC15",
  closingTitle: "\uC2E0\uCCAD \uAE30\uD55C\uC744 \uB193\uCE58\uAE30 \uC26C\uC6B4 \uC9C0\uC6D0\uAE08",
  closingDescription:
    "\uC9C0\uAE08 \uC2E0\uCCAD\uD574\uC57C \uD560 \uC815\uCC45\uC744 \uBA3C\uC800 \uD655\uC778\uD558\uACE0, \uB9C8\uAC10 \uC804\uC5D0 \uACF5\uC2DD \uC548\uB0B4\uAE4C\uC9C0 \uBC14\uB85C \uC774\uC5B4\uC9C0\uAC8C \uB3D5\uC2B5\uB2C8\uB2E4.",
  latestEyebrow: "\uCD5C\uC2E0 \uC5C5\uB370\uC774\uD2B8",
  latestTitle: "\uC0C8\uB85C \uC0DD\uAE30\uAC70\uB098 \uBC14\uB010 \uC815\uCC45\uC744 \uBE60\uB974\uAC8C \uD655\uC778",
  latestDescription:
    "\uC2E0\uADDC \uC9C0\uC6D0, \uC870\uAC74 \uBCC0\uACBD, \uB9C8\uAC10 \uC18C\uC2DD\uC744 \uD55C\uACF3\uC5D0\uC11C \uBCF4\uACE0 \uD544\uC694\uD55C \uC815\uBCF4\uB85C \uBC14\uB85C \uC774\uB3D9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  updatesAction: "\uC5C5\uB370\uC774\uD2B8 \uBCF4\uAE30",
  checkerEyebrow: "\uC790\uACA9 \uCCB4\uD06C",
  checkerTitle: "\uB0B4\uAC00 \uBC1B\uC744 \uC218 \uC788\uB294 \uC9C0\uC6D0\uAE08\uC744 \uC124\uBB38\uD615 \uD750\uB984\uC73C\uB85C \uBC14\uB85C \uCC3E\uAE30",
  checkerAction: "\uC790\uACA9 \uCCB4\uD06C \uC2DC\uC791\uD558\uAE30",
} as const;

export const metadata = createMetadata({
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  path: "/",
  keywords: ["\uBA54\uC778", "\uC9C0\uC6D0\uAE08 \uCD94\uCC9C", "\uC790\uACA9 \uCCB4\uD06C"],
});

export default async function HomePage() {
  const [featuredGrants, closingGrants, updates] = await Promise.all([
    getFeaturedGrants(3),
    getClosingGrants(3),
    getUpdates(),
  ]);

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
                {update.type === "closing" ? "마감 일정과 신청 가능 여부를 먼저 확인해보세요." : "변경된 조건과 신청 방법을 상세 페이지에서 바로 확인해보세요."}
              </span>
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