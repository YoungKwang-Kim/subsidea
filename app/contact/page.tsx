import { Section } from "@/components/layout/section";
import { siteConfig } from "@/lib/constants/site";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "문의하기",
  description: "지원바다 서비스 제안, 데이터 오류 제보, 운영 문의를 받을 수 있는 안내 페이지입니다.",
  path: "/contact",
  keywords: ["문의", "제보", "운영"],
});

const contactItems = [
  {
    title: "데이터 오류 제보",
    body: "지원 조건, 링크, 마감일이 실제 공고와 다르다면 알려주세요. 확인 후 출처와 원문 기준으로 빠르게 수정합니다.",
  },
  {
    title: "서비스 개선 제안",
    body: "검색 흐름이나 자격 체크에서 불편한 점이 있었다면 개선 의견을 보내주세요. 실제 사용 흐름에 도움이 되는 제안을 우선 검토합니다.",
  },
  {
    title: "운영 문의",
    body: "콘텐츠 협업, 서비스 소개, 운영 관련 문의가 있다면 메일로 연락해 주세요. 확인 가능한 범위에서 순차적으로 답변드립니다.",
  },
];

export default function ContactPage() {
  return (
    <main>
      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "20px", maxWidth: "760px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>문의하기</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)", lineHeight: 1.07, fontWeight: 600 }}>
            서비스 관련 의견과 제보를 보내주세요.
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "var(--text-subhead-size)", lineHeight: 1.5 }}>
            더 정확한 정보와 더 나은 탐색 경험을 위해 사용자 피드백을 반영합니다. 오류 제보와 개선 의견은 서비스 품질을 높이는 데 큰
            도움이 됩니다.
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
            문의 시에는 확인이 필요한 지원금 이름이나 페이지 주소를 함께 적어 주시면 더 빠르게 답변드릴 수 있습니다.
          </p>
        </div>
      </Section>
    </main>
  );
}