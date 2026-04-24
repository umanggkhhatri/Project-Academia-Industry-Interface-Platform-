/**
 * src/app/api/logbook/route.ts
 *
 * GET    /api/logbook?uid=<studentUid>          — Fetch a student's logbook entries
 * GET    /api/logbook?all=true                  — Fetch ALL students' entries (faculty)
 * POST   /api/logbook                           — Create a new entry
 * PUT    /api/logbook?id=<entryId>              — Update an entry (student edit or faculty review)
 * DELETE /api/logbook?id=<entryId>              — Delete an entry
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { FilterQuery } from 'mongoose';
import Logbook, { ILogbookDocument } from '@/models/Logbook';

// ─── GET ────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = req.nextUrl;
    const uid = searchParams.get('uid');
    const all = searchParams.get('all');
    const status = searchParams.get('status'); // optional filter for faculty

    const filter: FilterQuery<ILogbookDocument> = {};

    if (all !== 'true') {
      // Student mode — require uid
      if (!uid) {
        return NextResponse.json(
          { error: 'Missing ?uid= query parameter' },
          { status: 400 }
        );
      }
      filter.studentUid = uid;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    const entries = await Logbook.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ entries }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/logbook]', err);
    return NextResponse.json(
      { error: 'Failed to fetch logbook entries' },
      { status: 500 }
    );
  }
}

// ─── POST ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { studentUid, date, title, hours, notes, tags } = body;

    if (!studentUid || !date || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: studentUid, date, title' },
        { status: 400 }
      );
    }

    const entry = await Logbook.create({
      studentUid,
      date,
      title,
      hours: Number(hours) || 0,
      notes: notes ?? '',
      tags: tags ?? [],
      status: 'Pending',
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/logbook]', err);
    return NextResponse.json(
      { error: 'Failed to create logbook entry' },
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

    const allowedUpdates = [
      'date', 'title', 'hours', 'notes', 'tags', // student edits
      'status', 'reviewNote', 'reviewedBy',        // faculty review
    ] as const;

    const update: Record<string, unknown> = {};
    for (const key of allowedUpdates) {
      if ((body as Record<string, unknown>)[key] !== undefined) {
        update[key] = (body as Record<string, unknown>)[key];
      }
    }

    const entry = await Logbook.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!entry) {
      return NextResponse.json({ error: 'Logbook entry not found' }, { status: 404 });
    }

    return NextResponse.json({ entry }, { status: 200 });
  } catch (err) {
    console.error('[PUT /api/logbook]', err);
    return NextResponse.json(
      { error: 'Failed to update logbook entry' },
      { status: 500 }
    );
  }
}

// ─── DELETE ─────────────────────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing ?id= query parameter' }, { status: 400 });
    }

    const entry = await Logbook.findByIdAndDelete(id).lean();

    if (!entry) {
      return NextResponse.json({ error: 'Logbook entry not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Entry deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('[DELETE /api/logbook]', err);
    return NextResponse.json(
      { error: 'Failed to delete logbook entry' },
      { status: 500 }
    );
  }
}
