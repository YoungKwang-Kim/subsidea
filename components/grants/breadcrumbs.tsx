import Link from "next/link";

type BreadcrumbItem = {
  href?: string;
  label: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="빵부스러기">
      <ol
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "8px",
          listStyle: "none",
          padding: 0,
          margin: 0,
          color: "var(--color-ink-muted)",
          fontSize: "14px",
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {item.href && !isLast ? (
                <Link href={item.href} style={{ color: "var(--color-ink-muted)" }}>
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: isLast ? "var(--color-ink)" : "var(--color-ink-muted)" }}>
                  {item.label}
                </span>
              )}
              {!isLast ? <span aria-hidden="true">›</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
