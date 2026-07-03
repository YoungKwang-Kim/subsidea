import { GrantCard } from "@/components/grants/grant-card";
import { Section } from "@/components/layout/section";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/search-input";
import { getGrants } from "@/lib/grants/get-grants";
import { createMetadata } from "@/lib/seo/metadata";
import { searchGrants } from "@/lib/search/search-grants";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const metadata = createMetadata({
  title: "검색",
  description: "지원금명, 키워드, 대상 기준으로 지원금을 검색합니다.",
  path: "/search",
  keywords: ["검색", "지원금 검색"],
});

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const grants = await getGrants();
  const results = searchGrants(grants, q);

  return (
    <main>
      <Section surface="light" containerSize="wide">
        <div style={{ display: "grid", gap: "20px", maxWidth: "760px" }}>
          <p style={{ margin: 0, color: "var(--color-primary)", fontSize: "14px" }}>검색</p>
          <h1 style={{ margin: 0, fontSize: "var(--text-hero-size)", lineHeight: 1.07, fontWeight: 600 }}>
            찾고 싶은 지원금을 검색해보세요
          </h1>
          <SearchInput defaultValue={q} />
        </div>
      </Section>

      <Section surface="parchment" containerSize="wide">
        {!q ? (
          <EmptyState
            title="검색어를 입력해주세요"
            description="지원금명, 대상, 키워드로 검색하면 관련 지원금 목록을 바로 보여줍니다."
            actionHref="/"
            actionLabel="홈으로 이동"
          />
        ) : results.length === 0 ? (
          <EmptyState
            title={`'${q}'에 대한 결과가 없습니다`}
            description="다른 키워드로 다시 검색하거나 대상별/분야별 탐색으로 넓게 찾아보세요."
            actionHref="/category/youth"
            actionLabel="대상별 보기"
          />
        ) : (
          <div style={{ display: "grid", gap: "24px" }}>
            <div>
              <strong style={{ display: "block", fontSize: "21px" }}>검색 결과 {results.length}개</strong>
              <p style={{ margin: "8px 0 0", color: "var(--color-ink-muted)" }}>
                &apos;{q}&apos;와 관련도가 높은 순서로 정렬했습니다.
              </p>
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
          </div>
        )}
      </Section>
    </main>
  );
}