import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server Supabase client — للـ Server Components و Server Actions فقط
 *
 * - يقرأ/يكتب الكوكيز عبر next/headers
 * - الـ middleware هو من يجدّد التوكن فعليًا؛ هنا نكتب الكوكيز بـ try/catch
 *   لأن Server Component لا يسمح بـ set داخل الـ render
 *
 * استخدم getSupabaseBrowser() في أي 'use client' بدلاً من هذا
 */
export function createClient() {
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
