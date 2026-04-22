/**
 * scripts/seed-internships.ts
 *
 * One-time script to populate the MongoDB `internships` collection from
 * the existing public/internships.json file.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json scripts/seed-internships.ts
 *
 * Prerequisites:
 *   1. Set MONGODB_URI in your .env.local (or export it as an env variable)
 *   2. npm install dotenv (or use: MONGODB_URI=... npx ts-node ...)
 */

import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';

// Load .env.local
const dotenvPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(dotenvPath)) {
  const lines = fs.readFileSync(dotenvPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set. Add it to .env.local or export it as an environment variable.');
  process.exit(1);
}

// Inline schema (avoids TS path alias resolution complexity in scripts)
const InternshipSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    industry: String,
    skillsRequired: [String],
    mode: { type: String, enum: ['remote', 'on-site', 'hybrid'], default: 'on-site' },
    durationWeeks: Number,
    location: String,
    stipend: String,
    description: String,
    verified: { type: Boolean, default: false },
    postedBy: String,
    applicants: { type: Number, default: 0 },
    status: { type: String, default: 'Open' },
  },
  { timestamps: true, collection: 'internships' }
);

async function seed() {
  const jsonPath = path.resolve(process.cwd(), 'public', 'internships.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌  public/internships.json not found.');
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, 'utf8');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = JSON.parse(raw);
  console.log(`📄  Loaded ${data.length} records from internships.json`);

  await mongoose.connect(MONGODB_URI!);
  console.log('✅  Connected to MongoDB');

  const Internship = mongoose.models.Internship || mongoose.model('Internship', InternshipSchema);

  const existing = await Internship.countDocuments();
  if (existing > 0) {
    console.log(`⚠️   Collection already has ${existing} documents. Skipping seed to avoid duplicates.`);
    console.log('    Delete the collection manually and re-run if you want to re-seed.');
    await mongoose.disconnect();
    return;
  }

  // Map JSON fields to schema fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docs = data.map((item: any) => ({
    title: item.title ?? item.job_title ?? 'Untitled',
    company: item.company ?? item.company_name ?? 'Unknown',
    industry: item.industry ?? item.category ?? 'General',
    skillsRequired: item.required_skills ?? item.skills ?? [],
    mode: normalizeMode(item.mode ?? item.work_type ?? ''),
    durationWeeks: Number(item.duration_weeks ?? item.durationWeeks ?? 12),
    location: item.location ?? 'Remote',
    stipend: item.stipend ?? item.salary ?? undefined,
    description: item.description ?? undefined,
    verified: true, // assume pre-vetted data is verified
    status: 'Open',
  }));

  const BATCH = 500;
  let inserted = 0;
  for (let i = 0; i < docs.length; i += BATCH) {
    await Internship.insertMany(docs.slice(i, i + BATCH), { ordered: false });
    inserted += Math.min(BATCH, docs.length - i);
    process.stdout.write(`\r   Inserted ${inserted}/${docs.length}…`);
  }

  console.log(`\n✅  Seeded ${inserted} internships into MongoDB.`);
  await mongoose.disconnect();
}

function normalizeMode(raw: string): 'remote' | 'on-site' | 'hybrid' {
  const lower = raw.toLowerCase();
  if (lower.includes('remote')) return 'remote';
  if (lower.includes('hybrid')) return 'hybrid';
  return 'on-site';
}

seed().catch(err => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
