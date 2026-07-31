import { Section } from "@/components/layout/section";
import { siteConfig } from "@/lib/constants/site";
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
    body: "현재 서비스는 회원가입 기능 없이 운영됩니다. 문의 시 사용자가 직접 제공한 이름, 이메일, 문의 내용을 확인할 수 있으며, 서비스 이용 과정에서 페이지 주소, 방문·이탈 시각, 기기·브라우저 정보, 대략적인 지역, 유입 경로, 스크롤 및 외부 링크 클릭 정보가 자동으로 수집될 수 있습니다.",
  },
  {
    title: "2. 이용 목적",
    body: "문의 응답과 오류 제보 확인, 이용 현황 분석, 콘텐츠 품질 및 화면 흐름 개선, 부정 이용 방지, 광고 운영을 위해 정보를 이용합니다. 지원금 검색어는 Google 애널리틱스의 사이트 검색 자동 측정 대상에서 제외합니다.",
  },
  {
    title: "3. Google 서비스 이용",
    body: "지원바다는 이용 현황 분석을 위해 Google 애널리틱스 4를, 광고 제공과 운영을 위해 Google AdSense를 사용합니다. 이 과정에서 Google이 쿠키 또는 유사 기술을 이용해 정보를 수집·처리할 수 있습니다.",
  },
  {
    title: "4. 쿠키와 이용 거부",
    body: "브라우저 설정에서 쿠키 저장을 차단하거나 기존 쿠키를 삭제할 수 있습니다. 쿠키를 차단하면 일부 분석 또는 광고 기능이 제한될 수 있지만 지원금 정보 열람에는 영향을 주지 않습니다.",
  },
  {
    title: "5. 보관 기간",
    body: "문의 정보는 대응이 종료되고 관련 법령 또는 분쟁 대응을 위한 보관 필요성이 없어지면 합리적인 기간 내에 정리합니다. 분석 데이터는 Google 애널리틱스 속성에 설정된 보관 기간에 따라 보관된 후 삭제됩니다.",
  },
  {
    title: "6. 제3자 제공 및 처리",
    body: "법령에 따른 요청이 있는 경우를 제외하고 사용자가 제공한 개인정보를 임의로 판매하지 않습니다. Google 서비스에서 처리되는 정보에는 Google의 개인정보처리방침과 데이터 처리 기준이 적용됩니다.",
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
            필요한 최소 범위의 정보만 확인하고, 안내 서비스 운영과 문의 대응에 필요한 범위 안에서만 활용하는 것을 기본 원칙으로 합니다.
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
          <article
            style={{
              display: "grid",
              gap: "10px",
              padding: "24px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-hairline)",
              background: "rgba(255,255,255,0.88)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.14 }}>
              7. 관련 안내 및 문의
            </h2>
            <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
              Google의 데이터 처리 방식은{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites?hl=ko"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--color-primary)" }}
              >
                Google 서비스를 사용하는 사이트 또는 앱의 정보 이용 방식
              </a>
              에서 확인할 수 있습니다. 개인정보 처리와 관련한 문의는{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} style={{ color: "var(--color-primary)" }}>
                {siteConfig.contactEmail}
              </a>
              로 보내주세요.
            </p>
          </article>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "14px" }}>
            시행일: 2026년 7월 31일
          </p>
        </div>
      </Section>
    </main>
  );
}
