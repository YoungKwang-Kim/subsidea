import { Section } from "@/components/layout/section";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "이용약관",
  description: "지원바다 서비스 이용 시 적용되는 기본 원칙과 책임 범위를 안내합니다.",
  path: "/terms",
  keywords: ["이용약관", "서비스 이용"],
});

const terms = [
  {
    title: "1. 서비스 성격",
    body: "지원바다는 정부지원금 탐색을 돕는 정보 안내 서비스이며, 실제 신청 접수나 자격 판정 기능을 직접 제공하지 않습니다.",
  },
  {
    title: "2. 정보 이용 시 유의사항",
    body: "사이트에 정리된 내용은 이해를 돕기 위한 요약 정보이므로, 최종 신청 전에는 반드시 공식 기관 공고를 다시 확인해야 합니다.",
  },
  {
    title: "3. 외부 링크",
    body: "공식 신청 페이지와 출처 링크는 외부 사이트로 연결되며, 해당 사이트의 운영 정책과 변경 사항은 각 기관이 관리합니다.",
  },
  {
    title: "4. 서비스 변경",
    body: "운영 상황에 따라 일부 기능, 데이터 구성, 디자인은 예고 후 또는 필요시 즉시 조정될 수 있습니다.",
  },
];

export default function TermsPage() {
  return (
    <main>
      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "20px", maxWidth: "760px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>이용약관</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)", lineHeight: 1.07, fontWeight: 600 }}>
            정보 안내 서비스로서의 이용 기준과 책임 범위
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "var(--text-subhead-size)", lineHeight: 1.5 }}>
            사용자가 서비스를 신뢰하되 과신하지 않도록, 안내 서비스의 역할과 한계를 명확히 적어두었습니다.
          </p>
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        <div style={{ display: "grid", gap: "20px" }}>
          {terms.map((term) => (
            <article
              key={term.title}
              style={{
                display: "grid",
                gap: "10px",
                padding: "24px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-hairline)",
                background: "rgba(255,255,255,0.88)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>{term.title}</h2>
              <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>{term.body}</p>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}