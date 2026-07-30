import type { GrantCategory, GrantTopic } from "@/types/grant";

export type GrantHubContent = {
  intro: string;
  checkpoints: {
    title: string;
    description: string;
  }[];
  selectionTip: string;
  relatedGuideSlugs: string[];
};

export const categoryHubContent: Record<GrantCategory, GrantHubContent> = {
  youth: {
    intro:
      "청년 지원은 나이만 맞는다고 모두 신청할 수 있는 것은 아닙니다. 재학·구직·재직 여부와 거주지, 필요한 지원의 목적을 먼저 나누면 후보를 빠르게 줄일 수 있습니다.",
    checkpoints: [
      {
        title: "연령과 거주 기준",
        description:
          "정책마다 청년으로 인정하는 나이와 거주 요건이 다릅니다. 신청일 기준 나이와 주민등록상 주소를 먼저 확인하세요.",
      },
      {
        title: "현재 활동 상태",
        description:
          "학생, 구직자, 재직자, 자영업자 여부에 따라 신청할 수 있는 제도가 달라집니다. 최근 고용보험 이력도 함께 살펴보세요.",
      },
      {
        title: "지원 목적과 시기",
        description:
          "생활비, 주거비, 취업 준비, 자산형성 중 가장 급한 목적을 정하고 모집 기간과 중복 제한을 비교하세요.",
      },
    ],
    selectionTip:
      "현금성 지원만 찾기보다 주거·교육·저축 지원까지 함께 비교하면 실제 부담을 더 크게 줄일 수 있습니다.",
    relatedGuideSlugs: [
      "youth-support-guide-2026",
      "youth-asset-building-comparison-2026",
    ],
  },
  family: {
    intro:
      "출산·육아 지원은 출생 시점과 자녀 나이, 돌봄 방식에 따라 신청 순서가 달라집니다. 전국 공통 제도와 거주 지역의 추가 지원을 나누어 확인하는 것이 좋습니다.",
    checkpoints: [
      {
        title: "자녀의 출생일과 나이",
        description:
          "출생 직후 신청하는 바우처와 매월 지급되는 급여는 기준 시점이 다릅니다. 출생신고 완료 여부부터 확인하세요.",
      },
      {
        title: "가정양육과 보육 이용",
        description:
          "어린이집 이용, 가정양육, 아이돌봄서비스 이용 여부에 따라 지급 방식이나 본인부담금이 달라질 수 있습니다.",
      },
      {
        title: "가구·지역 추가 조건",
        description:
          "소득, 자녀 수, 한부모 여부와 주민등록 지역에 따라 추가 지원이 있으므로 주소지 행정복지센터 안내도 함께 확인하세요.",
      },
    ],
    selectionTip:
      "출생신고 후 행복출산 원스톱서비스를 먼저 확인하고, 복지로와 거주지 지자체 지원을 이어서 비교하면 누락을 줄일 수 있습니다.",
    relatedGuideSlugs: [
      "birth-childcare-benefits-roadmap-2026",
      "earned-child-tax-credit-guide-2026",
    ],
  },
  business: {
    intro:
      "소상공인 지원은 보조금, 융자, 보증, 교육처럼 지원 방식이 서로 다릅니다. 사업을 계속 운영하는지, 재기나 폐업을 준비하는지부터 구분해야 합니다.",
    checkpoints: [
      {
        title: "사업자 상태와 업력",
        description:
          "사업자등록 여부, 개업일, 매출 규모와 상시근로자 수를 확인하세요. 휴·폐업 상태에 따라 신청 경로가 달라집니다.",
      },
      {
        title: "필요한 자금의 성격",
        description:
          "상환이 필요한 정책자금인지, 비용을 보전하는 사업비인지, 보증을 통한 대출인지 조건을 구분해 비교하세요.",
      },
      {
        title: "제외업종과 체납 여부",
        description:
          "업종 제한, 국세·지방세 체납, 기존 대출 연체와 중복 수혜 여부는 접수 전에 반드시 확인해야 합니다.",
      },
    ],
    selectionTip:
      "지원금이라는 표현만 보고 신청하지 말고 상환 의무, 자부담, 사후 증빙 조건까지 확인한 뒤 사업 상황에 맞는 제도를 선택하세요.",
    relatedGuideSlugs: [
      "small-business-support-comparison",
      "application-rejection-reasons",
    ],
  },
  welfare: {
    intro:
      "복지 지원은 개인 소득만이 아니라 가구 구성과 소득인정액, 재산을 함께 심사하는 경우가 많습니다. 어떤 생활비 부담을 줄이려는지 먼저 정리해보세요.",
    checkpoints: [
      {
        title: "가구와 소득인정액",
        description:
          "주민등록 가구와 실제 보장가구가 다를 수 있습니다. 근로소득뿐 아니라 재산의 소득환산액이 포함되는지도 확인하세요.",
      },
      {
        title: "지원하는 지출 항목",
        description:
          "생계비, 주거비, 교육비, 에너지비처럼 지원 목적이 다르면 동시에 확인할 수 있는 제도도 있습니다.",
      },
      {
        title: "신청일과 소급 여부",
        description:
          "신청한 달부터 보장되는 급여가 많아 늦게 신청하면 이전 기간을 받지 못할 수 있습니다. 위기 상황이라면 긴급복지도 함께 문의하세요.",
      },
    ],
    selectionTip:
      "온라인 모의계산은 참고용입니다. 가구 분리나 재산 산정이 복잡하면 주소지 행정복지센터에서 보장가구 기준을 먼저 상담하세요.",
    relatedGuideSlugs: [
      "low-income-living-support-guide-2026",
      "disability-income-support-guide-2026",
    ],
  },
  senior: {
    intro:
      "중장년·노인 지원은 연령, 소득, 근로 의사와 돌봄 필요 정도에 따라 나뉩니다. 정기 급여와 사회활동, 돌봄서비스를 따로 비교해야 합니다.",
    checkpoints: [
      {
        title: "기준 연령과 신청 시점",
        description:
          "만 60세와 만 65세를 기준으로 하는 제도가 섞여 있습니다. 생일 전 신청 가능한 제도와 연중 모집 여부를 확인하세요.",
      },
      {
        title: "소득과 활동 가능 여부",
        description:
          "소득인정액을 보는 연금과 근로·활동 역량을 보는 일자리 사업은 심사 기준이 다릅니다.",
      },
      {
        title: "생활지원과 신체 돌봄",
        description:
          "안부 확인·가사지원과 장기요양서비스는 대상과 판정 절차가 다르므로 필요한 돌봄 수준을 먼저 구분하세요.",
      },
    ],
    selectionTip:
      "기초연금, 노인일자리, 돌봄서비스는 서로 목적이 다릅니다. 한 제도만 보기보다 생활비·활동·돌봄 필요를 각각 확인하세요.",
    relatedGuideSlugs: [
      "basic-pension-senior-support-guide-2026",
      "senior-care-service-guide-2026",
    ],
  },
};

export const topicHubContent: Record<GrantTopic, GrantHubContent> = {
  housing: {
    intro:
      "주거 지원은 현재 집에 계속 거주할지, 새 집으로 이동할지에 따라 선택지가 달라집니다. 월세 보조, 공공임대, 보증금 대출을 같은 기준으로 비교하지 않는 것이 중요합니다.",
    checkpoints: [
      {
        title: "현재 거주와 이사 계획",
        description:
          "이미 임대차계약을 맺었는지, 입주할 집을 찾는 중인지에 따라 월세지원과 임대주택·대출의 신청 순서가 달라집니다.",
      },
      {
        title: "지원 방식",
        description:
          "매달 받는 주거비, 낮은 임대료의 공공주택, 상환해야 하는 보증금 대출을 구분해 실제 월 부담을 계산하세요.",
      },
      {
        title: "가구와 주택 기준",
        description:
          "부모와의 가구 분리, 무주택 여부, 임차보증금과 월세 상한, 주택 면적 기준을 함께 확인하세요.",
      },
    ],
    selectionTip:
      "월세지원이 끝난 뒤의 비용까지 고려해 공공임대와 보증금 대출을 함께 비교하면 더 안정적인 선택을 할 수 있습니다.",
    relatedGuideSlugs: [
      "housing-support-checklist",
      "low-income-living-support-guide-2026",
    ],
  },
  employment: {
    intro:
      "취업·창업 지원은 현재 구직 중인지, 재직 중인지, 사업을 운영 중인지에 따라 출발점이 다릅니다. 현금 지급과 훈련·채용 지원을 구분해 살펴보세요.",
    checkpoints: [
      {
        title: "현재 고용 상태",
        description:
          "미취업, 단기근로, 재직, 자영업 상태와 고용보험 가입 이력이 참여 가능 여부를 좌우할 수 있습니다.",
      },
      {
        title: "원하는 지원 결과",
        description:
          "구직활동비, 직업훈련비, 취업 알선, 창업 자금 중 지금 필요한 결과를 정하면 불필요한 신청을 줄일 수 있습니다.",
      },
      {
        title: "참여 의무와 일정",
        description:
          "상담, 출석, 구직활동 보고처럼 참여 조건이 있는지 확인하고 학업이나 근로 일정과 병행 가능한지 살펴보세요.",
      },
    ],
    selectionTip:
      "국민취업지원제도와 직업훈련은 연계 가능한 경우가 있으므로 먼저 고용센터 상담을 받고 신청 순서를 정하는 편이 안전합니다.",
    relatedGuideSlugs: [
      "employment-training-support-comparison-2026",
      "youth-support-guide-2026",
    ],
  },
  education: {
    intro:
      "교육 지원은 대학 등록금, 생활비, 직업훈련비처럼 지원하는 비용이 다릅니다. 재학 상태와 학기·훈련 시작일을 기준으로 일정을 먼저 확인하세요.",
    checkpoints: [
      {
        title: "학적과 고용 상태",
        description:
          "재학생, 휴학생, 졸업생, 재직자 여부에 따라 장학금과 직업훈련 지원의 대상이 달라집니다.",
      },
      {
        title: "지원 비용의 범위",
        description:
          "등록금 감면, 근로장학금, 훈련비와 훈련장려금은 지급 방식과 본인부담이 서로 다릅니다.",
      },
      {
        title: "신청·수강 순서",
        description:
          "선발이나 카드 발급 전에 등록·결제하면 지원받지 못할 수 있으므로 반드시 공식 절차의 순서를 확인하세요.",
      },
    ],
    selectionTip:
      "학교 장학 담당 부서와 고용24의 안내를 함께 확인하고, 등록금 중복지원 제한과 훈련 과정의 자비부담액을 비교하세요.",
    relatedGuideSlugs: [
      "employment-training-support-comparison-2026",
      "documents-checklist-for-grants",
    ],
  },
  health: {
    intro:
      "의료·건강 지원은 진단명만으로 결정되지 않고 의료비 규모, 건강보험 적용 여부, 가구 소득과 재산을 함께 보는 경우가 많습니다.",
    checkpoints: [
      {
        title: "치료 시급성과 비용",
        description:
          "이미 발생한 의료비인지 앞으로 예상되는 비용인지 구분하고, 본인부담금과 비급여 항목을 정리하세요.",
      },
      {
        title: "보험과 소득 기준",
        description:
          "건강보험료, 의료급여 수급 여부, 재산 기준과 다른 지원을 받은 금액이 심사에 반영되는지 확인하세요.",
      },
      {
        title: "신청 기관과 기한",
        description:
          "병원 의료사회복지팀, 국민건강보험공단, 행정복지센터의 역할이 다르므로 퇴원이나 납부 전에 상담하는 것이 좋습니다.",
      },
    ],
    selectionTip:
      "큰 병원비가 예상되면 납부를 마친 뒤보다 치료 중에 병원 원무팀이나 의료사회복지팀에 지원 가능성을 먼저 문의하세요.",
    relatedGuideSlugs: [
      "medical-cost-support-guide-2026",
      "senior-care-service-guide-2026",
    ],
  },
  living: {
    intro:
      "생활비 지원은 현금 급여와 정해진 용도로 쓰는 바우처로 나뉩니다. 가구 기준과 사용기한을 함께 확인해야 실제로 활용할 수 있습니다.",
    checkpoints: [
      {
        title: "가구 구성과 소득",
        description:
          "같이 사는 가족의 소득과 재산을 합산하는지, 부양의무자나 세대 분리 기준이 적용되는지 확인하세요.",
      },
      {
        title: "현금과 목적형 지원",
        description:
          "생계비처럼 자유롭게 쓰는 급여와 에너지·문화비처럼 사용처가 정해진 바우처를 구분하세요.",
      },
      {
        title: "신청·사용 마감",
        description:
          "연중 신청 제도라도 카드 발급이나 포인트 사용기한이 따로 있을 수 있으므로 일정까지 기록해두세요.",
      },
    ],
    selectionTip:
      "한 가지 급여를 받고 있어도 목적이 다른 바우처를 추가로 확인할 수 있습니다. 중복 가능 여부를 공식 안내에서 다시 확인하세요.",
    relatedGuideSlugs: [
      "low-income-living-support-guide-2026",
      "earned-child-tax-credit-guide-2026",
    ],
  },
  finance: {
    intro:
      "금융 지원은 받는 돈이 아니라 저축 장려, 이자 지원, 보증, 대출인 경우가 많습니다. 만기 혜택과 매달 부담을 함께 계산해야 합니다.",
    checkpoints: [
      {
        title: "저축·대출·보증 구분",
        description:
          "정부기여금을 받는 저축인지, 상환이 필요한 정책대출인지, 금융기관 대출을 돕는 보증인지 먼저 구분하세요.",
      },
      {
        title: "월 납입과 상환 여력",
        description:
          "최대 혜택보다 중도해지 가능성과 비상자금을 고려해 감당할 수 있는 월 납입·상환액을 정하세요.",
      },
      {
        title: "중복과 우대 조건",
        description:
          "기존 정책상품 가입 여부, 소득 구간, 신용 상태, 우대금리 조건과 중복 제한을 확인하세요.",
      },
    ],
    selectionTip:
      "표시된 최대 지원액만 비교하지 말고 유지 기간, 중도해지 불이익, 총이자와 실제 수령액을 기준으로 판단하세요.",
    relatedGuideSlugs: [
      "youth-asset-building-comparison-2026",
      "small-business-support-comparison",
    ],
  },
};
