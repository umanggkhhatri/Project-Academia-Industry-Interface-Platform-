/**
 * src/app/api/users/route.ts
 *
 * GET  /api/users?id=<_id>      — Fetch a single user by MongoDB _id
 * GET  /api/users?role=student   — Fetch all users with a given role
 * PUT  /api/users?id=<_id>      — Update profile fields (name, bio, etc.)
 *
 * Note: User creation is handled exclusively by /api/auth/register.
 *       This route is for profile reads and updates only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

// ─── GET ────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id');
    const role = searchParams.get('role');

    if (id) {
      const user = await User.findById(id).lean();
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json({ user }, { status: 200 });
    }

    if (role) {
      const users = await User.find({ role }).sort({ name: 1 }).lean();
      return NextResponse.json({ users }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Provide ?id= or ?role= query parameter' },
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

// ─── PUT ────────────────────────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing ?id= query parameter' }, { status: 400 });
    }

    const body = await req.json();

    // Whitelist updatable fields — email, role, and password cannot be changed here
    const allowedFields = ['name', 'department', 'organization', 'phone', 'bio', 'profileComplete'] as const;
    const update: Partial<Record<(typeof allowedFields)[number], unknown>> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        update[field] = body[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
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
