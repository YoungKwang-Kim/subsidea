const suggestions = [
  { label: "큰 병원비", query: "병원비" },
  { label: "어르신 돌봄", query: "어르신 돌봄" },
  { label: "전세 대출", query: "전세 대출" },
  { label: "소상공인 공과금", query: "사업자 공과금" },
  { label: "폐업·철거", query: "폐업 철거" },
];

export function SearchSuggestions() {
  return (
    <nav aria-label="추천 검색어" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {suggestions.map((suggestion) => (
        <a
          key={suggestion.query}
          href={`/search?q=${encodeURIComponent(suggestion.query)}`}
          style={{
            minHeight: "36px",
            display: "inline-flex",
            alignItems: "center",
            padding: "7px 12px",
            borderRadius: "var(--radius-pill)",
            border: "1px solid var(--color-hairline)",
            background: "rgba(255, 255, 255, 0.72)",
            color: "var(--color-ink-muted)",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          {suggestion.label}
        </a>
      ))}
    </nav>
  );
}
