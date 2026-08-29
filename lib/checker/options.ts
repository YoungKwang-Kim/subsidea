import type {
  CheckerAgeGroup,
  CheckerHousing,
  CheckerIncome,
  CheckerSituation,
} from "@/lib/checker/filter-grants";

export const ageOptions: ReadonlyArray<{
  value: CheckerAgeGroup;
  label: string;
}> = [
  { value: "under19", label: "19세 미만" },
  { value: "19to34", label: "19~34세" },
  { value: "35to49", label: "35~49세" },
  { value: "50to64", label: "50~64세" },
  { value: "65plus", label: "65세 이상" },
];

export const situationOptions: ReadonlyArray<{
  value: CheckerSituation;
  label: string;
}> = [
  { value: "job-seeking", label: "구직중" },
  { value: "employed", label: "재직중" },
  { value: "self-employed", label: "자영업" },
  { value: "parenting", label: "육아중" },
  { value: "student", label: "학생" },
  { value: "senior", label: "노후·돌봄" },
  { value: "medical", label: "의료비 부담" },
];

export const housingOptions: ReadonlyArray<{
  value: CheckerHousing;
  label: string;
}> = [
  { value: "jeonse", label: "전세" },
  { value: "wolse", label: "월세" },
  { value: "homeowner", label: "자가" },
  { value: "other", label: "기타" },
];

export const incomeOptions: ReadonlyArray<{
  value: CheckerIncome;
  label: string;
}> = [
  { value: "under50", label: "중위소득 50% 이하" },
  { value: "50to100", label: "중위소득 50~100%" },
  { value: "100to150", label: "중위소득 100~150%" },
  { value: "any", label: "모름·무관" },
];

export const residenceOptions = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
] as const;

export const ageValues = ageOptions.map((option) => option.value);
export const situationValues = situationOptions.map((option) => option.value);
export const housingValues = housingOptions.map((option) => option.value);
export const incomeValues = incomeOptions.map((option) => option.value);
