export type GrantCategory =
  | "youth"
  | "family"
  | "business"
  | "welfare"
  | "senior";

export type GrantTopic =
  | "housing"
  | "employment"
  | "education"
  | "health"
  | "living"
  | "finance";

export type GrantStatus = "open" | "closing" | "closed";

export type GrantTarget = {
  age_min: number | null;
  age_max: number | null;
  income: string;
  conditions: string[];
};

export type GrantBenefit = {
  amount: string;
  duration: string;
  type: string;
};

export type GrantPeriod = {
  start: string | null;
  end: string | null;
  is_ongoing: boolean;
};

export type GrantFaq = {
  question: string;
  answer: string;
};

export type Grant = {
  id: string;
  name: string;
  slug: string;
  category: GrantCategory[];
  topic: GrantTopic[];
  summary: string;
  overview: string;
  target: GrantTarget;
  benefit: GrantBenefit;
  benefit_details: string[];
  period: GrantPeriod;
  application_organization: string;
  application_steps: string[];
  required_documents: string[];
  faq: GrantFaq[];
  apply_url: string;
  source_url: string;
  status: GrantStatus;
  tags: string[];
  last_updated: string;
};

export type GrantsData = {
  updated_at: string;
  grants: Grant[];
};
