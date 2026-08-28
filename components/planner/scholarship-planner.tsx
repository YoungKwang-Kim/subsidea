"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  createScholarshipPlan,
  initialScholarshipProfile,
  type ScholarshipProfile,
  type ScholarshipResult,
} from "@/lib/planner/scholarship-planner-core.mjs";

const storageKey = "subsidea-scholarship-planner-v1";
const totalSteps = 6;

const levelCopy = {
  priority: { label: "우선 신청", className: "is-priority" },
  consider: { label: "함께 검토", className: "is-consider" },
  check: { label: "추가 확인", className: "is-check" },
  unlikely: { label: "현재는 어려움", className: "is-unlikely" },
} as const;

const existingOptions = [
  ["national-scholarship-type-1", "국가장학금 I유형"],
  ["national-scholarship-type-2", "국가장학금 II유형"],
  ["multi-child-national-scholarship", "다자녀 국가장학금"],
  ["national-work-scholarship", "국가근로장학금"],
  ["housing-stability-scholarship", "주거안정장학금"],
] as const;

function trackPlannerEvent(event: string, details: Record<string, string | number> = {}) {
  const analyticsWindow = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  analyticsWindow.dataLayer?.push({ event, ...details });
}

function ChoiceButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" className={`planner-choice${active ? " is-active" : ""}`} onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  );
}

function ChoiceGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: ReadonlyArray<readonly [string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="planner-fieldset">
      <legend>{label}</legend>
      <div className="planner-choices">
        {options.map(([optionValue, optionLabel]) => (
          <ChoiceButton key={optionValue} active={value === optionValue} onClick={() => onChange(optionValue)}>
            {optionLabel}
          </ChoiceButton>
        ))}
      </div>
    </fieldset>
  );
}

function ResultCard({ result }: { result: ScholarshipResult }) {
  const copy = levelCopy[result.level];
  return (
    <article className="planner-result-card">
      <div className="planner-result-heading">
        <div>
          <span className={`planner-level ${copy.className}`}>{copy.label}</span>
          <h3>{result.name}</h3>
        </div>
        <Link href={result.href}>상세 해설 보기</Link>
      </div>

      {result.reasons.length > 0 ? (
        <div className="planner-result-block">
          <strong>추천 근거</strong>
          <ul>{result.reasons.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      ) : null}
      {result.missing.length > 0 ? (
        <div className="planner-result-block is-check">
          <strong>추가로 확인할 정보</strong>
          <ul>{result.missing.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      ) : null}
      {result.cautions.length > 0 ? (
        <div className="planner-result-block is-caution">
          <strong>주의할 조건</strong>
          <ul>{result.cautions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      ) : null}

      <a href={result.officialUrl} target="_blank" rel="noreferrer" className="planner-official-link" onClick={() => trackPlannerEvent("planner_official_link", { program_id: result.id })}>
        한국장학재단 공식 자료 · 확인일 {result.checkedAt}
      </a>
    </article>
  );
}

export function ScholarshipPlanner() {
  const [profile, setProfile] = useState<ScholarshipProfile>(initialScholarshipProfile);
  const [step, setStep] = useState(1);
  const [showPlan, setShowPlan] = useState(false);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as { profile?: ScholarshipProfile; showPlan?: boolean };
        if (parsed.profile) setProfile({ ...initialScholarshipProfile, ...parsed.profile });
        if (parsed.showPlan) setShowPlan(true);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setRestored(true);
    }
  }, []);

  useEffect(() => {
    if (!restored) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ profile, showPlan }));
  }, [profile, restored, showPlan]);

  const plan = createScholarshipPlan(profile);
  const update = (key: keyof ScholarshipProfile, value: string | string[]) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setShowPlan(false);
  };
  const toggleArray = (key: "goals" | "existingPrograms", value: string) => {
    const current = profile[key];
    update(key, current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };
  const clearPlan = () => {
    setProfile(initialScholarshipProfile);
    setStep(1);
    setShowPlan(false);
    window.localStorage.removeItem(storageKey);
  };

  return (
    <div className="planner-shell">
      {!showPlan ? (
      <section className="planner-panel planner-no-print" aria-labelledby="planner-question-title">
        <div className="planner-progress-head">
          <div>
            <p>개인정보를 전송하지 않는 간편 설계</p>
            <strong>{step} / {totalSteps}</strong>
          </div>
          <button type="button" onClick={clearPlan}>입력 전체 삭제</button>
        </div>
        <div className="planner-progress" aria-label={`전체 ${totalSteps}단계 중 ${step}단계`}>
          <span style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>

        {step === 1 ? (
          <div className="planner-step">
            <p className="planner-kicker">목표</p>
            <h2 id="planner-question-title">어떤 비용을 해결하고 싶나요?</h2>
            <p>복수 선택할 수 있습니다. 선택한 목적을 기준으로 추천 순서를 조정합니다.</p>
            <div className="planner-choices">
              {([ ["tuition", "등록금"], ["housing", "주거비"], ["living", "생활비"] ] as const).map(([value, label]) => (
                <ChoiceButton key={value} active={profile.goals.includes(value)} onClick={() => toggleArray("goals", value)}>{label}</ChoiceButton>
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="planner-step">
            <p className="planner-kicker">학적</p>
            <h2 id="planner-question-title">현재 학적과 전공을 알려주세요</h2>
            <ChoiceGroup label="현재 학적" value={profile.academicStatus} onChange={(value) => update("academicStatus", value)} options={[["first-year", "신입생"], ["continuing", "재학생"], ["transfer", "편입·재입학생"], ["not-enrolled", "현재 재학생 아님"], ["unknown", "잘 모르겠음"]]} />
            <ChoiceGroup label="현재 학년" value={profile.year} onChange={(value) => update("year", value)} options={[["1", "1학년"], ["2", "2학년"], ["3", "3학년"], ["4", "4학년 이상"], ["unknown", "미정·모름"]]} />
            <ChoiceGroup label="대학의 공식 전공계열" value={profile.major} onChange={(value) => update("major", value)} options={[["humanities", "인문·사회"], ["stem", "자연과학·공학"], ["other", "그 외 계열"], ["unknown", "잘 모르겠음"]]} />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="planner-step">
            <p className="planner-kicker">학업</p>
            <h2 id="planner-question-title">최근 성적과 이수학점을 확인해 주세요</h2>
            <ChoiceGroup label="직전 학기 백분위 성적" value={profile.grade} onChange={(value) => update("grade", value)} options={[["below70", "70점 미만"], ["70to79", "70~79점"], ["80to89", "80~89점"], ["90plus", "90점 이상"], ["unknown", "신입생·모름"]]} />
            <ChoiceGroup label="학교가 요구하는 최소 이수학점" value={profile.credits} onChange={(value) => update("credits", value)} options={[["eligible", "충족"], ["below", "미충족"], ["unknown", "신입생·모름"]]} />
          </div>
        ) : null}

        {step === 4 ? (
          <div className="planner-step">
            <p className="planner-kicker">가구 조건</p>
            <h2 id="planner-question-title">지원구간과 가구 조건을 선택해 주세요</h2>
            <ChoiceGroup label="국적" value={profile.nationality} onChange={(value) => update("nationality", value)} options={[["korean", "대한민국"], ["other", "그 외"], ["unknown", "확인 필요"]]} />
            <ChoiceGroup label="학자금 지원구간" value={profile.supportBand} onChange={(value) => update("supportBand", value)} options={[["basic", "기초·차상위"], ["1to3", "1~3구간"], ["4to6", "4~6구간"], ["7to8", "7~8구간"], ["9", "9구간"], ["10plus", "10구간 이상"], ["unknown", "모름"]]} />
            <ChoiceGroup label="대한민국 국적 자녀 수" value={profile.siblingCount} onChange={(value) => update("siblingCount", value)} options={[["under3", "3명 미만"], ["3plus", "3명 이상"], ["unknown", "모름"]]} />
            <ChoiceGroup label="나의 출생 순위" value={profile.birthOrder} onChange={(value) => update("birthOrder", value)} options={[["first-second", "첫째·둘째"], ["thirdplus", "셋째 이상"], ["unknown", "모름"]]} />
          </div>
        ) : null}

        {step === 5 ? (
          <div className="planner-step">
            <p className="planner-kicker">생활 조건</p>
            <h2 id="planner-question-title">주거와 근로 가능 여부를 알려주세요</h2>
            <ChoiceGroup label="신청연도 기준 나이" value={profile.age} onChange={(value) => update("age", value)} options={[["under40", "만 39세 이하"], ["40plus", "만 40세 이상"], ["unknown", "모름"]]} />
            <ChoiceGroup label="혼인 여부" value={profile.maritalStatus} onChange={(value) => update("maritalStatus", value)} options={[["unmarried", "미혼"], ["married", "기혼"], ["unknown", "확인 필요"]]} />
            <ChoiceGroup label="부모 주소지에서 대학까지 원거리인가요?" value={profile.remoteStudy} onChange={(value) => update("remoteStudy", value)} options={[["yes", "원거리"], ["no", "통학 가능 거리"], ["unknown", "대학 기준 확인 필요"]]} />
            <ChoiceGroup label="학업과 근로를 병행할 수 있나요?" value={profile.canWork} onChange={(value) => update("canWork", value)} options={[["yes", "가능"], ["no", "어려움"], ["unknown", "아직 모름"]]} />
          </div>
        ) : null}

        {step === 6 ? (
          <div className="planner-step">
            <p className="planner-kicker">현재 신청 상태</p>
            <h2 id="planner-question-title">이미 신청했거나 받고 있는 장학금이 있나요?</h2>
            <p>없다면 선택하지 않고 결과 보기를 눌러도 됩니다.</p>
            <div className="planner-choices">
              {existingOptions.map(([value, label]) => (
                <ChoiceButton key={value} active={profile.existingPrograms.includes(value)} onClick={() => toggleArray("existingPrograms", value)}>{label}</ChoiceButton>
              ))}
            </div>
          </div>
        ) : null}

        <div className="planner-actions">
          <button type="button" className="planner-secondary-button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>이전</button>
          {step < totalSteps ? (
            <button type="button" className="planner-primary-button" onClick={() => { trackPlannerEvent("planner_step_complete", { step }); setStep((current) => Math.min(totalSteps, current + 1)); }}>다음</button>
          ) : (
            <button type="button" className="planner-primary-button" onClick={() => { trackPlannerEvent("planner_complete", { result_count: plan.results.length }); setShowPlan(true); }}>내 신청 설계도 만들기</button>
          )}
        </div>
      </section>
      ) : null}

      {showPlan ? (
        <section className="planner-plan" aria-live="polite">
          <div className="planner-plan-hero">
            <div>
              <p className="planner-kicker">나의 신청 설계도</p>
              <h2>장학금 {plan.results.length}종을 목적과 신청 순서로 정리했습니다</h2>
              <p>우선 신청 {plan.summary.priority ?? 0}개 · 함께 검토 {plan.summary.consider ?? 0}개 · 추가 확인 {plan.summary.check ?? 0}개</p>
            </div>
            <div className="planner-plan-actions planner-no-print">
              <button type="button" className="planner-secondary-button" onClick={() => window.print()}>인쇄하기</button>
              <button type="button" className="planner-primary-button" onClick={() => { setShowPlan(false); setStep(1); }}>조건 수정하기</button>
            </div>
          </div>

          <div className="planner-notice">이 결과는 입력한 조건을 기준으로 확인 순서를 정리한 참고 자료입니다. 최종 선발과 지급액은 한국장학재단과 소속 대학의 심사를 기준으로 합니다.</div>

          <div className="planner-results">
            {plan.results.map((result) => <ResultCard key={result.id} result={result} />)}
          </div>

          <div className="planner-plan-grid">
            <section className="planner-summary-card">
              <h3>장학금 조합과 중복 관계</h3>
              <div className="planner-stack">
                {plan.compatibility.map((item) => (
                  <div key={item.title}><strong>{item.title}</strong><p>{item.description}</p></div>
                ))}
              </div>
            </section>
            <section className="planner-summary-card">
              <h3>통합 준비 서류</h3>
              <ul className="planner-checklist">{plan.documents.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>

          <section className="planner-summary-card">
            <h3>추천 신청 순서</h3>
            <ol className="planner-timeline">
              {plan.timeline.map((item, index) => <li key={item.title}><span>{index + 1}</span><div><strong>{item.title}</strong><p>{item.description}</p></div></li>)}
            </ol>
          </section>
        </section>
      ) : null}
    </div>
  );
}
