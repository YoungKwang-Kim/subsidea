import Link from "next/link";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/lib/constants/site";

const footerGroups = [
  {
    title: "탐색",
    links: [
      { href: "/category/youth", label: "청년 지원금" },
      { href: "/category/family", label: "신혼부부·출산" },
      { href: "/category/business", label: "소상공인" },
    ],
  },
  {
    title: "분야",
    links: [
      { href: "/topic/housing", label: "주거" },
      { href: "/topic/employment", label: "취업·창업" },
      { href: "/topic/education", label: "교육" },
    ],
  },
  {
    title: "서비스",
    links: [
      { href: "/checker", label: "자격체크" },
      { href: "/updates", label: "업데이트" },
      { href: "/about", label: "서비스 소개" },
      { href: "/contact", label: "문의하기" },
    ],
  },
  {
    title: "정책",
    links: [
      { href: "/privacy", label: "개인정보처리방침" },
      { href: "/terms", label: "이용약관" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-canvas-parchment)",
        borderTop: "1px solid var(--color-divider-soft)",
        color: "var(--color-ink-strong)",
      }}
    >
      <Container size="wide">
        <div style={{ paddingBlock: "56px 32px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              lineHeight: 1.33,
              letterSpacing: "-0.12px",
              color: "var(--color-ink-muted)",
            }}
          >
            {siteConfig.name}는 정부지원금 정보를 쉽게 이해하도록 돕는 가이드형 서비스입니다.
            실제 신청 전에는 공식 기관 안내를 반드시 함께 확인하세요.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "24px",
              marginTop: "32px",
            }}
          >
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    lineHeight: 1.29,
                    letterSpacing: "-0.224px",
                  }}
                >
                  {group.title}
                </h2>
                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                    marginTop: "16px",
                  }}
                >
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      style={{
                        color: "var(--color-ink-muted)",
                        fontSize: "17px",
                        lineHeight: 1.47,
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              marginTop: "40px",
              paddingTop: "20px",
              borderTop: "1px solid var(--color-divider-soft)",
              color: "var(--color-ink-muted-light)",
              fontSize: "12px",
              lineHeight: 1.33,
            }}
          >
            <span>© 2026 {siteConfig.name}</span>
            <span>{siteConfig.domain}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}