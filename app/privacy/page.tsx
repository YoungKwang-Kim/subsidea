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
    body: "Google 로그인 이용 시 이메일 주소, 표시 이름, 프로필 이미지와 계정 식별자를 확인합니다. 맞춤 추천을 이용하면 사용자가 선택한 연령대, 거주 시도, 소득 구간, 주거 형태, 재직·학생 등 현재 상황과 관심 분야를 저장할 수 있습니다. 정확한 생년월일, 상세 주소, 소득액, 주민등록번호는 입력받지 않습니다.",
  },
  {
    title: "2. 이용 목적",
    body: "회원 식별과 로그인 유지, 맞춤 지원금 후보 추천, 관심 지원금 및 신청 준비 상태 동기화, 문의 응답, 오류 확인, 부정 이용 방지와 서비스 개선을 위해 정보를 이용합니다. 추천 조건 자체는 광고 개인화나 Google 애널리틱스 이벤트로 전송하지 않습니다.",
  },
  {
    title: "3. Google 및 Supabase 서비스 이용",
    body: "Google은 로그인, 이용 현황 분석과 광고 제공을 위해 사용되며 쿠키 또는 유사 기술로 정보를 처리할 수 있습니다. 회원 인증과 회원 데이터 저장에는 Supabase를 사용합니다. 각 서비스에는 해당 제공자의 개인정보 처리 기준이 적용됩니다.",
  },
  {
    title: "4. 쿠키와 이용 거부",
    body: "브라우저 설정에서 쿠키 저장을 차단하거나 기존 쿠키를 삭제할 수 있습니다. 쿠키를 차단하면 일부 분석 또는 광고 기능이 제한될 수 있지만 지원금 정보 열람에는 영향을 주지 않습니다.",
  },
  {
    title: "5. 신청 설계도 입력 정보의 브라우저 저장",
    body: "비회원이 장학금·주거지원 신청 설계도에서 선택한 값은 서버로 전송하지 않고 기존과 같이 해당 브라우저의 로컬 저장소(localStorage)에만 저장합니다. 저장값은 각 설계도의 ‘입력 전체 삭제’ 기능으로 지울 수 있습니다. 로그인 후에도 브라우저 데이터를 계정으로 옮길지는 사용자가 별도로 선택하며, 동의 없이 자동 업로드하지 않습니다.",
  },
  {
    title: "6. 신청 설계도 이용 분석",
    body: "설계도 개선을 위해 설계도 단계 이동, 완료 여부, 추천 결과 개수, 공식 기관 링크로 이동한 지원사업 식별자 등 이용 이벤트를 Google 애널리틱스에 전송할 수 있습니다. 사용자가 선택한 성적, 소득, 가족, 주거, 대출 조건 자체와 브라우저 로컬 저장소의 내용은 분석 이벤트에 포함하지 않습니다.",
  },
  {
    title: "7. 보관 기간",
    body: "회원 정보와 저장한 추천 조건은 계정이 유지되는 동안 보관하며, 계정 삭제 요청이 완료되면 관련 회원 데이터를 함께 삭제합니다. 문의 정보와 분석 데이터는 대응 및 각 서비스의 설정된 보관 목적이 끝난 후 정리합니다.",
  },
  {
    title: "8. 제3자 제공 및 처리",
    body: "법령에 따른 요청이 있는 경우를 제외하고 사용자가 제공한 개인정보를 임의로 판매하지 않습니다. Google 서비스에서 처리되는 정보에는 Google의 개인정보처리방침과 데이터 처리 기준이 적용됩니다.",
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "20px", maxWidth: "760px" }}>
          <p
            style={{
              margin: 0,
              color: "var(--color-primary)",
              fontSize: "14px",
            }}
          >
            개인정보처리방침
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: "var(--text-hero-size)",
              lineHeight: 1.07,
              fontWeight: 600,
            }}
          >
            서비스 이용과 문의 과정에서의 개인정보 처리 원칙
          </h1>
          <p
            style={{
              margin: 0,
              color: "var(--color-ink-muted)",
              fontSize: "var(--text-subhead-size)",
              lineHeight: 1.5,
            }}
          >
            필요한 최소 범위의 정보만 확인하고, 안내 서비스 운영과 문의 대응에
            필요한 범위 안에서만 활용하는 것을 기본 원칙으로 합니다.
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
              <h2
                style={{
                  margin: 0,
                  fontSize: "var(--text-title-size)",
                  lineHeight: 1.14,
                }}
              >
                {section.title}
              </h2>
              <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
                {section.body}
              </p>
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
            <h2
              style={{
                margin: 0,
                fontSize: "var(--text-title-size)",
                lineHeight: 1.14,
              }}
            >
              9. 관련 안내 및 문의
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
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                style={{ color: "var(--color-primary)" }}
              >
                {siteConfig.contactEmail}
              </a>
              로 보내주세요.
            </p>
          </article>
          <p
            style={{
              margin: 0,
              color: "var(--color-ink-muted)",
              fontSize: "14px",
            }}
          >
            시행일: 2026년 8월 29일 · 회원 기능 개정일: 2026년 8월 29일
          </p>
        </div>
      </Section>
    </main>
  );
}
