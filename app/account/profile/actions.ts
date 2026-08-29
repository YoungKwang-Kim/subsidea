"use server";

import { revalidatePath } from "next/cache";
import {
  ageValues,
  housingValues,
  incomeValues,
  residenceOptions,
  situationValues,
} from "@/lib/checker/options";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const policyVersion = "2026-08-29-member-v1";

function isAllowed<T extends string>(
  value: string,
  allowed: readonly T[],
): value is T {
  return allowed.includes(value as T);
}

export async function saveEligibilityProfile(
  _previousState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    return { status: "error", message: "로그인 상태를 다시 확인해주세요." };
  }

  const ageGroup = String(formData.get("age_group") ?? "");
  const housing = String(formData.get("housing") ?? "");
  const income = String(formData.get("income") ?? "");
  const residence = String(formData.get("residence_sido") ?? "");
  const situations = formData.getAll("situations").map(String);

  if (
    !isAllowed(ageGroup, ageValues) ||
    !isAllowed(housing, housingValues) ||
    !isAllowed(income, incomeValues) ||
    (residence !== "" && !isAllowed(residence, residenceOptions)) ||
    situations.some((value) => !isAllowed(value, situationValues))
  ) {
    return { status: "error", message: "입력값을 다시 확인해주세요." };
  }

  const { data: existingProfile } = await supabase
    .from("eligibility_profiles")
    .select("consented_at")
    .eq("user_id", userId)
    .maybeSingle();

  const consentedAt =
    existingProfile?.consented_at ??
    (formData.get("profile_consent") === "on"
      ? new Date().toISOString()
      : null);

  if (!consentedAt) {
    return {
      status: "error",
      message: "추천 조건 저장과 이용에 동의해주세요.",
    };
  }

  const { error } = await supabase.from("eligibility_profiles").upsert(
    {
      user_id: userId,
      age_group: ageGroup,
      situations,
      housing,
      income,
      residence_sido: residence || null,
      consented_at: consentedAt,
      profile_version: 1,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return {
      status: "error",
      message: "조건을 저장하지 못했습니다. 잠시 후 다시 시도해주세요.",
    };
  }

  if (!existingProfile?.consented_at) {
    const { error: consentError } = await supabase
      .from("consent_history")
      .insert({
        user_id: userId,
        consent_type: "profile_sync",
        policy_version: policyVersion,
      });

    if (consentError) {
      return {
        status: "error",
        message: "조건은 저장됐지만 동의 이력을 기록하지 못했습니다.",
      };
    }
  }

  revalidatePath("/account");
  revalidatePath("/account/profile");
  revalidatePath("/account/recommendations");

  return {
    status: "success",
    message: "추천 조건을 저장했습니다.",
  };
}
