import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";

export default function AuthErrorPage() {
  return (
    <main>
      <Section surface="light" containerSize="text">
        <div style={{ display: "grid", gap: "18px", justifyItems: "start" }}>
          <p style={{ margin: 0, color: "var(--color-primary)" }}>로그인 안내</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)" }}>
            Google 로그인을 완료하지 못했습니다
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
            잠시 후 다시 시도해주세요. 같은 문제가 반복되면 문의 페이지에서
            알려주세요.
          </p>
          <Button href="/" variant="primary">
            홈으로 돌아가기
          </Button>
        </div>
      </Section>
    </main>
  );
}
