import { redirect } from "next/navigation";
import { RecommendationCard } from "@/components/account/recommendation-card";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import type {
  CheckerAgeGroup,
  CheckerHousing,
  CheckerIncome,
  CheckerSituation,
} from "@/lib/checker/filter-grants";
import { getGrants } from "@/lib/grants/get-grants";
import { getMemberRecommendations } from "@/lib/recommendation/member-recommendations";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "맞춤 지원금 추천",
  description: "저장한 조건을 바탕으로 확인할 지원금 후보를 정리합니다.",
  robots: { index: false, follow: false },
};

export default async function AccountRecommendationsPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/?login=required");
  }

  const { data: profile } = await supabase
    .from("eligibility_profiles")
    .select("age_group, situations, housing, income, residence_sido")
    .eq("user_id", userId)
    .maybeSingle();

  const profileComplete = Boolean(
    profile?.age_group && profile.housing && profile.income,
  );

  if (!profileComplete || !profile) {
    return (
      <main>
        <Section surface="light" containerSize="text">
          <div style={{ display: "grid", gap: "18px", justifyItems: "start" }}>
            <p style={{ margin: 0, color: "var(--color-primary)" }}>
              맞춤 추천
            </p>
            <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)" }}>
              추천 조건을 먼저 입력해주세요
            </h1>
            <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
              연령대, 주거 형태와 소득 구간을 저장하면 확인할 지원금 후보를
              설명과 함께 정리해드립니다.
            </p>
            <Button href="/account/profile">추천 조건 입력하기</Button>
          </div>
        </Section>
      </main>
    );
  }

  const grants = await getGrants();
  const recommendations = getMemberRecommendations(grants, {
    ageGroup: profile.age_group as CheckerAgeGroup,
    situations: profile.situations as CheckerSituation[],
    housing: profile.housing as CheckerHousing,
    income: profile.income as CheckerIncome,
    residenceSido: profile.residence_sido,
  });

  return (
    <main>
      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "16px", maxWidth: "780px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)" }}>맞춤 추천</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)" }}>
            지금 확인할 지원금 후보 {recommendations.length}개
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
            저장한 범주형 조건으로 대상을 좁힌 결과입니다. 추천은 신청 가능성을
            보장하지 않으며 기관의 공식 심사 결과가 우선합니다.
          </p>
          <Button href="/account/profile" variant="secondary" size="sm">
            추천 조건 수정하기
          </Button>
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        {recommendations.length > 0 ? (
          <div className="recommendation-grid">
            {recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.grant.id}
                recommendation={recommendation}
              />
            ))}
          </div>
        ) : (
          <div className="recommendation-empty">
            <strong>현재 조건과 겹치는 지원금 후보가 없습니다.</strong>
            <p>
              조건을 넓혀보거나 비회원 자격 체크에서 전체 후보를 확인해주세요.
            </p>
            <Button href="/checker" variant="secondary" size="sm">
              자격 체크 열기
            </Button>
          </div>
        )}
      </Section>
    </main>
  );
}
