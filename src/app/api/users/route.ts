/**
 * src/app/api/users/route.ts
 *
 * GET  /api/users?uid=<uid>           — Fetch a single user by Firebase UID
 * GET  /api/users?role=student        — Fetch all users with a given role (faculty use)
 * POST /api/users                     — Upsert a user document (called on first login)
 * PUT  /api/users?uid=<uid>           — Update profile fields
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

// ─── GET ────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = req.nextUrl;
    const uid = searchParams.get('uid');
    const role = searchParams.get('role');

    if (uid) {
      // Fetch a single user
      const user = await User.findOne({ uid }).lean();
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ user }, { status: 200 });
    }

    if (role) {
      // Fetch all users with a given role
      const users = await User.find({ role })
        .sort({ name: 1 })
        .lean();
      return NextResponse.json({ users }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Provide ?uid= or ?role= query parameter' },
      { status: 400 }
    );
  } catch (err) {
    console.error('[GET /api/users]', err);
    return NextResponse.json(
      { error: 'Failed to fetch user(s)' },
      { status: 500 }
    );
  }
}

// ─── POST ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { uid, name, email, role, department, organization, phone, bio } = body;

    if (!uid || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: uid, role' },
        { status: 400 }
      );
    }

    // Upsert: create if not exists, update if exists (based on Firebase UID)
    const user = await User.findOneAndUpdate(
      { uid },
      {
        $setOnInsert: { uid, createdAt: new Date() },
        $set: {
          ...(name && { name }),
          ...(email && { email }),
          role,
          ...(department !== undefined && { department }),
          ...(organization !== undefined && { organization }),
          ...(phone !== undefined && { phone }),
          ...(bio !== undefined && { bio }),
        },
      },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/users]', err);
    return NextResponse.json(
      { error: 'Failed to upsert user' },
      { status: 500 }
    );
  }
}

// ─── PUT ────────────────────────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const uid = req.nextUrl.searchParams.get('uid');
    if (!uid) {
      return NextResponse.json({ error: 'Missing ?uid= query parameter' }, { status: 400 });
    }

    const body = await req.json();

    // Whitelist updatable fields; uid and role cannot be changed via PUT
    const allowedFields = ['name', 'email', 'department', 'organization', 'phone', 'bio', 'profileComplete'] as const;
    const update: Partial<Record<(typeof allowedFields)[number], unknown>> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        update[field] = body[field];
      }
    }

    const user = await User.findOneAndUpdate(
      { uid },
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error('[PUT /api/users]', err);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
