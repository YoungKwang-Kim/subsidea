"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createHousingPlan, initialHousingProfile, type HousingProfile, type HousingResult } from "@/lib/planner/housing-planner-core.mjs";

const storageKey = "subsidea-housing-planner-v1";
const totalSteps = 5;
const levelCopy = {
  priority: { label: "우선 확인", className: "is-priority" },
  consider: { label: "함께 검토", className: "is-consider" },
  check: { label: "추가 확인", className: "is-check" },
  unlikely: { label: "현재는 어려움", className: "is-unlikely" },
} as const;

function track(event: string, details: Record<string, string | number> = {}) {
  const analyticsWindow = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  analyticsWindow.dataLayer?.push({ event, planner_type: "housing", ...details });
}

function ChoiceGroup({ label, value, options, onChange }: { label: string; value: string; options: ReadonlyArray<readonly [string, string]>; onChange: (value: string) => void }) {
  return <fieldset className="planner-fieldset"><legend>{label}</legend><div className="planner-choices">{options.map(([key, copy]) => <button key={key} type="button" className={`planner-choice${value === key ? " is-active" : ""}`} aria-pressed={value === key} onClick={() => onChange(key)}>{copy}</button>)}</div></fieldset>;
}

function ResultCard({ result }: { result: HousingResult }) {
  const copy = levelCopy[result.level];
  return <article className="planner-result-card">
    <div className="planner-result-heading"><div><span className={`planner-level ${copy.className}`}>{copy.label}</span><h3>{result.name}</h3></div><Link href={result.href}>상세 해설 보기</Link></div>
    {result.reasons.length ? <div className="planner-result-block"><strong>판정 근거</strong><ul>{result.reasons.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
    {result.missing.length ? <div className="planner-result-block is-check"><strong>추가로 확인할 정보</strong><ul>{result.missing.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
    {result.cautions.length ? <div className="planner-result-block is-caution"><strong>주의할 조건</strong><ul>{result.cautions.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
    <a className="planner-official-link" href={result.officialUrl} target="_blank" rel="noreferrer" onClick={() => track("planner_official_link", { program_id: result.id })}>공식 기관 자료 · 확인일 {result.checkedAt}</a>
  </article>;
}

export function HousingPlanner() {
  const [profile, setProfile] = useState<HousingProfile>(initialHousingProfile);
  const [step, setStep] = useState(1);
  const [showPlan, setShowPlan] = useState(false);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as { profile?: HousingProfile; showPlan?: boolean };
        if (parsed.profile) setProfile({ ...initialHousingProfile, ...parsed.profile });
        if (parsed.showPlan) setShowPlan(true);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setRestored(true);
    }
  }, []);

  useEffect(() => {
    if (restored) window.localStorage.setItem(storageKey, JSON.stringify({ profile, showPlan }));
  }, [profile, restored, showPlan]);

  const plan = createHousingPlan(profile);
  const update = (key: keyof HousingProfile, value: string) => { setProfile((current) => ({ ...current, [key]: value })); setShowPlan(false); };
  const clear = () => { setProfile(initialHousingProfile); setStep(1); setShowPlan(false); window.localStorage.removeItem(storageKey); };

  return <div className="planner-shell">
    {!showPlan ? <section className="planner-panel planner-no-print" aria-labelledby="housing-question-title">
      <div className="planner-progress-head"><div><p>개인정보를 전송하지 않는 간편 설계</p><strong>{step} / {totalSteps}</strong></div><button type="button" onClick={clear}>입력 전체 삭제</button></div>
      <div className="planner-progress" aria-label={`전체 ${totalSteps}단계 중 ${step}단계`}><span style={{ width: `${step / totalSteps * 100}%` }} /></div>

      {step === 1 ? <div className="planner-step"><p className="planner-kicker">주거 목표</p><h2 id="housing-question-title">어떤 주거비를 해결하고 싶나요?</h2><ChoiceGroup label="필요한 지원" value={profile.goal} onChange={(value) => update("goal", value)} options={[["monthly", "월 임차료"], ["jeonse", "전세보증금"], ["both", "둘 다 검토"], ["unknown", "아직 모름"]]} /></div> : null}
      {step === 2 ? <div className="planner-step"><p className="planner-kicker">가구와 소득</p><h2 id="housing-question-title">가구 규모와 소득 구간을 확인해 주세요</h2>
        <ChoiceGroup label="가구원 수" value={profile.householdSize} onChange={(value) => update("householdSize", value)} options={[["1", "1인"], ["2", "2인"], ["3", "3인"], ["4plus", "4인 이상"], ["unknown", "모름"]]} />
        <ChoiceGroup label="소득인정액이 2026년 주거급여 기준 이하인가요?" value={profile.housingIncome} onChange={(value) => update("housingIncome", value)} options={[["eligible", "기준 이하"], ["over", "기준 초과"], ["unknown", "계산 필요"]]} />
        <ChoiceGroup label="부부합산 세전 연소득" value={profile.annualIncome} onChange={(value) => update("annualIncome", value)} options={[["under50", "5천만 원 이하"], ["under75", "5천만~7,500만 원"], ["under130", "7,500만~1.3억 원"], ["under200", "1.3억~2억 원"], ["over200", "2억 원 초과"], ["unknown", "모름"]]} />
        <ChoiceGroup label="소득 형태" value={profile.incomeType} onChange={(value) => update("incomeType", value)} options={[["dual", "부부 모두 소득 있음"], ["single", "외벌이·1인 가구"], ["unknown", "확인 필요"]]} />
      </div> : null}
      {step === 3 ? <div className="planner-step"><p className="planner-kicker">특례 조건</p><h2 id="housing-question-title">청년·신혼·출산 특례를 확인해 주세요</h2>
        <ChoiceGroup label="신청일 기준 나이" value={profile.age} onChange={(value) => update("age", value)} options={[["youth", "만 19~34세"], ["over34", "만 35세 이상"], ["unknown", "모름"]]} />
        <ChoiceGroup label="혼인 조건" value={profile.maritalStatus} onChange={(value) => update("maritalStatus", value)} options={[["newlywed", "혼인 7년 이내·결혼 예정"], ["other", "그 외"], ["unknown", "확인 필요"]]} />
        <ChoiceGroup label="접수일 기준 2년 이내 출산·입양했나요?" value={profile.newborn} onChange={(value) => update("newborn", value)} options={[["yes", "해당"], ["no", "해당 없음"], ["unknown", "확인 필요"]]} />
      </div> : null}
      {step === 4 ? <div className="planner-step"><p className="planner-kicker">주택과 계약</p><h2 id="housing-question-title">무주택과 임대차계약 조건을 확인해 주세요</h2>
        <ChoiceGroup label="세대원 전원이 무주택인가요?" value={profile.homeless} onChange={(value) => update("homeless", value)} options={[["yes", "전원 무주택"], ["no", "주택 보유자 있음"], ["unknown", "확인 필요"]]} />
        <ChoiceGroup label="임대차계약 후 보증금 5% 이상을 지급했나요?" value={profile.depositPaid} onChange={(value) => update("depositPaid", value)} options={[["yes", "지급 완료"], ["no", "계약 전·미지급"], ["unknown", "확인 필요"]]} />
      </div> : null}
      {step === 5 ? <div className="planner-step"><p className="planner-kicker">기존 대출</p><h2 id="housing-question-title">이미 이용 중인 주택 관련 대출이 있나요?</h2><ChoiceGroup label="기금·은행 전세대출 또는 주택담보대출" value={profile.existingHousingLoan} onChange={(value) => update("existingHousingLoan", value)} options={[["no", "없음"], ["yes", "있음"], ["unknown", "확인 필요"]]} /><p>기존 대출이 있어도 대환·예외 가능성이 있으므로 자동 탈락시키지 않고 상담 항목으로 남깁니다.</p></div> : null}

      <div className="planner-actions"><button type="button" className="planner-secondary-button" disabled={step === 1} onClick={() => setStep((current) => Math.max(1, current - 1))}>이전</button>{step < totalSteps ? <button type="button" className="planner-primary-button" onClick={() => { track("planner_step_complete", { step }); setStep((current) => current + 1); }}>다음</button> : <button type="button" className="planner-primary-button" onClick={() => { track("planner_complete", { result_count: plan.results.length }); setShowPlan(true); }}>내 주거 설계도 만들기</button>}</div>
    </section> : null}

    {showPlan ? <section className="planner-plan" aria-live="polite">
      <div className="planner-plan-hero"><div><p className="planner-kicker">나의 전월세 신청 설계도</p><h2>주거지원 {plan.results.length}종을 목적과 우선순위로 정리했습니다</h2><p>우선 확인 {plan.summary.priority ?? 0}개 · 함께 검토 {plan.summary.consider ?? 0}개 · 추가 확인 {plan.summary.check ?? 0}개</p></div><div className="planner-plan-actions planner-no-print"><button type="button" className="planner-secondary-button" onClick={() => window.print()}>인쇄하기</button><button type="button" className="planner-primary-button" onClick={() => { setShowPlan(false); setStep(1); }}>조건 수정하기</button></div></div>
      <div className="planner-notice">이 결과는 신청 경로를 좁히기 위한 참고 자료입니다. 실제 승인과 한도는 행정기관·기금 수탁은행·보증기관의 심사를 기준으로 합니다.</div>
      <div className="planner-results">{plan.results.map((item) => <ResultCard key={item.id} result={item} />)}</div>
      <div className="planner-plan-grid"><section className="planner-summary-card"><h3>조합과 중복 관계</h3><div className="planner-stack">{plan.compatibility.map((item) => <div key={item.title}><strong>{item.title}</strong><p>{item.description}</p></div>)}</div></section><section className="planner-summary-card"><h3>통합 준비 서류</h3><ul className="planner-checklist">{plan.documents.map((item) => <li key={item}>{item}</li>)}</ul></section></div>
      <section className="planner-summary-card"><h3>추천 진행 순서</h3><ol className="planner-timeline">{plan.timeline.map((item, index) => <li key={item.title}><span>{index + 1}</span><div><strong>{item.title}</strong><p>{item.description}</p></div></li>)}</ol></section>
    </section> : null}
  </div>;
}
