"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants/site";

const primaryLinks = [
  { href: "/", label: "홈" },
  { href: "/category/youth", label: "청년 지원" },
  { href: "/topic/housing", label: "주거 분야" },
  { href: "/guides", label: "해설 가이드" },
  { href: "/checker", label: "자격 체크" },
  { href: "/updates", label: "업데이트" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "saturate(180%) blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <Container size="wide">
        <div
          style={{
            minHeight: "var(--nav-height)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              minWidth: 0,
              color: "var(--color-on-dark)",
              whiteSpace: "nowrap",
            }}
          >
            <Image
              src="/logo-image.png"
              alt={`${siteConfig.name} 로고`}
              width={30}
              height={30}
              priority
              style={{
                borderRadius: "9px",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "12px",
                letterSpacing: "-0.12px",
              }}
            >
              {siteConfig.name}
            </span>
          </Link>

          <nav
            aria-label="주요 메뉴"
            className="desktop-nav"
            style={{ display: "flex", alignItems: "center", gap: "20px" }}
          >
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: "rgba(255, 255, 255, 0.88)",
                  fontSize: "12px",
                  letterSpacing: "-0.12px",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="desktop-nav">
              <Button href="/checker" variant="primary" size="sm">
                지원금 찾기
              </Button>
            </div>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-label="모바일 메뉴 열기"
              onClick={() => setIsOpen((current) => !current)}
              className="mobile-nav-button"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                background: "transparent",
                color: "var(--color-on-dark)",
              }}
            >
              {isOpen ? "닫기" : "메뉴"}
            </button>
          </div>
        </div>
      </Container>

      {isOpen ? (
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            background: "rgba(10, 10, 12, 0.96)",
          }}
        >
          <Container size="wide">
            <nav
              aria-label="모바일 메뉴"
              style={{
                display: "grid",
                gap: "12px",
                paddingBlock: "16px 20px",
              }}
            >
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    color: "var(--color-on-dark)",
                    fontSize: "17px",
                    lineHeight: 1.3,
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <Button href="/checker" variant="primary">
                자격 체크 시작하기
              </Button>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}