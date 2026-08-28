import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "지원금 신청 설계도",
  description: "지원금을 단순히 나열하지 않고 목적, 중복 관계, 신청 순서와 준비 서류를 하나의 실행계획으로 정리합니다.",
  path: "/planner",
  keywords: ["지원금 조합", "신청 계획", "지원금 플래너"],
});

export default function PlannerPage() {
  return (
    <main>
      <Section surface="light" containerSize="wide">
        <div className="planner-landing-hero">
          <p>지원바다 신청 설계도</p>
          <h1 className="text-keep">지원금을 찾는 데서 끝내지 않고, 신청할 순서까지 정리합니다</h1>
          <span>목적이 다른 지원을 조합하고, 중복 확인이 필요한 항목과 준비 서류를 한 번에 확인하세요.</span>
          <div className="planner-plan-actions">
            <Button href="/planner/scholarship">대학생 장학금 설계</Button>
            <Button href="/planner/housing" variant="secondary">전월세 주거지원 설계</Button>
          </div>
        </div>
      </Section>
      <Section surface="parchment" containerSize="wide">
        <div className="planner-feature-grid">
          <article><h2>대학생 장학금 설계도</h2><p>등록금·주거비·생활비 목적에 따라 7개 국가장학사업과 교내 추천 순서를 정리합니다.</p><Button href="/planner/scholarship" size="sm">장학금 설계 시작</Button></article>
          <article><h2>전월세 주거지원 설계도</h2><p>주거급여와 일반·청년·신혼·신생아 전세대출 중 먼저 확인할 경로를 정리합니다.</p><Button href="/planner/housing" size="sm">주거지원 설계 시작</Button></article>
        </div>
      </Section>
      <Section surface="light" containerSize="wide">
        <div className="planner-feature-grid">
          {[
            ["목적부터 구분", "등록금·주거비·생활비처럼 실제로 해결하려는 비용을 먼저 나눕니다."],
            ["추천 이유 공개", "어떤 입력 조건이 추천에 반영됐고 무엇을 더 확인해야 하는지 보여줍니다."],
            ["신청 순서 생성", "통합 신청, 가구원 동의, 교내 추천처럼 선행 절차를 순서대로 정리합니다."],
          ].map(([title, body]) => <article key={title}><h2>{title}</h2><p>{body}</p></article>)}
        </div>
      </Section>
      <Section surface="parchment" containerSize="text">
        <div className="planner-editorial-copy">
          <h2>왜 단순 자격 조회와 다른가요?</h2>
          <p>같은 대학생이라도 등록금이 필요한지, 자취 주거비가 필요한지, 학업과 근로를 병행할 수 있는지에 따라 먼저 확인할 장학금이 달라집니다. 신청 설계도는 받을 가능성이 있는 제도를 많이 보여주는 대신 지금 해야 할 행동을 줄여서 제시합니다.</p>
          <p>모든 판정은 공식 기관 자료를 사람이 검토해 만든 규칙으로 계산합니다. 개인정보는 서버에 전송하지 않으며 결과는 최종 자격 확정이 아닌 신청 준비를 위한 참고 자료입니다.</p>
        </div>
      </Section>
    </main>
  );
}
