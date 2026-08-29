import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import type { MemberRecommendation } from "@/lib/recommendation/member-recommendations";

type RecommendationCardProps = {
  recommendation: MemberRecommendation;
};

export function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const { grant, reasons, cautions } = recommendation;

  return (
    <article className="recommendation-card">
      <div className="recommendation-card-header">
        <div>
          <p>{grant.category.join(" · ")}</p>
          <h2>{grant.name}</h2>
        </div>
        <StatusBadge status={grant.status} />
      </div>

      <p className="recommendation-summary">{grant.summary}</p>

      <div className="recommendation-reason-box">
        <strong>추천한 이유</strong>
        <ul>
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>

      <div className="recommendation-caution-box">
        <strong>신청 전 확인</strong>
        <ul>
          {cautions.map((caution) => (
            <li key={caution}>{caution}</li>
          ))}
        </ul>
      </div>

      <Link
        href={`/grant/${grant.slug}`}
        className="recommendation-detail-link"
      >
        상세 조건 확인하기
      </Link>
    </article>
  );
}
