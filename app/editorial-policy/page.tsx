import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/constants/site";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "콘텐츠 운영 원칙",
  description: "지원바다가 정부지원금 정보를 확인하고 작성, 검수, 수정하는 기준을 안내합니다.",
  path: "/editorial-policy",
  keywords: ["콘텐츠 운영 원칙", "정보 검수", "정정 정책"],
});

const policies = [
  {
    title: "자동 수집과 검색 노출을 분리합니다",
    body: [
      "공식 기관에서 수집한 기본 정보는 서비스 안에서 탐색할 수 있지만, 자동 수집만으로 Google 색인이나 광고 대상이 되지는 않습니다.",
      "조건 해석, 실제 판단 순서, 비교 기준과 공식 근거를 별도로 검토한 상세 페이지에만 검색 노출 자격을 부여합니다.",
    ],
  },
  {
    title: "공식 자료를 기준으로 확인합니다",
    body: [
      "지원 대상, 혜택, 신청 기간과 접수 방법은 정부 부처, 공공기관, 지방자치단체가 공개한 안내와 공고문을 우선 확인합니다.",
      "상세 페이지에는 사용자가 원문을 직접 확인할 수 있도록 공식 출처와 신청 페이지를 함께 제공합니다.",
    ],
  },
  {
    title: "이해를 돕는 설명을 추가합니다",
    body: [
      "공고문을 그대로 옮기기보다 신청 전에 비교해야 할 조건, 준비 순서, 놓치기 쉬운 항목을 쉬운 문장으로 다시 설명합니다.",
      "지원바다의 설명은 제도 이해를 돕기 위한 안내이며, 최종 자격 판정과 접수 결과는 운영 기관의 기준을 따릅니다.",
    ],
  },
  {
    title: "확인일과 변경 사항을 관리합니다",
    body: [
      "각 지원금 페이지에 마지막 확인일을 표시하고, 모집 일정이나 주요 조건이 달라진 경우 공식 자료를 다시 확인해 내용을 수정합니다.",
      "변경 사실을 확인하기 어려운 정보는 단정하지 않고 공식 기관에 추가 확인이 필요하다고 안내합니다.",
    ],
  },
  {
    title: "오류 제보를 검토하고 바로잡습니다",
    body: [
      "사용자가 지원 조건, 금액, 일정 또는 링크 오류를 제보하면 공식 원문과 대조한 뒤 수정 여부를 결정합니다.",
      "긴급한 마감 정보와 신청 경로 오류를 우선 확인하며, 정정이 필요한 경우 관련 페이지를 함께 점검합니다.",
    ],
  },
] as const;

export default function EditorialPolicyPage() {
  return (
    <main>
      <Section surface="light" containerSize="text">
        <div style={{ display: "grid", gap: "18px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>운영 기준</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)", lineHeight: 1.07, fontWeight: 600 }}>
            지원바다는 확인 가능한 근거와 사용자의 이해를 함께 중요하게 생각합니다.
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "var(--text-subhead-size)", lineHeight: 1.6 }}>
            정부지원금은 조건과 일정이 바뀔 수 있습니다. 지원바다는 공식 정보를 바탕으로 내용을 정리하고,
            최종 신청 전에 사용자가 원문을 다시 확인할 수 있도록 출처를 연결합니다.
          </p>
        </div>
      </Section>

      <Section surface="parchment" containerSize="text">
        <div style={{ display: "grid", gap: "28px" }}>
          {policies.map((policy) => (
            <article
              key={policy.title}
              style={{
                display: "grid",
                gap: "12px",
                paddingBottom: "28px",
                borderBottom: "1px solid var(--color-divider-soft)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "var(--text-title-size)", lineHeight: 1.2 }}>{policy.title}</h2>
              {policy.body.map((paragraph) => (
                <p key={paragraph} style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "17px", lineHeight: 1.8 }}>
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>
      </Section>

      <Section surface="light" containerSize="text">
        <div style={{ display: "grid", gap: "14px" }}>
          <h2 style={{ margin: 0, fontSize: "var(--text-display-size)", lineHeight: 1.15 }}>
            편집 책임과 검토 절차
          </h2>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "17px", lineHeight: 1.8 }}>
            운영 및 편집 책임 주체는 {siteConfig.organizationName}입니다. 페이지별 공식 근거, 확인일, 변경 가능성을 검토하고,
            독립적인 판단 정보가 부족한 페이지는 검색 노출과 광고 대상에서 제외합니다.
          </p>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "17px", lineHeight: 1.8 }}>
            정정 요청은 {siteConfig.contactEmail}로 접수합니다. 제보 내용을 공식 원문과 대조한 뒤 수정하고, 같은 기준이 적용되는 관련
            페이지도 함께 점검합니다.
          </p>
        </div>
      </Section>

      <Section surface="light" containerSize="text">
        <div style={{ display: "grid", gap: "14px", justifyItems: "start" }}>
          <h2 style={{ margin: 0, fontSize: "var(--text-display-size)", lineHeight: 1.15 }}>
            잘못된 정보를 발견하셨나요?
          </h2>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "17px", lineHeight: 1.7 }}>
            지원금 이름과 페이지 주소, 확인이 필요한 내용을 보내주시면 공식 자료와 대조해 검토하겠습니다.
          </p>
          <Button href="/contact">오류 제보하기</Button>
        </div>
      </Section>
    </main>
  );
}
