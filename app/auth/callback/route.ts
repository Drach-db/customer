import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next') ?? '/inbox';

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (!error) {
      // Redirect to the specified page or inbox
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // If there's an error, redirect to login with error message
  return NextResponse.redirect(new URL('/login?error=verification_failed', request.url));
}
