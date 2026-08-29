import { redirect } from "next/navigation";
import { EligibilityProfileForm } from "@/components/account/eligibility-profile-form";
import { Section } from "@/components/layout/section";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "추천 조건 설정",
  robots: { index: false, follow: false },
};

export default async function AccountProfilePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (!userId) {
    redirect("/?login=required");
  }

  const { data: profile } = await supabase
    .from("eligibility_profiles")
    .select(
      "age_group, situations, housing, income, residence_sido, consented_at",
    )
    .eq("user_id", userId)
    .maybeSingle();

  return (
    <main>
      <Section surface="light" containerSize="text">
        <div style={{ display: "grid", gap: "16px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)" }}>
            추천 조건 설정
          </p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)" }}>
            필요한 조건만 안전하게 저장할게요
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>
            정확한 생년월일이나 소득액 대신 범주형 조건만 저장합니다. 추천
            결과는 신청 자격을 보장하지 않으며 최종 판단은 공식 공고에서
            확인해야 합니다.
          </p>
        </div>
      </Section>

      <Section surface="parchment" containerSize="text">
        <EligibilityProfileForm initialValues={profile} />
      </Section>
    </main>
  );
}
