/**
 * src/models/Logbook.ts
 *
 * Represents a single logbook entry created by a student during their internship.
 * Faculty can update the `status` and `reviewNote` fields during review.
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

export type ReviewStatus = 'Pending' | 'Approved' | 'Needs Changes';

export interface ILogbook {
  studentUid: string;      // MongoDB _id (string) of the student
  date: string;            // ISO date string, e.g. "2025-10-15"
  title: string;           // Activity title / short summary
  hours: number;           // Hours logged for this entry
  notes?: string;          // Detailed notes / learnings / blockers
  tags?: string[];         // Optional tags e.g. ["frontend", "api"]
  status: ReviewStatus;    // Set by faculty during logbook review
  reviewNote?: string;     // Faculty's feedback note to the student
  reviewedBy?: string;     // MongoDB _id (string) of the reviewing faculty member
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILogbookDocument extends ILogbook, Document {}

const LogbookSchema = new Schema<ILogbookDocument>(
  {
    studentUid: { type: String, required: true, index: true },
    date: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    hours: { type: Number, required: true, min: 0 },
    notes: { type: String, trim: true },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Needs Changes'] satisfies ReviewStatus[],
      default: 'Pending',
    },
    reviewNote: { type: String, trim: true },
    reviewedBy: { type: String },
  },
  {
    timestamps: true,
    collection: 'logbook_entries',
  }
);

// Compound index for fetching a student's entries sorted by date
LogbookSchema.index({ studentUid: 1, date: -1 });

const Logbook: Model<ILogbookDocument> =
  (mongoose.models.Logbook as Model<ILogbookDocument>) ||
  mongoose.model<ILogbookDocument>('Logbook', LogbookSchema);

export default Logbook;
