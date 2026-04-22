/**
 * scripts/seed-resources.ts
 *
 * One-time script to populate the MongoDB `study_resources` collection from
 * public/study-resources.json.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json scripts/seed-resources.ts
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

const StudyResourceSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    type: { type: String, enum: ['PDF', 'video', 'article'] },
    link: String,
    category: { type: String, enum: ['Pre-Internship', 'Soft Skills', 'Domain Basics'] },
  },
  { collection: 'study_resources' }
);

async function seed() {
  const jsonPath = path.resolve(process.cwd(), 'public', 'study-resources.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌  public/study-resources.json not found.');
    process.exit(1);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`📄  Loaded ${data.length} records from study-resources.json`);

  await mongoose.connect(MONGODB_URI!);
  console.log('✅  Connected to MongoDB');

  const StudyResource = mongoose.models.StudyResource || mongoose.model('StudyResource', StudyResourceSchema);

  const existing = await StudyResource.countDocuments();
  if (existing > 0) {
    console.log(`⚠️   Collection already has ${existing} documents. Skipping.`);
    await mongoose.disconnect();
    return;
  }

  await StudyResource.insertMany(data, { ordered: false });
  console.log(`✅  Seeded ${data.length} study resources into MongoDB.`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
