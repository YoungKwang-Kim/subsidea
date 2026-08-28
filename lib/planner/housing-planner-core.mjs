import { housingPrograms } from "./housing-data.mjs";

export const initialHousingProfile = {
  goal: "unknown",
  age: "unknown",
  householdSize: "unknown",
  housingIncome: "unknown",
  annualIncome: "unknown",
  incomeType: "unknown",
  maritalStatus: "unknown",
  newborn: "unknown",
  homeless: "unknown",
  depositPaid: "unknown",
  existingHousingLoan: "unknown",
};

const levelRank = { priority: 0, consider: 1, check: 2, unlikely: 3 };

function makeResult(program) {
  return { ...program, level: "consider", score: 50, reasons: [], missing: [], cautions: [] };
}

function lower(result, level, message) {
  if (levelRank[level] > levelRank[result.level]) result.level = level;
  result.cautions.push(message);
}

function needs(result, condition, message) {
  if (condition === "unknown") {
    if (result.level === "priority") result.level = "check";
    result.missing.push(message);
  }
}

function incomeAtMost(value, maximum) {
  const rank = { under50: 1, under75: 2, under130: 3, under200: 4, over200: 5 };
  return value === "unknown" ? null : rank[value] <= rank[maximum];
}

function evaluateHousingBenefit(profile, program) {
  const result = makeResult(program);
  if (profile.goal === "monthly" || profile.goal === "both") {
    result.level = "priority";
    result.score += 35;
    result.reasons.push("월 임차료 부담을 줄이는 현금성 급여를 먼저 확인하도록 선택했습니다.");
  } else if (profile.goal === "jeonse") {
    result.score -= 10;
  } else {
    result.missing.push("월세 지원도 필요한지 선택해 주세요.");
  }
  if (profile.housingIncome === "eligible") {
    result.reasons.push("입력한 소득인정액이 2026년 주거급여 기준 이하입니다.");
  } else if (profile.housingIncome === "over") {
    lower(result, "unlikely", "소득인정액이 기준 중위소득 48%를 초과하면 주거급여 대상이 어렵습니다.");
  } else {
    needs(result, "unknown", "가구원 수별 소득인정액이 주거급여 기준 이하인지 확인해야 합니다.");
  }
  return result;
}

function evaluateLoan(profile, program) {
  const result = makeResult(program);
  if (profile.goal === "jeonse" || profile.goal === "both") {
    result.level = "consider";
    result.score += 25;
    result.reasons.push("전세보증금 마련 목적에 맞는 정책대출입니다.");
  } else if (profile.goal === "monthly") {
    lower(result, "unlikely", "이 상품은 월세 지원금이 아니라 전세보증금 대출입니다.");
  } else {
    result.missing.push("전세보증금 대출이 필요한지 선택해 주세요.");
  }

  if (profile.homeless === "yes") result.reasons.push("세대원 전원 무주택 조건을 충족한다고 입력했습니다.");
  if (profile.homeless === "no") lower(result, "unlikely", "세대원 중 주택 보유자가 있으면 기금 전세대출 이용이 어렵습니다.");
  needs(result, profile.homeless, "세대주와 세대원 전원의 무주택 여부를 확인해야 합니다.");

  if (profile.depositPaid === "yes") result.reasons.push("임차보증금 5% 이상 계약금 지급 조건을 충족한다고 입력했습니다.");
  if (profile.depositPaid === "no") lower(result, "check", "대출 신청 전 임대차계약과 보증금 5% 이상 지급이 필요합니다.");
  needs(result, profile.depositPaid, "임대차계약과 보증금 5% 이상 지급 여부를 확인해야 합니다.");

  if (profile.existingHousingLoan === "yes") lower(result, "check", "기존 기금·은행 전세대출 또는 주택담보대출과 중복 제한을 확인해야 합니다.");
  needs(result, profile.existingHousingLoan, "현재 이용 중인 전세·주택담보대출의 중복 제한을 확인해야 합니다.");
  return result;
}

function evaluateProgram(profile, program) {
  if (program.id === "housing-benefit") return evaluateHousingBenefit(profile, program);
  const result = evaluateLoan(profile, program);
  const income = profile.annualIncome;

  if (program.id === "buteumok-jeonse-loan") {
    const eligible = incomeAtMost(income, "under50");
    if (eligible === true) { result.reasons.push("일반 버팀목의 기본 부부합산 소득 범위로 입력했습니다."); result.score += 5; }
    if (eligible === false) lower(result, "unlikely", "일반가구의 기본 소득 기준을 초과할 가능성이 큽니다. 가구 특례를 별도로 확인하세요.");
    if (eligible === null) needs(result, "unknown", "부부합산 연소득과 적용 가능한 특례 기준을 확인해야 합니다.");
  }

  if (program.id === "youth-buteumok-jeonse-loan") {
    if (profile.age === "youth") { if (result.level === "consider") result.level = "priority"; result.score += 30; result.reasons.push("만 19~34세 청년 연령 조건에 해당합니다."); }
    if (profile.age === "over34") lower(result, "unlikely", "만 34세를 초과하면 청년전용 상품 대상이 어렵습니다.");
    needs(result, profile.age, "신청일 기준 만 나이를 확인해야 합니다.");
    const eligible = incomeAtMost(income, "under50");
    if (eligible === false) lower(result, "unlikely", "부부합산 연소득 5천만 원 기준을 초과할 가능성이 큽니다.");
    if (eligible === null) needs(result, "unknown", "부부합산 연소득 5천만 원 이하인지 확인해야 합니다.");
  }

  if (program.id === "newlywed-jeonse-loan") {
    if (profile.maritalStatus === "newlywed") { if (result.level === "consider") result.level = "priority"; result.score += 28; result.reasons.push("혼인 7년 이내 또는 결혼 예정 신혼가구로 입력했습니다."); }
    if (profile.maritalStatus === "other") lower(result, "unlikely", "혼인 7년 이내 또는 3개월 이내 결혼 예정 조건에 해당하지 않습니다.");
    needs(result, profile.maritalStatus, "혼인기간 또는 결혼 예정일을 확인해야 합니다.");
    const eligible = incomeAtMost(income, "under75");
    if (eligible === false) lower(result, "unlikely", "부부합산 연소득 7,500만 원 기준을 초과할 가능성이 큽니다.");
    if (eligible === null) needs(result, "unknown", "부부합산 연소득 7,500만 원 이하인지 확인해야 합니다.");
  }

  if (program.id === "newborn-special-jeonse-loan") {
    if (profile.newborn === "yes") { if (result.level === "consider") result.level = "priority"; result.score += 32; result.reasons.push("접수일 기준 2년 이내 출산·입양 가구로 입력했습니다."); }
    if (profile.newborn === "no") lower(result, "unlikely", "접수일 기준 2년 이내 출산·입양 요건에 해당하지 않습니다.");
    needs(result, profile.newborn, "출산·입양일과 2023년 이후 출생 여부를 확인해야 합니다.");
    const eligible = incomeAtMost(income, "under200");
    if (eligible === false) lower(result, "unlikely", "맞벌이 특례를 포함한 소득 상한을 초과할 가능성이 큽니다.");
    if (eligible === null) needs(result, "unknown", "외벌이 1억 3천만 원·맞벌이 2억 원 기준 적용 여부를 확인해야 합니다.");
    if (income === "under200" && profile.incomeType === "single") lower(result, "unlikely", "1억 3천만 원 초과 구간은 맞벌이 특례가 아니면 소득 기준을 넘습니다.");
    if (income === "under200" && profile.incomeType === "unknown") lower(result, "check", "1억 3천만 원 초과 소득에는 맞벌이 특례 적용 여부 확인이 필요합니다.");
    if (income === "under200" && profile.incomeType === "dual") result.reasons.push("맞벌이 합산 2억 원 이하 특례 구간으로 입력했습니다.");
  }
  return result;
}

export function createHousingPlan(profile = initialHousingProfile) {
  const results = housingPrograms.map((program) => evaluateProgram(profile, program));
  let priorityCount = 0;
  results.sort((a, b) => levelRank[a.level] - levelRank[b.level] || b.score - a.score);
  for (const result of results) {
    if (result.level !== "priority") continue;
    priorityCount += 1;
    if (priorityCount > 3) result.level = "consider";
  }

  return {
    results,
    summary: results.reduce((summary, result) => ({ ...summary, [result.level]: (summary[result.level] ?? 0) + 1 }), {}),
    compatibility: [
      { title: "현금성 급여와 정책대출", description: "주거급여와 전세대출은 성격이 다르지만 실제 임차료·소득·대출 심사 과정에서 기관 확인이 필요합니다." },
      { title: "전세대출은 한 경로를 선택", description: "일반·청년·신혼·신생아 상품을 동시에 실행하는 구조가 아닙니다. 우대 조건이 가장 맞는 상품부터 상담하세요." },
      { title: "은행·보증기관 심사 별도", description: "기금 요건을 충족해도 자산심사, 목적물 심사, 신용과 보증기관 심사에서 한도나 승인 여부가 달라질 수 있습니다." },
    ],
    documents: ["신분증과 주민등록등본", "가족관계·혼인관계 증명자료", "소득·재직·사업소득 증빙", "임대차계약서와 계약금 지급 영수증", "주택·대출·자산 심사에 필요한 추가 서류"],
    timeline: [
      { title: "가구 조건 확인", description: "무주택 범위, 소득·자산, 청년·신혼·출산 특례 중 맞는 경로를 정합니다." },
      { title: "계약 전 사전 상담", description: "기금 수탁은행이나 주거급여 담당기관에 목적물과 예상 한도를 먼저 문의합니다." },
      { title: "계약과 서류 준비", description: "특약을 검토하고 임대차계약, 계약금 영수증, 소득·가족 서류를 준비합니다." },
      { title: "신청·자산·보증 심사", description: "기금e든든·은행 또는 복지로·주민센터에서 신청하고 보완 요청에 대응합니다." },
      { title: "실행 조건 최종 확인", description: "승인 금액, 금리, 보증료, 상환계획과 중복 제한을 확인한 뒤 실행합니다." },
    ],
  };
}
