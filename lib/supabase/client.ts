import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null =
  null;

export function createClient() {
  if (browserClient) {
    return browserClient;
  }

  const { url, publishableKey } = getSupabaseConfig();
  browserClient = createBrowserClient<Database>(url, publishableKey);

  return browserClient;
}
