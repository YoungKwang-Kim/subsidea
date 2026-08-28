import { Section } from "@/components/layout/section";
import { HousingPlanner } from "@/components/planner/housing-planner";
import { createMetadata } from "@/lib/seo/metadata";
import { housingPlannerUpdatedAt } from "@/lib/planner/housing-data.mjs";

export const metadata = createMetadata({
  title: "전월세 주거지원 조합 플래너",
  description: "주거급여와 일반·청년·신혼·신생아 전세자금 중 먼저 확인할 지원을 고르고 신청 순서와 준비 서류를 만듭니다.",
  path: "/planner/housing",
  keywords: ["전세대출 비교", "주거급여 자격", "버팀목전세자금", "주거지원 조합"],
});

const cases = [
  ["월세를 내는 저소득 가구", "대출보다 먼저 주거급여 소득인정액과 실제 임차료 요건을 확인합니다."],
  ["전셋집을 구하는 청년", "일반 버팀목과 청년전용 상품을 비교하고 계약 전 목적물·보증 가능 여부를 상담합니다."],
  ["신혼·출산 가구", "신혼부부와 신생아 특례의 소득 상한, 한도, 적용 금리를 비교해 한 경로를 선택합니다."],
] as const;

export default function HousingPlannerPage() {
  return <main>
    <Section surface="light" containerSize="wide"><div className="planner-landing-hero"><p>전월세 주거지원 신청 설계도</p><h1 className="text-keep">월 임차료와 전세보증금에 맞는 지원 경로를 먼저 정하세요</h1><span>주거급여와 4개 정책 전세대출을 가구 조건으로 비교하고, 계약 전 확인부터 심사까지 순서대로 정리합니다.</span><small>공식 자료 최종 확인일 {housingPlannerUpdatedAt} · 입력정보는 브라우저 안에서만 처리</small></div></Section>
    <Section surface="parchment" containerSize="wide"><HousingPlanner /></Section>
    <Section surface="light" containerSize="wide"><div className="planner-feature-grid">{cases.map(([title, body]) => <article key={title}><h2>{title}</h2><p>{body}</p></article>)}</div></Section>
    <Section surface="parchment" containerSize="text"><div className="planner-editorial-copy"><h2>판정 방법과 한계</h2><p>월세와 전세 목적을 먼저 나누고, 가구원 수별 주거급여 기준, 연령, 혼인기간, 출산·입양일, 무주택, 소득과 기존 대출 조건을 공식 요건과 비교합니다. 자산가액과 대상 주택처럼 입력만으로 확정할 수 없는 조건은 추가 확인으로 남깁니다.</p><p>정책대출은 보조금이 아니므로 원금과 이자를 상환해야 합니다. 화면의 최대 한도는 실제 승인액이 아니며 기금 자산심사, 은행 신용심사, 보증기관과 임차목적물 심사를 모두 통과해야 합니다.</p><h2>자주 묻는 질문</h2><h3>여러 전세대출을 동시에 받을 수 있나요?</h3><p>일반·청년·신혼·신생아 버팀목을 동시에 실행하는 구조가 아닙니다. 본인에게 유리한 특례 경로를 먼저 정하고 기존 전세·주택담보대출의 중복 제한을 확인해야 합니다.</p><h3>계약 전에 설계도를 이용해도 되나요?</h3><p>가능합니다. 오히려 계약 전에 수탁은행과 보증기관에 목적물과 예상 한도를 문의하는 용도로 활용하세요. 계약금 지급 전 특약과 반환 조건도 확인해야 합니다.</p><h3>입력한 소득과 가족정보가 전송되나요?</h3><p>이름이나 증명서 파일을 받지 않으며 선택 결과는 현재 브라우저에만 저장됩니다. 입력 전체 삭제 버튼으로 언제든 지울 수 있습니다.</p></div></Section>
  </main>;
}
