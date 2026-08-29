import { redirect } from "next/navigation";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "내 지원계획",
  description: "회원의 지원 조건과 저장한 지원금을 관리합니다.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/?login=required");
  }

  const [{ data: profile }, { data: eligibility }, { count: savedCount }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("eligibility_profiles")
        .select("age_group, situations, housing, income, residence_sido")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("saved_grants")
        .select("grant_slug", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);

  const profileComplete = Boolean(
    eligibility?.age_group && eligibility.housing && eligibility.income,
  );

  return (
    <main>
      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "16px", maxWidth: "760px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)" }}>
            내 지원계획
          </p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)" }}>
            {profile?.display_name
              ? `${profile.display_name}님의 지원 준비 공간`
              : "나에게 맞는 지원금을 준비하는 공간"}
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
            입력한 조건을 바탕으로 지원 가능성이 높은 후보와 확인해야 할 조건을
            한곳에서 정리합니다.
          </p>
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        <div className="account-summary-grid">
          <article className="account-summary-card">
            <span className="account-summary-label">추천 조건</span>
            <strong>
              {profileComplete ? "기본 조건 입력 완료" : "입력 필요"}
            </strong>
            <p>
              연령대·상황·주거·소득 구간을 범주로만 저장하며 정확한 금액이나
              주소는 받지 않습니다.
            </p>
            <Button href="/account/profile" variant="primary" size="sm">
              {profileComplete ? "조건 수정하기" : "조건 입력하기"}
            </Button>
          </article>

          <article className="account-summary-card">
            <span className="account-summary-label">맞춤 추천</span>
            <strong>
              {profileComplete ? "추천 결과 준비됨" : "조건 입력 후 제공"}
            </strong>
            <p>
              저장한 조건과 겹치는 지원금 후보를 추천 이유와 확인사항까지 함께
              정리합니다.
            </p>
            <Button
              href={
                profileComplete
                  ? "/account/recommendations"
                  : "/account/profile"
              }
              variant="secondary"
              size="sm"
            >
              {profileComplete ? "맞춤 추천 보기" : "조건부터 입력하기"}
            </Button>
          </article>

          <article className="account-summary-card">
            <span className="account-summary-label">저장한 지원금</span>
            <strong>{savedCount ?? 0}개</strong>
            <p>
              관심·준비 중·신청 완료 상태를 관리하는 기능은 다음 단계에서
              연결됩니다.
            </p>
          </article>
        </div>
      </Section>
    </main>
  );
}
