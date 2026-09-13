import { createBrowserClient } from '@supabase/ssr';

// Shared singleton browser client (cookie-based session).
// Every client component MUST use this — never create a second browser
// client (auth-helpers / raw supabase-js use different storage and the
// session becomes invisible to the rest of the app, breaking login).
let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowser() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
