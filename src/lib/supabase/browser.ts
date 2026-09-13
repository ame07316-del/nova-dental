import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser Supabase client — Singleton واحد لكل التطبيق
 *
 * ⚠️ قاعدة ذهبية: كل 'use client' يستورد هذا فقط
 * لا تنشئ createClient() ثانية (auth-helpers / supabase-js الخام
 * يستخدمون storage مختلف والجلسة تختفي)
 *
 * ⚠️ لو متغيرات البيئة مش متظبطة الدالة بترجع null (بدل ما تكرّش التطبيق)
 * — استخدم isSupabaseConfigured() لعرض وضع العرض التجريبي.
 */
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

let client: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
