import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main>
      <Section surface="light" containerSize="text">
        <div style={{ display: "grid", gap: "18px", justifyItems: "start" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>404</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)", lineHeight: 1.07, fontWeight: 600 }}>
            찾으시는 지원금 페이지가 없습니다
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
            잘못된 주소이거나 아직 연결되지 않은 상세 페이지일 수 있습니다. 홈이나 목록 페이지에서 다시 탐색해보세요.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Button href="/">홈으로 이동</Button>
            <Link href="/category/youth" style={{ color: "var(--color-primary)", fontSize: "17px", alignSelf: "center" }}>
              청년 지원금 보기
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
