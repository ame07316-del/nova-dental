import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Supabase SSR Middleware — Clean & minimal
 *
 * - يجدّد جلسة Supabase في كل طلب (refresh token → cookies)
 * - لازم مع @supabase/ssr عشان الـ Server Components تشوف الـ user الصح
 * - لا يعمل redirect — الحماية تتم في كل page بـ getSessionUser()/guard
 *
 * Docs: https://supabase.com/docs/guides/auth/server-side/nextjs
 */

// وضع الديمو: نفس أسلوب src/lib/supabase/server.ts — لو متغيرات البيئة ناقصة
// نستخدم placeholder صالح الصيغة بدل undefined (اللي بيكسر الـ client).
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: CookieOptions }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: CookieOptions }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // مهم: استدعاء getUser() يجبر تجديد التوكن لو منتهي ويكتب الكوكيز الجديدة
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * يشتغل على كل المسارات ما عدا:
     * - _next/static, _next/image (ملفات Next الداخلية)
     * - favicon والصور الثابتة
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
