/**
 * src/app/api/auth/logout/route.ts
 *
 * POST /api/auth/logout
 *
 * Clears the JWT cookie by setting Max-Age=0.
 * Returns: 200 { message }
 */

import { NextResponse } from 'next/server';
import { buildClearCookieHeader } from '@/lib/auth';

export async function POST() {
  return NextResponse.json(
    { message: 'Logged out successfully' },
    {
      status: 200,
      headers: { 'Set-Cookie': buildClearCookieHeader() },
    }
  );
}
