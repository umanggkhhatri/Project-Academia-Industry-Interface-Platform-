/**
 * src/app/api/auth/register/route.ts
 *
 * POST /api/auth/register
 *
 * Registers a new user:
 *   1. Validates input fields
 *   2. Checks email is not already taken
 *   3. Hashes the password with bcrypt
 *   4. Creates a User document in MongoDB
 *   5. Signs a JWT and sets it as an HTTP-only cookie
 *
 * Body: { name, email, password, role }
 * Returns: 201 { user }  (no password field)
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken, buildSetCookieHeader } from '@/lib/auth';

const VALID_ROLES = ['student', 'faculty', 'industry'] as const;
type UserRole = (typeof VALID_ROLES)[number];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, department, organization, phone } = body as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      department?: string;
      organization?: string;
      phone?: string;
    };

    // ── Validation ────────────────────────────────────────────────────────────
    if (!name?.trim() || !email?.trim() || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, password, role' },
        { status: 400 }
      );
    }
    if (!VALID_ROLES.includes(role as UserRole)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (process.env.USE_MOCK_DB === 'true') {
      const safeUser = {
        _id: "mock_user_" + Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: role as UserRole,
        profileComplete: false,
        createdAt: new Date(),
      };
      const token = signToken({
        sub: safeUser._id,
        email: safeUser.email,
        role: safeUser.role,
        name: safeUser.name,
      });
      return NextResponse.json(
        { user: safeUser },
        { status: 201, headers: { 'Set-Cookie': buildSetCookieHeader(token) } }
      );
    }

    // ── Database ──────────────────────────────────────────────────────────────
    await connectToDatabase();

    // Check for duplicate email (case-insensitive via schema lowercase: true)
    const existing = await User.findOne({ email: email.trim().toLowerCase() }).lean();
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: passwordHash,
      role: role as UserRole,
      ...(department && { department }),
      ...(organization && { organization }),
      ...(phone && { phone }),
      profileComplete: false,
    });

    // ── Issue JWT ─────────────────────────────────────────────────────────────
    const token = signToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Return user without password
    const safeUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      profileComplete: user.profileComplete,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { user: safeUser },
      {
        status: 201,
        headers: { 'Set-Cookie': buildSetCookieHeader(token) },
      }
    );
  } catch (err) {
    console.error('[POST /api/auth/register]', err);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
