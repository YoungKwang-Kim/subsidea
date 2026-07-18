import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "서비스 소개",
  description: "지원바다가 어떤 기준으로 정부지원금 정보를 정리하고 안내하는지 소개합니다.",
  path: "/about",
  keywords: ["서비스 소개", "운영 원칙"],
});

const principles = [
  {
    title: "쉬운 설명",
    body: "공고문 표현을 그대로 옮기는 데서 끝나지 않고, 신청 전에 이해해야 할 조건과 주의사항을 더 쉬운 문장으로 정리합니다.",
  },
  {
    title: "빠른 탐색",
    body: "대상별, 분야별, 자격 체크 흐름을 통해 처음 방문한 사용자도 자신에게 맞는 지원금을 빠르게 찾을 수 있도록 돕습니다.",
  },
  {
    title: "공식 정보 우선",
    body: "모든 상세 페이지에서 공식 공고와 신청 링크를 함께 제공하며, 최종 신청 전에는 반드시 원문 공고를 다시 확인하도록 안내합니다.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "20px", maxWidth: "760px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>서비스 소개</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)", lineHeight: 1.07, fontWeight: 600 }}>
            지원바다는 복잡한 정부지원금 탐색을 더 쉽게 만들기 위한 안내형 서비스입니다.
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "var(--text-subhead-size)", lineHeight: 1.5 }}>
            흩어져 있는 공공 지원 정보를 한곳에 모아, 대상과 신청 흐름 중심으로 다시 정리합니다. 사용자가 본인에게 맞는 지원금을
            스스로 판단할 수 있도록 이해를 돕는 설명을 제공하는 것이 목표입니다.
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
            안내형 서비스이므로 최종 신청 전에는 공식 공고를 반드시 확인해야 합니다.
          </h2>
          <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
            지원바다는 정보를 이해하기 쉽게 정리해 주는 서비스이며, 실제 자격 판정과 접수 결과는 각 지원 사업의 운영 기관 기준을
            따릅니다.
          </p>
          <Button href="/contact">문의하기</Button>
        </div>
      </Section>
    </main>
  );
}