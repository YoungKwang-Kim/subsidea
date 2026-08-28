import { Section } from "@/components/layout/section";
import { ScholarshipPlanner } from "@/components/planner/scholarship-planner";
import { createMetadata } from "@/lib/seo/metadata";
import { scholarshipPlannerUpdatedAt } from "@/lib/planner/scholarship-data.mjs";

export const metadata = createMetadata({
  title: "대학생 장학금 조합 플래너",
  description: "국가장학금, 다자녀, 국가근로, 주거안정, 인문100년과 이공계 장학금을 조합해 개인별 신청 순서와 준비 서류를 만듭니다.",
  path: "/planner/scholarship",
  keywords: ["장학금 조합", "국가장학금 자격", "대학생 장학금 추천", "장학금 신청 순서"],
});

const cases = [
  ["자취하는 저소득 재학생", "등록금 통합 신청을 먼저 완료하고 주거안정장학금의 참여대학·원거리 기준과 국가근로 선발을 이어서 확인합니다."],
  ["세 자녀 가정의 대학생", "국가장학금 통합 신청 한 번으로 I·II유형과 다자녀 장학금을 함께 심사받고 출생 순위별 금액을 확인합니다."],
  ["인문·이공계 우수학생", "재단 일정뿐 아니라 대학 장학팀의 교내 추천 마감과 계획서·활동자료 준비를 앞당깁니다."],
] as const;

export default function ScholarshipPlannerPage() {
  return (
    <main>
      <Section surface="light" containerSize="wide">
        <div className="planner-landing-hero">
          <p>대학생 장학금 신청 설계도</p>
          <h1 className="text-keep">등록금·주거비·생활비를 어떤 장학금으로 채울지 설계해 보세요</h1>
          <span>7개 국가장학사업을 목적과 중복 관계로 나누고, 입력한 조건에 따라 신청 순서와 준비 서류를 정리합니다.</span>
          <small>공식 자료 최종 확인일 {scholarshipPlannerUpdatedAt} · 입력정보는 브라우저 안에서만 처리</small>
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        <ScholarshipPlanner />
      </Section>

      <Section surface="light" containerSize="wide">
        <div className="planner-feature-grid">
          {cases.map(([title, body]) => <article key={title}><h2>{title}</h2><p>{body}</p></article>)}
        </div>
      </Section>

      <Section surface="parchment" containerSize="text">
        <div className="planner-editorial-copy">
          <h2>판정 방법과 한계</h2>
          <p>입력한 학적, 지원구간, 성적, 가구, 전공, 원거리와 근로 가능 조건을 장학금별 공식 요건과 비교합니다. 조건이 명확히 맞으면 우선순위를 높이고, 대학 참여 여부처럼 개인이 입력할 수 없는 조건은 추가 확인으로 남깁니다.</p>
          <p>국가장학금 I·II유형과 다자녀 장학금은 통합 신청으로 심사되지만 등록금 범위를 초과해 받을 수 없습니다. 국가근로는 실제 근로시간에 따른 생활비성 장학금이고, 주거안정장학금은 실제 주거비 증빙과 대학별 지급 심사가 필요합니다.</p>
          <p>인문100년과 국가우수장학금 이공계는 대학별 배정인원과 자체 선발이 선행되므로 재단 사전 신청만으로 선발이 확정되지 않습니다. 결과에 표시된 공식 자료와 소속 대학 공지를 신청 직전에 다시 확인하세요.</p>
          <h2>자주 묻는 질문</h2>
          <h3>결과가 우선 신청이면 선발이 확정되나요?</h3>
          <p>아닙니다. 입력한 조건에서 먼저 확인할 가치가 높다는 뜻이며 최종 선발은 한국장학재단과 대학 심사를 기준으로 합니다.</p>
          <h3>입력한 개인정보가 저장되나요?</h3>
          <p>이름, 연락처, 주민등록번호는 받지 않습니다. 선택 내용은 현재 기기의 브라우저 저장공간에만 임시 저장되며 입력 전체 삭제 버튼으로 지울 수 있습니다.</p>
          <h3>장학금 금액을 더한 값을 보여주지 않는 이유는 무엇인가요?</h3>
          <p>등록금성 장학금은 등록금 범위에서 조정되고 대학 자체심사와 실제 근로·주거비에 따라 금액이 달라집니다. 확정되지 않은 최대 금액을 합산하면 오히려 잘못된 기대를 만들 수 있어 신청 순서와 비용 목적을 중심으로 안내합니다.</p>
        </div>
      </Section>
    </main>
  );
}
