import type { CoreDecisionGuide as CoreDecisionGuideData } from "@/lib/grants/core-decision-guides";

export function CoreDecisionGuide({ guide }: { guide: CoreDecisionGuideData }) {
  return (
    <section
      aria-labelledby="core-decision-guide-title"
      style={{
        display: "grid",
        gap: "24px",
        padding: "clamp(24px, 4vw, 40px)",
        border: "1px solid var(--color-hairline)",
        borderRadius: "var(--radius-xl)",
        background: "rgba(255, 255, 255, 0.78)",
      }}
    >
      <div style={{ display: "grid", gap: "10px", maxWidth: "var(--max-width-text)" }}>
        <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>{guide.eyebrow}</p>
        <h2 id="core-decision-guide-title" style={{ margin: 0, fontSize: "var(--text-display-size)", lineHeight: 1.12 }}>
          {guide.title}
        </h2>
        <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "17px", lineHeight: 1.75 }}>
          {guide.description}
        </p>
      </div>

      <ol
        style={{
          margin: 0,
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
          listStyle: "none",
          counterReset: "decision-step",
        }}
      >
        {guide.steps.map((step, index) => (
          <li
            key={step.title}
            style={{
              display: "grid",
              alignContent: "start",
              gap: "12px",
              padding: "22px",
              borderTop: "2px solid var(--color-primary)",
              background: "var(--color-surface-pearl)",
            }}
          >
            <span style={{ color: "var(--color-primary)", fontSize: "13px", fontWeight: 700 }}>
              STEP {index + 1}
            </span>
            <h3 style={{ margin: 0, fontSize: "20px", lineHeight: 1.35 }}>{step.title}</h3>
            <p style={{ margin: 0, color: "var(--color-ink-muted)", lineHeight: 1.72 }}>{step.description}</p>
          </li>
        ))}
      </ol>

      <p
        style={{
          margin: 0,
          maxWidth: "var(--max-width-text)",
          paddingLeft: "16px",
          borderLeft: "3px solid var(--color-primary)",
          color: "var(--color-ink)",
          fontSize: "17px",
          lineHeight: 1.75,
        }}
      >
        {guide.takeaway}
      </p>
    </section>
  );
}
