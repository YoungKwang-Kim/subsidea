"use client";

import { useMemo, useState } from "react";
import { GrantCard } from "@/components/grants/grant-card";
import type { Grant } from "@/types/grant";
import {
  filterGrantsByChecker,
  type CheckerAgeGroup,
  type CheckerAnswers,
  type CheckerHousing,
  type CheckerIncome,
  type CheckerSituation,
} from "@/lib/checker/filter-grants";

const ageOptions: Array<{ value: CheckerAgeGroup; label: string }> = [
  { value: "under19", label: "19세 미만" },
  { value: "19to34", label: "19~34세" },
  { value: "35to49", label: "35~49세" },
  { value: "50plus", label: "50세 이상" },
];

const situationOptions: Array<{ value: CheckerSituation; label: string }> = [
  { value: "job-seeking", label: "구직중" },
  { value: "employed", label: "재직중" },
  { value: "self-employed", label: "자영업" },
  { value: "parenting", label: "육아중" },
  { value: "student", label: "학생" },
];

const housingOptions: Array<{ value: CheckerHousing; label: string }> = [
  { value: "jeonse", label: "전세" },
  { value: "wolse", label: "월세" },
  { value: "homeowner", label: "자가" },
  { value: "other", label: "기타" },
];

const incomeOptions: Array<{ value: CheckerIncome; label: string }> = [
  { value: "under50", label: "중위소득 50% 이하" },
  { value: "under100", label: "100% 이하" },
  { value: "under150", label: "150% 이하" },
  { value: "any", label: "무관" },
];

const initialAnswers: CheckerAnswers = {
  ageGroup: null,
  situations: [],
  housing: null,
  income: null,
};

type CheckerFlowProps = {
  grants: Grant[];
};

function OptionButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: "44px",
        padding: "10px 16px",
        borderRadius: "var(--radius-pill)",
        border: active ? "1px solid var(--color-primary)" : "1px solid var(--color-hairline)",
        background: active ? "rgba(0, 102, 204, 0.06)" : "var(--color-canvas)",
        color: active ? "var(--color-primary)" : "var(--color-ink)",
      }}
    >
      {label}
    </button>
  );
}

export function CheckerFlow({ grants }: CheckerFlowProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<CheckerAnswers>(initialAnswers);

  const results = useMemo(() => filterGrantsByChecker(grants, answers), [grants, answers]);

  return (
    <div style={{ display: "grid", gap: "32px" }}>
      <div
        style={{
          display: "grid",
          gap: "20px",
          padding: "24px",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-hairline)",
          background: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[1, 2, 3, 4].map((currentStep) => (
            <span
              key={currentStep}
              style={{
                minWidth: "36px",
                height: "36px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "9999px",
                background: currentStep === step ? "var(--color-primary)" : "var(--color-canvas-parchment)",
                color: currentStep === step ? "#fff" : "var(--color-ink-muted)",
                fontSize: "14px",
              }}
            >
              {currentStep}
            </span>
          ))}
        </div>

        {step === 1 ? (
          <div style={{ display: "grid", gap: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)" }}>1. 연령대를 선택해주세요</h2>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {ageOptions.map((option) => (
                <OptionButton
                  key={option.value}
                  label={option.label}
                  active={answers.ageGroup === option.value}
                  onClick={() => setAnswers((current) => ({ ...current, ageGroup: option.value }))}
                />
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div style={{ display: "grid", gap: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)" }}>2. 현재 상황을 골라주세요</h2>
            <p style={{ margin: 0, color: "var(--color-ink-muted)" }}>복수 선택이 가능합니다.</p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {situationOptions.map((option) => {
                const active = answers.situations.includes(option.value);

                return (
                  <OptionButton
                    key={option.value}
                    label={option.label}
                    active={active}
                    onClick={() =>
                      setAnswers((current) => ({
                        ...current,
                        situations: active
                          ? current.situations.filter((item) => item !== option.value)
                          : [...current.situations, option.value],
                      }))
                    }
                  />
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div style={{ display: "grid", gap: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)" }}>3. 주거 형태를 선택해주세요</h2>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {housingOptions.map((option) => (
                <OptionButton
                  key={option.value}
                  label={option.label}
                  active={answers.housing === option.value}
                  onClick={() => setAnswers((current) => ({ ...current, housing: option.value }))}
                />
              ))}
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div style={{ display: "grid", gap: "16px" }}>
            <h2 style={{ margin: 0, fontSize: "var(--text-title-size)" }}>4. 소득 수준을 선택해주세요</h2>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {incomeOptions.map((option) => (
                <OptionButton
                  key={option.value}
                  label={option.label}
                  active={answers.income === option.value}
                  onClick={() => setAnswers((current) => ({ ...current, income: option.value }))}
                />
              ))}
            </div>
          </div>
        ) : null}


      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div>
          <strong style={{ display: "block", fontSize: "21px" }}>현재 조건에 맞는 지원금 {results.length}개</strong>
          <p style={{ margin: "8px 0 0", color: "var(--color-ink-muted)" }}>
            실제 정책 해석은 더 복잡할 수 있으므로 최종 신청 전 공식 공고를 꼭 확인해주세요.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(1, current - 1))}
            style={{
              minHeight: "44px",
              padding: "11px 22px",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--color-primary)",
              background: "transparent",
              color: "var(--color-primary)",
            }}
          >
            이전
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(4, current + 1))}
              style={{
                minHeight: "44px",
                padding: "11px 22px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid transparent",
                background: "var(--color-primary)",
                color: "#fff",
              }}
            >
              다음
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAnswers(initialAnswers);
                setStep(1);
              }}
              style={{
                minHeight: "44px",
                padding: "11px 22px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid transparent",
                background: "var(--color-primary)",
                color: "#fff",
              }}
            >
              다시 선택하기
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--grid-gap)",
        }}
      >
        {results.map((grant) => (
          <GrantCard key={grant.id} grant={grant} />
        ))}
      </div>

      {results.length === 0 ? (
        <div
          style={{
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-hairline)",
            background: "rgba(255,255,255,0.9)",
            padding: "24px",
          }}
        >
          <strong style={{ display: "block", fontSize: "17px" }}>현재 조건에 딱 맞는 샘플 결과가 아직 적습니다.</strong>
          <p style={{ margin: "10px 0 0", color: "var(--color-ink-muted)" }}>
            추후 크롤링 데이터가 늘어나면 더 정확한 추천이 가능해집니다. 일단 대상별 또는 분야별 목록도 함께 확인해보세요.
          </p>
        </div>
      ) : null}
    </div>
  );
}


