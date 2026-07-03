import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "서비스 소개",
  description: "지원바다가 어떤 기준으로 정부지원금 정보를 정리하고 전달하는지 소개합니다.",
  path: "/about",
  keywords: ["서비스 소개", "운영 원칙"],
});

const principles = [
  {
    title: "쉬운 설명",
    body: "공고 원문을 그대로 복붙하지 않고, 신청자가 먼저 이해해야 할 조건과 혜택을 더 쉬운 말로 정리합니다.",
  },
  {
    title: "빠른 탐색",
    body: "대상별, 분야별, 자격 체크 흐름을 분리해 처음 방문한 사람도 길을 잃지 않게 설계합니다.",
  },
  {
    title: "공식 정보 우선",
    body: "모든 상세 페이지에서 공식 출처와 신청 링크를 함께 제공해 최종 확인 동선을 짧게 유지합니다.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "20px", maxWidth: "760px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>서비스 소개</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)", lineHeight: 1.07, fontWeight: 600 }}>
            지원바다는 복잡한 정부지원금 탐색을 더 간단하게 만듭니다
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "var(--text-subhead-size)", lineHeight: 1.5 }}>
            공공 정책 정보를 이해하기 어려운 문제를 줄이기 위해, 지원 대상과 신청 흐름 중심으로 다시 정리한 가이드형 서비스입니다.
          </p>
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        <div style={{ display: "grid", gap: "20px" }}>
          {principles.map((item) => (
            <article
              key={item.title}
              style={{
                display: "grid",
                gap: "10px",
                padding: "24px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-hairline)",
                background: "rgba(255,255,255,0.88)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>{item.title}</h2>
              <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>{item.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "16px", justifyItems: "start", maxWidth: "720px" }}>
          <h2 style={{ margin: 0, fontSize: "var(--text-display-size)", lineHeight: 1.1, fontWeight: 600 }}>
            안내 서비스이기 때문에 최종 신청 전 공식 공고 확인은 꼭 필요합니다
          </h2>
          <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
            지원바다는 정보 탐색을 돕는 서비스이며, 실제 자격 판정과 접수 결과는 각 운영 기관 기준을 따릅니다.
          </p>
          <Button href="/contact">문의하기</Button>
        </div>
      </Section>
    </main>
  );
}