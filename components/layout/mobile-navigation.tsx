"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/layout/container";
import { primaryLinks } from "@/components/layout/navigation-links";
import { Button } from "@/components/ui/button";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"}
        onClick={() => setIsOpen((current) => !current)}
        className="mobile-nav-button"
      >
        {isOpen ? "닫기" : "메뉴"}
      </button>

      {isOpen ? (
        <div className="mobile-nav-panel">
          <Container size="wide">
            <nav
              id="mobile-navigation"
              aria-label="모바일 메뉴"
              className="mobile-nav-links"
            >
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="mobile-nav-link"
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
    </>
  );
}
