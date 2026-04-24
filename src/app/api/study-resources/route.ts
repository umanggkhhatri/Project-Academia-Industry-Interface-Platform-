/**
 * src/app/api/study-resources/route.ts
 *
 * GET /api/study-resources  — Returns study resources from MongoDB.
 *                             Falls back to the static JSON if DB is empty.
 *
 * This route is used by the Student Dashboard's "Study Resources" tab
 * instead of fetching /study-resources.json directly from the browser.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose, { Document, Model, Schema } from 'mongoose';

// ── Inline model (lightweight — no separate file needed) ─────────────────────

interface IStudyResource {
  title: string;
  description: string;
  type: 'PDF' | 'video' | 'article';
  link: string;
  category: 'Pre-Internship' | 'Soft Skills' | 'Domain Basics';
}

interface IStudyResourceDocument extends IStudyResource, Document {}

const StudyResourceSchema = new Schema<IStudyResourceDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['PDF', 'video', 'article'], required: true },
    link: { type: String, required: true },
    category: {
      type: String,
      enum: ['Pre-Internship', 'Soft Skills', 'Domain Basics'],
      required: true,
    },
  },
  { collection: 'study_resources' }
);

const StudyResource: Model<IStudyResourceDocument> =
  (mongoose.models.StudyResource as Model<IStudyResourceDocument>) ||
  mongoose.model<IStudyResourceDocument>('StudyResource', StudyResourceSchema);

// ─── GET ────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    let resources = await StudyResource.find({}).sort({ category: 1, title: 1 }).lean();

    // Fallback: if the collection is empty, return the static JSON so the UI
    // still works before seeding is done.
    if (resources.length === 0) {
      const { searchParams } = req.nextUrl;
      const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
      const staticUrl = `${baseUrl}/study-resources.json`;

      try {
        const res = await fetch(staticUrl, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          resources = Array.isArray(json) ? json : [];
        }
      } catch {
        // If the static file is also gone, return an empty array gracefully
        resources = [];
      }
    }

    return NextResponse.json({ resources }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/study-resources]', err);
    return NextResponse.json(
      { error: 'Failed to fetch study resources' },
      { status: 500 }
    );
  }
}
