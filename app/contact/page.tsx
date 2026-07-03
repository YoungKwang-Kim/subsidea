import { Section } from "@/components/layout/section";
import { siteConfig } from "@/lib/constants/site";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "문의하기",
  description: "지원바다 서비스 제안, 데이터 오류 제보, 협업 문의를 받을 수 있는 안내 페이지입니다.",
  path: "/contact",
  keywords: ["문의", "제보", "협업"],
});

const contactItems = [
  {
    title: "데이터 오류 제보",
    body: "지원 조건, 링크, 마감일이 실제 공고와 다르다면 알려주세요. 확인 후 크롤링 규칙과 데이터를 함께 점검합니다.",
  },
  {
    title: "서비스 제안",
    body: "탐색 흐름이나 자격 체크에서 불편한 점이 있었다면 개선 아이디어를 보내주세요.",
  },
  {
    title: "콘텐츠 협업",
    body: "정부지원금 큐레이션, 지역 정책 정리, 사용자 리서치 협업 제안도 환영합니다.",
  },
];

export default function ContactPage() {
  return (
    <main>
      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "20px", maxWidth: "760px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>문의하기</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)", lineHeight: 1.07, fontWeight: 600 }}>
            서비스 관련 의견과 제보를 보내주세요
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "var(--text-subhead-size)", lineHeight: 1.5 }}>
            정확한 정보와 더 나은 탐색 경험을 위해 사용자 피드백을 꾸준히 반영하는 구조를 목표로 합니다.
          </p>
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        <div style={{ display: "grid", gap: "20px" }}>
          {contactItems.map((item) => (
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
        <div style={{ display: "grid", gap: "12px", maxWidth: "720px" }}>
          <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>연락 채널</h2>
          <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
            이메일: <a href={`mailto:${siteConfig.contactEmail}`} style={{ color: "var(--color-primary)" }}>{siteConfig.contactEmail}</a>
          </p>
          <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
            문의 내용에는 확인이 필요한 지원금 이름이나 페이지 주소를 함께 적어주시면 더 빠르게 대응할 수 있습니다.
          </p>
        </div>
      </Section>
    </main>
  );
}