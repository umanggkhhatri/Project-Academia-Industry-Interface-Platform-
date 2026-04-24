/**
 * src/app/api/reports/route.ts
 *
 * GET  /api/reports?uid=<studentUid>   — Fetch saved reports for a student
 * POST /api/reports                    — Persist a newly generated report
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Report from '@/models/Report';

// ─── GET ────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const uid = req.nextUrl.searchParams.get('uid');
    if (!uid) {
      return NextResponse.json(
        { error: 'Missing ?uid= query parameter' },
        { status: 400 }
      );
    }

    const reports = await Report.find({ studentUid: uid })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ reports }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/reports]', err);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
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
      studentUid,
      generatedBy,
      generatorRole,
      fromDate,
      toDate,
      totalEntries,
      totalHours,
      byTag,
      highlights,
    } = body;

    if (!studentUid || !generatedBy || !fromDate || !toDate) {
      return NextResponse.json(
        { error: 'Missing required fields: studentUid, generatedBy, fromDate, toDate' },
        { status: 400 }
      );
    }

    const report = await Report.create({
      studentUid,
      generatedBy,
      generatorRole: generatorRole ?? 'student',
      fromDate,
      toDate,
      totalEntries: Number(totalEntries) || 0,
      totalHours: Number(totalHours) || 0,
      byTag: byTag ?? {},
      highlights: highlights ?? [],
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/reports]', err);
    return NextResponse.json(
      { error: 'Failed to save report' },
      { status: 500 }
    );
  }
}
