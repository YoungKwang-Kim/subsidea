import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { primaryLinks } from "@/components/layout/navigation-links";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants/site";

export function Header() {
  return (
    <header className="site-header">
      <Container size="wide">
        <div className="site-header-row">
          <Link href="/" className="site-brand">
            <Image
              src="/logo-image.png"
              alt={siteConfig.name + " 로고"}
              width={30}
              height={30}
              priority
              className="site-brand-image"
            />
            <span className="site-brand-name">{siteConfig.name}</span>
          </Link>

          <nav aria-label="주요 메뉴" className="desktop-nav site-desktop-nav">
            {primaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="site-nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="site-header-actions">
            <div className="desktop-nav">
              <Button href="/checker" variant="primary" size="sm">
                지원금 찾기
              </Button>
            </div>
            <MobileNavigation />
          </div>
        </div>
      </Container>
    </header>
  );
}
