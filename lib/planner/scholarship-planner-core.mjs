import { compatibilityGroups, getScholarshipProgram, scholarshipPrograms } from "./scholarship-data.mjs";

const rank = { priority: 0, consider: 1, check: 2, unlikely: 3 };
const bandNumber = { basic: 0, "1to3": 3, "4to6": 6, "7to8": 8, "9": 9, "10plus": 10 };

export const initialScholarshipProfile = {
  goals: [], nationality: "unknown", academicStatus: "unknown", year: "unknown",
  major: "unknown", grade: "unknown", credits: "unknown", supportBand: "unknown",
  siblingCount: "unknown", birthOrder: "unknown", maritalStatus: "unknown",
  age: "unknown", remoteStudy: "unknown", canWork: "unknown", existingPrograms: [],
};

function evaluation(id, profile) {
  const program = getScholarshipProgram(id);
  const goalMatch = profile.goals.some((goal) => program.goals.includes(goal));
  return { ...program, level: goalMatch ? "consider" : "check", score: goalMatch ? 40 : 15, needsReview: false, reasons: [], missing: [], cautions: [] };
}

function promote(result, points, reason) {
  result.score += points;
  result.reasons.push(reason);
}

function missing(result, value, message) {
  if (value === "unknown") result.missing.push(message);
}

function exclude(result, reason) {
  result.level = "unlikely";
  result.score = -100;
  result.cautions.push(reason);
}

function commonStudentChecks(result, profile) {
  if (profile.nationality === "other") exclude(result, "대한민국 국적 요건을 충족하지 않아 현재 조건에서는 어렵습니다.");
  else if (profile.nationality === "korean") promote(result, 8, "대한민국 국적 요건을 충족합니다.");
  else missing(result, profile.nationality, "대한민국 국적 여부");

  if (profile.academicStatus === "not-enrolled") exclude(result, "현재 국내 대학 재학생이 아니어서 재학 중 장학금 대상이 되기 어렵습니다.");
  else if (profile.academicStatus !== "unknown") promote(result, 8, "현재 대학 학적 조건을 바탕으로 검토할 수 있습니다.");
  else missing(result, profile.academicStatus, "신입·재학·편입 등 현재 학적");
}

function gradeCheck(result, profile, minimum) {
  if (["first-year", "transfer"].includes(profile.academicStatus)) {
    promote(result, 4, "신·편입생 첫 학기는 성적·이수학점 기준을 별도로 적용합니다.");
    return;
  }
  if (profile.grade === "below70" && minimum === 70) {
    exclude(result, "일반적인 국가근로장학금 직전 학기 성적 70점 기준에 미달합니다.");
  } else if (profile.grade === "below70" || (minimum === 80 && profile.grade === "70to79")) {
    result.level = "check";
    result.needsReview = true;
    result.score -= 18;
    result.cautions.push(`일반 재학생의 성적 기준 ${minimum}점에 미달할 가능성이 있습니다.`);
  } else if (profile.grade !== "unknown") promote(result, 8, `입력한 성적은 일반적인 ${minimum}점 기준을 검토할 수 있는 범위입니다.`);
  else missing(result, profile.grade, "직전 학기 백분위 성적");
  missing(result, profile.credits, "직전 학기 최소 이수학점 충족 여부");
}

function integrated(id, profile) {
  const result = evaluation(id, profile);
  commonStudentChecks(result, profile);
  const band = bandNumber[profile.supportBand];
  if (band === 10) exclude(result, "학자금 지원 10구간 이상이면 현재 지원구간 기준을 벗어날 가능성이 높습니다.");
  else if (band !== undefined) promote(result, 10, "입력한 학자금 지원구간이 9구간 이하입니다.");
  else missing(result, profile.supportBand, "학자금 지원구간");
  gradeCheck(result, profile, 80);

  if (id === "national-scholarship-type-2") {
    result.score = Math.min(result.score, 71);
    result.missing.push("소속 대학의 II유형 참여 여부와 자체 선발기준");
    result.cautions.push("지원금액과 우선지원 대상은 대학별 자체 기준으로 결정됩니다.");
  }
  if (id === "multi-child-national-scholarship") {
    if (profile.siblingCount === "under3") exclude(result, "대한민국 국적 자녀가 3명 이상인 다자녀 가정 요건을 충족하지 않습니다.");
    else if (profile.siblingCount === "3plus") promote(result, 18, "세 자녀 이상 다자녀 가정 조건을 충족합니다.");
    else missing(result, profile.siblingCount, "가구의 대한민국 국적 자녀 수");
    if (profile.maritalStatus === "married") exclude(result, "다자녀 국가장학금은 미혼 자녀인 대학생을 대상으로 합니다.");
    else if (profile.maritalStatus === "unmarried") promote(result, 5, "미혼 대학생 조건을 충족합니다.");
    else missing(result, profile.maritalStatus, "혼인 여부");
    missing(result, profile.birthOrder, "가구 내 출생 순위");
  }
  return result;
}

function work(profile) {
  const result = evaluation("national-work-scholarship", profile);
  commonStudentChecks(result, profile);
  const band = bandNumber[profile.supportBand];
  if (band === 10) exclude(result, "일반적인 학자금 지원구간 9구간 이하 기준을 벗어날 가능성이 높습니다.");
  else if (band !== undefined) promote(result, 8, "입력한 지원구간이 일반적인 선발 범위에 있습니다.");
  else missing(result, profile.supportBand, "학자금 지원구간");
  gradeCheck(result, profile, 70);
  if (profile.canWork === "yes") promote(result, 20, "학업과 병행해 실제 근로시간을 확보할 수 있습니다.");
  else if (profile.canWork === "no") exclude(result, "실제 근로 참여가 어려우면 근로시간 연동 장학금을 받기 어렵습니다.");
  else missing(result, profile.canWork, "학기 중 또는 방학 중 근로 가능 여부");
  result.missing.push("소속 대학의 국가근로 참여와 근로지 여석");
  return result;
}

function housing(profile) {
  const result = evaluation("housing-stability-scholarship", profile);
  commonStudentChecks(result, profile);
  if (profile.supportBand === "basic") promote(result, 22, "기초생활수급자·차상위계층 범위로 검토할 수 있습니다.");
  else if (profile.supportBand !== "unknown") exclude(result, "주거안정장학금은 기초생활수급자 또는 차상위계층 대학생이 핵심 대상입니다.");
  else missing(result, profile.supportBand, "기초생활수급자·차상위계층 여부");
  if (profile.remoteStudy === "yes") promote(result, 20, "부모 주소지에서 통학하기 어려운 원거리 조건을 선택했습니다.");
  else if (profile.remoteStudy === "no") exclude(result, "부모 주소지와 대학이 원거리로 인정되지 않으면 대상이 되기 어렵습니다.");
  else missing(result, profile.remoteStudy, "부모 주소지와 대학 간 원거리 인정 여부");
  if (profile.age === "40plus") exclude(result, "신청연도 기준 만 39세 이하 요건을 벗어납니다.");
  else if (profile.age === "under40") promote(result, 6, "만 39세 이하 연령 조건을 충족합니다.");
  else missing(result, profile.age, "신청연도 기준 만 39세 이하 여부");
  if (profile.maritalStatus === "married") exclude(result, "주거안정장학금은 미혼 대학생을 대상으로 합니다.");
  else missing(result, profile.maritalStatus, "혼인 여부");
  result.missing.push("소속 대학의 사업 참여와 부모 주소지의 원거리 인정 지역");
  return result;
}

function excellence(id, requiredMajor, profile) {
  const result = evaluation(id, profile);
  commonStudentChecks(result, profile);
  if (profile.major === requiredMajor) promote(result, 24, requiredMajor === "humanities" ? "인문·사회계열 전공 조건과 일치합니다." : "자연과학·공학계열 전공 조건과 일치합니다.");
  else if (profile.major !== "unknown") exclude(result, "선발 대상 전공계열과 현재 전공이 일치하지 않습니다.");
  else missing(result, profile.major, "대학의 공식 학과계열 분류");
  if (["1", "3"].includes(profile.year)) promote(result, 15, "신규 선발이 주로 이루어지는 1학년 또는 3학년입니다.");
  else if (profile.year !== "unknown") result.cautions.push("신규 선발 유형은 주로 1학년 또는 3학년을 대상으로 하므로 대학의 별도 추천 유형을 확인해야 합니다.");
  else missing(result, profile.year, "현재 학년");
  if (profile.year === "3" && profile.grade === "90plus") promote(result, 12, "3학년 추천형의 높은 누적성적 기준을 검토할 수 있습니다.");
  else if (profile.year === "3" && profile.grade !== "unknown") result.cautions.push("3학년 추천형은 높은 누적성적과 이수학점 기준을 요구할 수 있습니다.");
  result.missing.push("소속 대학의 참여 여부, 배정인원, 교내 추천 일정과 자체평가 결과");
  return result;
}

function finalize(result, profile) {
  if (result.level !== "unlikely") {
    if (result.needsReview) result.level = "check";
    else if (result.score >= 72 && result.missing.length <= 2) result.level = "priority";
    else if (result.score >= 42) result.level = "consider";
    else result.level = "check";
  }
  if (profile.existingPrograms.includes(result.id)) result.cautions.push("이미 신청·수혜 중인 항목입니다. 심사 상태와 중복지원 조정 여부를 먼저 확인하세요.");
  return result;
}

function timeline(results) {
  const visible = new Set(results.filter((item) => item.level !== "unlikely").map((item) => item.id));
  const items = [];
  if (["national-scholarship-type-1", "national-scholarship-type-2", "multi-child-national-scholarship"].some((id) => visible.has(id))) {
    items.push({ title: "국가장학금 통합 신청", description: "I·II유형과 다자녀 장학금은 통합 신청 후 조건에 따라 자동 심사됩니다." });
    items.push({ title: "서류 제출과 가구원 동의", description: "재단 안내의 서류완료 상태와 가구원 정보제공 동의를 기간 안에 확인합니다." });
  }
  if (["humanities-100-years-scholarship", "national-science-engineering-excellence-scholarship"].some((id) => visible.has(id))) items.push({ title: "교내 추천 일정 확인", description: "학과 사무실과 대학 장학팀의 교내 마감을 재단 일정보다 먼저 확인합니다." });
  if (visible.has("national-work-scholarship")) items.push({ title: "희망근로지와 대학 선발 확인", description: "재단 신청 뒤 대학 자체 선발과 근로지 배정 일정을 확인합니다." });
  if (visible.has("housing-stability-scholarship")) items.push({ title: "원거리 기준과 주거비 증빙 준비", description: "참여대학·원거리 인정 여부를 확인하고 실제 주거비 증빙을 보관합니다." });
  items.push({ title: "최종 금액과 중복 조정 확인", description: "대학 심사 결과가 나오면 등록금 범위와 다른 지원의 중복 제한을 다시 확인합니다." });
  return items;
}

function documents(results) {
  const visible = new Set(results.filter((item) => item.level !== "unlikely").map((item) => item.id));
  const items = ["한국장학재단 신청정보와 본인 인증수단", "필요 시 가족관계·소득 확인 서류", "가구원 정보제공 동의 완료 확인"];
  if (visible.has("housing-stability-scholarship")) items.push("임대차계약서·기숙사비 고지서·이체내역 등 실제 주거비 증빙");
  if (visible.has("national-work-scholarship")) items.push("대학별 희망근로지 신청서와 추가 선발자료");
  if (visible.has("humanities-100-years-scholarship") || visible.has("national-science-engineering-excellence-scholarship")) items.push("학업계획서·활동자료·성적자료 등 대학 추천 심사자료");
  return items;
}

export function createScholarshipPlan(inputProfile) {
  const profile = { ...initialScholarshipProfile, ...inputProfile };
  const results = [integrated("national-scholarship-type-1", profile), integrated("national-scholarship-type-2", profile), integrated("multi-child-national-scholarship", profile), work(profile), housing(profile), excellence("humanities-100-years-scholarship", "humanities", profile), excellence("national-science-engineering-excellence-scholarship", "stem", profile)]
    .map((item) => finalize(item, profile))
    .sort((a, b) => rank[a.level] - rank[b.level] || b.score - a.score);
  let priorityCount = 0;
  for (const result of results) {
    if (result.level !== "priority") continue;
    priorityCount += 1;
    if (priorityCount > 3) result.level = "consider";
  }
  results.sort((a, b) => rank[a.level] - rank[b.level] || b.score - a.score);
  return {
    profile, results,
    compatibility: compatibilityGroups.filter((group) => group.programIds.some((id) => results.find((item) => item.id === id && item.level !== "unlikely"))),
    timeline: timeline(results), documents: documents(results),
    summary: Object.fromEntries(["priority", "consider", "check", "unlikely"].map((level) => [level, results.filter((item) => item.level === level).length])),
  };
}

export function getPlannerProgramCount() {
  return scholarshipPrograms.length;
}
