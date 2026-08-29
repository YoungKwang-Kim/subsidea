const defaultSupabaseUrl = "https://nsqkjiuchkqdbsbkzqjn.supabase.co";
const defaultSupabasePublishableKey =
  "sb_publishable_OZa591v5dUt_sKYyFvWzKQ_SH4WO1GP";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? defaultSupabaseUrl;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  defaultSupabasePublishableKey;

export function getSupabaseConfig() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are required.",
    );
  }

  return {
    url: supabaseUrl,
    publishableKey: supabasePublishableKey,
  };
}
