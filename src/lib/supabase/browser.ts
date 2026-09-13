import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client — Singleton واحد لكل التطبيق
 *
 * ⚠️ قاعدة ذهبية: كل 'use client' يستورد هذا فقط
 * لا تنشئ createClient() ثانية (auth-helpers / supabase-js الخام
 * يستخدمون storage مختلف والجلسة تختفي)
 */
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
