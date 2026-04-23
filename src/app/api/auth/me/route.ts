/**
 * src/app/api/auth/me/route.ts
 *
 * GET /api/auth/me
 *
 * Returns the currently authenticated user by reading the JWT
 * from the HTTP-only cookie. Used by AuthProvider on mount to
 * rehydrate session state without a full page reload.
 *
 * Returns:
 *   200 { user }   — valid session; user object (no password)
 *   401 { error }  — no cookie, invalid token, or expired token
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // ── Read cookie ───────────────────────────────────────────────────────────
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // ── Verify JWT ────────────────────────────────────────────────────────────
    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    // ── Fetch fresh user data from DB ─────────────────────────────────────────
    await connectToDatabase();
    const user = await User.findById(payload.sub).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const safeUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      organization: user.organization,
      phone: user.phone,
      bio: user.bio,
      profileComplete: user.profileComplete,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return NextResponse.json({ user: safeUser }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/auth/me]', err);
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
