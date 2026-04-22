/**
 * src/app/api/internships/route.ts
 *
 * GET  /api/internships         — List internships (with optional filters)
 * POST /api/internships         — Create a new internship listing
 * PUT  /api/internships?id=...  — Update an existing listing
 * DELETE /api/internships?id=.. — Delete a listing
 *
 * Query params for GET:
 *   ?verified=true      Filter to verified only
 *   ?industry=IT        Filter by industry name
 *   ?mode=remote        Filter by mode
 *   ?search=react       Text search across title, company, industry
 *   ?status=Open        Filter by status
 *   ?limit=20           Number of results (default 50)
 *   ?skip=0             Pagination offset
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Internship from '@/models/Internship';

// ─── GET ────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = req.nextUrl;
    const verified = searchParams.get('verified');
    const industry = searchParams.get('industry');
    const mode = searchParams.get('mode');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const limit = Math.min(Number(searchParams.get('limit') ?? '50'), 200);
    const skip = Number(searchParams.get('skip') ?? '0');

    // Build query filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (verified === 'true') filter.verified = true;
    if (verified === 'false') filter.verified = false;
    if (industry) filter.industry = { $regex: industry, $options: 'i' };
    if (mode) filter.mode = mode;
    if (status) filter.status = status;

    // Full-text search (requires the text index defined on the model)
    if (search) {
      filter.$text = { $search: search };
    }

    const [internships, total] = await Promise.all([
      Internship.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Internship.countDocuments(filter),
    ]);

    return NextResponse.json({ internships, total, limit, skip }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/internships]', err);
    return NextResponse.json(
      { error: 'Failed to fetch internships' },
      { status: 500 }
    );
  }
}

// ─── POST ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      title,
      company,
      industry,
      skillsRequired,
      mode,
      durationWeeks,
      location,
      stipend,
      description,
      verified,
      postedBy,
      status,
    } = body;

    // Basic validation
    if (!title || !company || !industry || !mode || !durationWeeks || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: title, company, industry, mode, durationWeeks, location' },
        { status: 400 }
      );
    }

    const internship = await Internship.create({
      title,
      company,
      industry,
      skillsRequired: skillsRequired ?? [],
      mode,
      durationWeeks: Number(durationWeeks),
      location,
      stipend,
      description,
      verified: verified ?? false,
      postedBy,
      status: status ?? 'Open',
      applicants: 0,
    });

    return NextResponse.json({ internship }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/internships]', err);
    return NextResponse.json(
      { error: 'Failed to create internship' },
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
    const internship = await Internship.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
    }

    return NextResponse.json({ internship }, { status: 200 });
  } catch (err) {
    console.error('[PUT /api/internships]', err);
    return NextResponse.json(
      { error: 'Failed to update internship' },
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

    const internship = await Internship.findByIdAndDelete(id).lean();

    if (!internship) {
      return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Internship deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('[DELETE /api/internships]', err);
    return NextResponse.json(
      { error: 'Failed to delete internship' },
      { status: 500 }
    );
  }
}