import { Section } from "@/components/layout/section";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "개인정보처리방침",
  description: "지원바다 서비스의 개인정보 수집, 이용, 보관 원칙을 안내합니다.",
  path: "/privacy",
  keywords: ["개인정보처리방침", "개인정보"],
});

const sections = [
  {
    title: "1. 수집하는 정보",
    body: "현재 서비스는 회원가입 기능 없이 운영되며, 문의 접수 시 사용자가 직접 제공한 이름, 이메일, 문의 내용만 확인할 수 있습니다.",
  },
  {
    title: "2. 이용 목적",
    body: "문의 응답, 데이터 오류 확인, 서비스 개선 요청 검토를 위해서만 정보를 이용합니다.",
  },
  {
    title: "3. 보관 기간",
    body: "문의 대응이 종료된 후 관련 법령이나 분쟁 대응 필요성이 없는 경우 합리적인 기간 내에 정리합니다.",
  },
  {
    title: "4. 제3자 제공",
    body: "법령상 요구가 있는 경우를 제외하고, 사용자가 제공한 개인정보를 외부에 판매하거나 임의 제공하지 않습니다.",
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "20px", maxWidth: "760px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>개인정보처리방침</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)", lineHeight: 1.07, fontWeight: 600 }}>
            서비스 이용과 문의 과정에서의 개인정보 처리 원칙
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "var(--text-subhead-size)", lineHeight: 1.5 }}>
            최소한의 정보만 확인하고, 안내 서비스 운영에 필요한 범위 안에서만 사용한다는 기준을 유지합니다.
          </p>
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        <div style={{ display: "grid", gap: "20px" }}>
          {sections.map((section) => (
            <article
              key={section.title}
              style={{
                display: "grid",
                gap: "10px",
                padding: "24px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-hairline)",
                background: "rgba(255,255,255,0.88)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>{section.title}</h2>
              <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>{section.body}</p>
            </article>
          ))}
        </div>
      </Section>
    </main>
  );
}