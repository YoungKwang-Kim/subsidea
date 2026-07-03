import type { GrantCategory, GrantTopic } from "@/types/grant";

export const categoryMap: Record<
  GrantCategory,
  { label: string; description: string }
> = {
  youth: {
    label: "청년",
    description: "구직, 주거, 자산형성처럼 청년이 가장 자주 찾는 지원금을 모아봅니다.",
  },
  family: {
    label: "신혼부부·출산",
    description: "출산, 육아, 가정 지원처럼 가족 단위로 확인해야 할 정책을 정리합니다.",
  },
  business: {
    label: "소상공인",
    description: "운영자금, 대출, 경영 안정처럼 사업 운영에 가까운 지원 제도를 모았습니다.",
  },
  welfare: {
    label: "저소득층·복지",
    description: "생활비와 에너지 비용 부담을 줄이는 복지성 지원을 쉽게 살펴봅니다.",
  },
  senior: {
    label: "중장년·노인",
    description: "중장년과 고령층의 일자리, 생활 안정, 사회활동 지원을 모아봅니다.",
  },
};

export const topicMap: Record<GrantTopic, { label: string; description: string }> = {
  housing: {
    label: "주거",
    description: "월세, 전세, 주거 안정처럼 집과 관련된 지원 제도를 묶었습니다.",
  },
  employment: {
    label: "취업·창업",
    description: "취업 준비, 일자리 참여, 창업과 사업 운영에 연결되는 지원을 살펴봅니다.",
  },
  education: {
    label: "교육",
    description: "장학금, 학자금, 직무 교육처럼 학습과 성장에 필요한 지원을 모았습니다.",
  },
  health: {
    label: "의료·건강",
    description: "출산, 돌봄, 건강과 관련된 비용 부담을 덜어주는 지원을 정리합니다.",
  },
  living: {
    label: "생활비",
    description: "바우처, 생계 보조, 냉난방비처럼 일상 지출에 가까운 지원을 모았습니다.",
  },
  finance: {
    label: "금융",
    description: "대출, 저축, 정책금융처럼 자금과 자산형성에 가까운 제도를 정리합니다.",
  },
};
