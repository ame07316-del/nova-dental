import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Server Supabase client — للـ Server Components و Server Actions فقط
 *
 * - يقرأ/يكتب الكوكيز عبر next/headers
 * - الـ middleware هو من يجدّد التوكن فعليًا؛ هنا نكتب الكوكيز بـ try/catch
 *   لأن Server Component لا يسمح بـ set داخل الـ render
 *
 * ⚠️ لو متغيرات البيئة مش متظبطة الدالة بترمي — استخدم isSupabaseServerConfigured()
 * الأول في الـ Server Actions عشان ترجّع رسالة واضحة بدل استثناء غير متوقع.
 *
 * استخدم getSupabaseBrowser() في أي 'use client' بدلاً من هذا
 */
export function isSupabaseServerConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function createClient(): SupabaseClient {
  if (!isSupabaseServerConfigured()) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // داخل Server Component — middleware سيتكفل بالكتابة
          }
        },
      },
    }
  );
}
