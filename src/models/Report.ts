/**
 * src/models/Report.ts
 *
 * Represents a saved internship progress report generated from logbook entries.
 * Students generate their own reports; faculty can generate consolidated ones.
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IReport {
  studentUid: string;                    // MongoDB _id (string) of the student the report is about
  generatedBy: string;                   // MongoDB _id (string) of whoever triggered generation
  generatorRole: 'student' | 'faculty'; // Who generated the report
  fromDate: string;                      // ISO date string (range start)
  toDate: string;                        // ISO date string (range end)
  totalEntries: number;
  totalHours: number;
  byTag: Record<string, number>;         // tag -> count map
  highlights: string[];                  // Top entry summaries
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReportDocument extends IReport, Document {}

const ReportSchema = new Schema<IReportDocument>(
  {
    studentUid: { type: String, required: true, index: true },
    generatedBy: { type: String, required: true },
    generatorRole: {
      type: String,
      required: true,
      enum: ['student', 'faculty'],
    },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    totalEntries: { type: Number, required: true, min: 0 },
    totalHours: { type: Number, required: true, min: 0 },
    byTag: { type: Map, of: Number, default: {} },
    highlights: { type: [String], default: [] },
  },
  {
    timestamps: true,
    collection: 'reports',
  }
);

// Index for fetching a student's reports newest-first
ReportSchema.index({ studentUid: 1, createdAt: -1 });

const Report: Model<IReportDocument> =
  (mongoose.models.Report as Model<IReportDocument>) ||
  mongoose.model<IReportDocument>('Report', ReportSchema);

export default Report;
