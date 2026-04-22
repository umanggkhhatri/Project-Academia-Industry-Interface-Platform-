/**
 * src/models/Internship.ts
 *
 * Represents an internship/job listing posted by an industry partner
 * or pre-seeded from the existing internships.json dataset.
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

export type InternshipMode = 'remote' | 'on-site' | 'hybrid';

export interface IInternship {
  title: string;
  company: string;
  industry: string;
  skillsRequired: string[];
  mode: InternshipMode;
  durationWeeks: number;
  location: string;
  stipend?: string;
  description?: string;
  verified: boolean;
  postedBy?: string;     // Firebase UID of the industry user who posted it (optional for seeded data)
  applicants?: number;   // cached count of applicants
  status?: 'Open' | 'Closed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInternshipDocument extends IInternship, Document {}

const InternshipSchema = new Schema<IInternshipDocument>(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    skillsRequired: { type: [String], default: [] },
    mode: {
      type: String,
      required: true,
      enum: ['remote', 'on-site', 'hybrid'] satisfies InternshipMode[],
    },
    durationWeeks: { type: Number, required: true, min: 1 },
    location: { type: String, required: true, trim: true },
    stipend: { type: String, trim: true },
    description: { type: String, trim: true },
    verified: { type: Boolean, default: false },
    postedBy: { type: String }, // Firebase UID — no foreign key constraint needed
    applicants: { type: Number, default: 0 },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  },
  {
    timestamps: true,
    collection: 'internships',
  }
);

// Text index for full-text search on title, company, and industry
InternshipSchema.index({ title: 'text', company: 'text', industry: 'text' });

// Standard indexes for frequent filter queries
InternshipSchema.index({ verified: 1 });
InternshipSchema.index({ industry: 1 });
InternshipSchema.index({ mode: 1 });

const Internship: Model<IInternshipDocument> =
  (mongoose.models.Internship as Model<IInternshipDocument>) ||
  mongoose.model<IInternshipDocument>('Internship', InternshipSchema);

export default Internship;
