import { redirect } from "next/navigation";
import { Section } from "@/components/layout/section";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "추천 조건 설정",
  robots: { index: false, follow: false },
};

export default async function AccountProfilePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims?.sub) {
    redirect("/?login=required");
  }

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
            조건 입력과 추천 결과 저장 UI는 다음 구현 단계에서 기존 맞춤 찾기와
            연결됩니다. 현재는 로그인과 회원 데이터 보호 기반까지 준비되었습니다.
          </p>
        </div>
      </Section>
    </main>
  );
}
