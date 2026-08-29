"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  saveEligibilityProfile,
  type ProfileFormState,
} from "@/app/account/profile/actions";
import {
  ageOptions,
  housingOptions,
  incomeOptions,
  residenceOptions,
  situationOptions,
} from "@/lib/checker/options";

export type EligibilityProfileValues = {
  age_group: string | null;
  situations: string[];
  housing: string | null;
  income: string | null;
  residence_sido: string | null;
  consented_at: string | null;
};

const initialState: ProfileFormState = { status: "idle", message: "" };

type EligibilityProfileFormProps = {
  initialValues: EligibilityProfileValues | null;
};

export function EligibilityProfileForm({
  initialValues,
}: EligibilityProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveEligibilityProfile,
    initialState,
  );

  return (
    <form action={formAction} className="profile-form">
      <fieldset className="profile-fieldset">
        <legend>연령대</legend>
        <div className="profile-choice-grid">
          {ageOptions.map((option) => (
            <label key={option.value} className="profile-choice">
              <input
                type="radio"
                name="age_group"
                value={option.value}
                defaultChecked={initialValues?.age_group === option.value}
                required
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="profile-fieldset">
        <legend>현재 상황</legend>
        <p>해당하는 항목을 모두 선택할 수 있습니다.</p>
        <div className="profile-choice-grid">
          {situationOptions.map((option) => (
            <label key={option.value} className="profile-choice">
              <input
                type="checkbox"
                name="situations"
                value={option.value}
                defaultChecked={initialValues?.situations.includes(
                  option.value,
                )}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="profile-select-grid">
        <label className="profile-select-field">
          <span>주거 형태</span>
          <select
            name="housing"
            defaultValue={initialValues?.housing ?? ""}
            required
          >
            <option value="" disabled>
              선택해주세요
            </option>
            {housingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="profile-select-field">
          <span>소득 구간</span>
          <select
            name="income"
            defaultValue={initialValues?.income ?? ""}
            required
          >
            <option value="" disabled>
              선택해주세요
            </option>
            {incomeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="profile-select-field">
          <span>거주 시도</span>
          <select
            name="residence_sido"
            defaultValue={initialValues?.residence_sido ?? ""}
          >
            <option value="">선택하지 않음</option>
            {residenceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!initialValues?.consented_at ? (
        <label className="profile-consent">
          <input type="checkbox" name="profile_consent" required />
          <span>
            선택한 범주형 조건을 맞춤 지원금 추천과 여러 기기 동기화를 위해
            계정에 저장하는 데 동의합니다.
          </span>
        </label>
      ) : (
        <p className="profile-consent-note">
          추천 조건 저장에 동의한 상태입니다. 정확한 금액·상세 주소·증명서
          정보는 저장하지 않습니다.
        </p>
      )}

      {state.message ? (
        <p
          className={`profile-form-message profile-form-message-${state.status}`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      <div className="profile-form-actions">
        <button
          type="submit"
          className="profile-submit-button"
          disabled={isPending}
        >
          {isPending ? "저장 중" : "추천 조건 저장"}
        </button>
        {state.status === "success" ? (
          <Link href="/account/recommendations" className="profile-result-link">
            맞춤 추천 확인하기
          </Link>
        ) : null}
      </div>
    </form>
  );
}
