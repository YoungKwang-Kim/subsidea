export const scholarshipPlannerUpdatedAt = "2026-08-28";

export const scholarshipPrograms = [
  {
    id: "national-scholarship-type-1",
    name: "국가장학금 I유형",
    goals: ["tuition"],
    applicationGroup: "national-integrated",
    benefitKind: "tuition",
    href: "/grant/national-scholarship-type-1",
    officialUrl: "https://www.kosaf.go.kr/ko/scholar.do?pg=scholarship05_12_01_01&ttab1=0",
    checkedAt: scholarshipPlannerUpdatedAt,
  },
  {
    id: "national-scholarship-type-2",
    name: "국가장학금 II유형",
    goals: ["tuition"],
    applicationGroup: "national-integrated",
    benefitKind: "tuition",
    href: "/grant/national-scholarship-type-2",
    officialUrl: "https://www.kosaf.go.kr/ko/scholar.do?pg=scholarship05_12_01_01&ttab1=0",
    checkedAt: scholarshipPlannerUpdatedAt,
  },
  {
    id: "multi-child-national-scholarship",
    name: "다자녀 국가장학금",
    goals: ["tuition"],
    applicationGroup: "national-integrated",
    benefitKind: "tuition",
    href: "/grant/multi-child-national-scholarship",
    officialUrl: "https://www.kosaf.go.kr/ko/faq.do?ctgrId1=NODE0000001494",
    checkedAt: scholarshipPlannerUpdatedAt,
  },
  {
    id: "national-work-scholarship",
    name: "국가근로장학금",
    goals: ["living"],
    applicationGroup: "work",
    benefitKind: "living",
    href: "/grant/national-work-scholarship",
    officialUrl: "https://www.kosaf.go.kr/ko/scholar.do?pg=scholarship05_04_01&ttab1=1",
    checkedAt: scholarshipPlannerUpdatedAt,
  },
  {
    id: "housing-stability-scholarship",
    name: "주거안정장학금",
    goals: ["housing"],
    applicationGroup: "housing",
    benefitKind: "housing",
    href: "/grant/housing-stability-scholarship",
    officialUrl: "https://www.kosaf.go.kr/ko/scholar.do?pg=scholarship05_14_01",
    checkedAt: scholarshipPlannerUpdatedAt,
  },
  {
    id: "humanities-100-years-scholarship",
    name: "인문100년장학금",
    goals: ["tuition", "living"],
    applicationGroup: "university-recommendation",
    benefitKind: "excellence",
    href: "/grant/humanities-100-years-scholarship",
    officialUrl: "https://www.kosaf.go.kr/ko/scholar.do?pg=scholarship05_07_01&ttab1=1",
    checkedAt: scholarshipPlannerUpdatedAt,
  },
  {
    id: "national-science-engineering-excellence-scholarship",
    name: "국가우수장학금(이공계)",
    goals: ["tuition"],
    applicationGroup: "university-recommendation",
    benefitKind: "excellence",
    href: "/grant/national-science-engineering-excellence-scholarship",
    officialUrl: "https://www.kosaf.go.kr/ko/scholar.do?pg=scholarship05_06_01&ttab1=3",
    checkedAt: scholarshipPlannerUpdatedAt,
  },
];

export const compatibilityGroups = [
  {
    title: "통합 신청 장학금",
    programIds: ["national-scholarship-type-1", "national-scholarship-type-2", "multi-child-national-scholarship"],
    status: "integrated",
    description: "한 번의 국가장학금 통합 신청으로 심사되며 등록금 범위에서 최종 금액이 조정됩니다.",
  },
  {
    title: "등록금과 생활비 조합",
    programIds: ["national-scholarship-type-1", "national-work-scholarship"],
    status: "compatible",
    description: "국가근로장학금은 실제 근로시간에 따른 생활비성 장학금으로 등록금 장학금과 목적이 다릅니다.",
  },
  {
    title: "등록금과 주거비 조합",
    programIds: ["national-scholarship-type-1", "housing-stability-scholarship"],
    status: "check",
    description: "목적은 다르지만 같은 기간의 다른 주거지원 수혜 여부와 대학별 지급 기준을 확인해야 합니다.",
  },
  {
    title: "우수장학금과 국가장학금",
    programIds: ["humanities-100-years-scholarship", "national-science-engineering-excellence-scholarship", "national-scholarship-type-1"],
    status: "tuition-cap",
    description: "등록금성 장학금 합계는 등록금 범위를 넘을 수 없으며 우수장학금 선발 결과에 따라 다른 등록금 지원액이 조정될 수 있습니다.",
  },
];

export function getScholarshipProgram(id) {
  return scholarshipPrograms.find((program) => program.id === id);
}
