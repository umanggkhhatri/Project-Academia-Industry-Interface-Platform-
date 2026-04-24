/**
 * src/app/api/auth/login/route.ts
 *
 * POST /api/auth/login
 *
 * Authenticates an existing user:
 *   1. Validates email, password, and role
 *   2. Finds user by email (explicitly selects +password)
 *   3. Compares submitted password against bcrypt hash
 *   4. Enforces that the submitted role matches the stored role
 *   5. On success, signs a JWT and sets it as an HTTP-only cookie
 *
 * Body: { email, password, role }
 * Returns: 200 { user }  (no password field)
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, buildSetCookieHeader } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, role } = body as {
      email?: string;
      password?: string;
      role?: string;
    };

    // ── Validation ────────────────────────────────────────────────────────────
    const VALID_ROLES = ['student', 'faculty', 'industry'];
    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: 'A valid role (student, faculty, industry) is required' },
        { status: 400 }
      );
    }

    if (process.env.USE_MOCK_DB === 'true') {
      const safeUser = {
        _id: "mock_user_" + Date.now().toString(),
        name: "Mock " + (role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"),
        email: email.trim().toLowerCase(),
        role: role as any,
        profileComplete: false,
      };
      const token = signToken({
        sub: safeUser._id,
        email: safeUser.email,
        role: safeUser.role,
        name: safeUser.name,
      });
      return NextResponse.json(
        { user: safeUser },
        { status: 200, headers: { 'Set-Cookie': buildSetCookieHeader(token) } }
      );
    }

    // ── Database ──────────────────────────────────────────────────────────────
    await connectToDatabase();

    // Explicitly select password (excluded by schema default)
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select('+password');

    // Use a generic error message to avoid email enumeration
    const INVALID_MSG = 'Invalid email or password';

    if (!user) {
      return NextResponse.json({ error: INVALID_MSG }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: INVALID_MSG }, { status: 401 });
    }

    // ── Role enforcement ──────────────────────────────────────────────────────
    if (user.role !== role) {
      const label = (r: string) => r.charAt(0).toUpperCase() + r.slice(1);
      return NextResponse.json(
        {
          error: `This account is registered as a ${label(user.role)}, not ${label(role!)}. Please use the ${label(user.role)} login page.`,
        },
        { status: 403 }
      );
    }

    // ── Issue JWT ─────────────────────────────────────────────────────────────
    const token = signToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const safeUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      profileComplete: user.profileComplete,
    };

    return NextResponse.json(
      { user: safeUser },
      {
        status: 200,
        headers: { 'Set-Cookie': buildSetCookieHeader(token) },
      }
    );
  } catch (err) {
    console.error('[POST /api/auth/login]', err);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
