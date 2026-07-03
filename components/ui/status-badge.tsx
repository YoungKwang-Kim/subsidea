import type { GrantStatus } from "@/types/grant";

const badgeMap = {
  open: {
    label: "신청 가능",
    background: "#e8f5e9",
    color: "var(--color-success)",
  },
  closing: {
    label: "마감 임박",
    background: "#fff3cd",
    color: "var(--color-warning)",
  },
  closed: {
    label: "마감",
    background: "#fdecea",
    color: "var(--color-danger)",
  },
} as const;

type StatusBadgeProps = {
  status: GrantStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const badge = badgeMap[status];

  return (
    <span
      className="status-badge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        padding: "4px 10px",
        fontSize: "12px",
        lineHeight: 1.33,
        letterSpacing: "-0.12px",
        whiteSpace: "nowrap",
        background: badge.background,
        color: badge.color,
      }}
    >
      {badge.label}
    </span>
  );
}