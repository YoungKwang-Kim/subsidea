import { filterGrantsByChecker } from "../checker/filter-grants-core.mjs";

const statusRank = {
  closing: 0,
  open: 1,
  upcoming: 2,
  closed: 3,
};

function buildReasons(grant, answers) {
  const reasons = [];

  if (grant.status === "closing") {
    reasons.push("마감이 가까워 먼저 확인할 필요가 있어요.");
  }

  if (answers.ageGroup) {
    reasons.push("선택한 연령대가 이 제도의 대상 범위와 겹쳐요.");
  }

  if (answers.situations.length > 0) {
    reasons.push("선택한 현재 상황 중 하나와 관련된 제도예요.");
  }

  if (answers.housing && grant.topic.includes("housing")) {
    reasons.push("선택한 주거 형태와 관련된 지원이에요.");
  }

  if (answers.income && answers.income !== "any") {
    reasons.push("선택한 소득 구간에서 확인해볼 수 있는 후보예요.");
  }

  if (reasons.length === 0) {
    reasons.push("현재 선택 조건에서 제외되지 않은 제도예요.");
  }

  return reasons.slice(0, 3);
}

function buildCautions(grant, answers) {
  const cautions = ["공식 공고에서 세부 자격과 제출 서류를 다시 확인하세요."];

  if (grant.target.income) {
    cautions.push("소득·재산의 실제 산정 방식은 기관 심사 기준을 따라요.");
  }

  if (answers.residenceSido) {
    cautions.push(
      `${answers.residenceSido} 지역의 시행 여부와 추가 조건을 확인하세요.`,
    );
  }

  return cautions.slice(0, 3);
}

export function createMemberRecommendations(grants, answers, limit = 12) {
  return filterGrantsByChecker(grants, answers)
    .sort((left, right) => statusRank[left.status] - statusRank[right.status])
    .slice(0, limit)
    .map((grant) => ({
      grant,
      reasons: buildReasons(grant, answers),
      cautions: buildCautions(grant, answers),
    }));
}
