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

// وضع الديمو: بيانات بصيغة صحيحة عشان الـ client يت construct عادي بدون ما يرمي،
// وأي استعلام فعلي هيفشل بهدوء (network error) وكل action يرجّعه كـ ActionResult.
const DEMO_URL = 'http://127.0.0.1:54321';
const DEMO_KEY = 'demo-anon-key';

export function createClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseUrl = url && key ? url : DEMO_URL;
  const supabaseKey = url && key ? key : DEMO_KEY;
  const cookieStore = cookies();

  return createServerClient(
    supabaseUrl,
    supabaseKey,
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
