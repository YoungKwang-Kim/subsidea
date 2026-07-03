import { CheckerFlow } from "@/components/checker/checker-flow";
import { Section } from "@/components/layout/section";
import { getGrants } from "@/lib/grants/get-grants";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "자격체크",
  description: "설문형 흐름으로 나에게 맞는 지원금을 빠르게 찾습니다.",
  path: "/checker",
  keywords: ["자격 체크", "지원금 추천"],
});

export default async function CheckerPage() {
  const grants = await getGrants();

  return (
    <main>
      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "20px", maxWidth: "760px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>자격 체크</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)", lineHeight: 1.07, fontWeight: 600 }}>
            나에게 맞는 지원금을 설문형으로 빠르게 찾기
          </h1>
          <p style={{ margin: 0, color: "var(--color-ink-muted)", fontSize: "var(--text-subhead-size)", lineHeight: 1.5 }}>
            연령, 현재 상황, 주거 형태, 소득 조건을 바탕으로 지금 확인해볼 만한 지원금 후보를 좁혀드립니다.
          </p>
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        <CheckerFlow grants={grants} />
      </Section>
    </main>
  );
}