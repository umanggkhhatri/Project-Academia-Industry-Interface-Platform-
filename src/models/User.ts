/**
 * src/models/User.ts
 *
 * Represents a platform user (student, faculty, or industry partner).
 * Email is the unique primary identifier. Passwords are stored as
 * bcrypt hashes (never in plaintext). The `password` field is excluded
 * from all queries by default (select: false) — you must opt-in with
 * `.select('+password')` when you need it (login route only).
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

export type UserRole = 'student' | 'faculty' | 'industry';

export interface IUser {
  name: string;
  email: string;
  password: string;      // bcrypt hash — never returned to clients
  role: UserRole;
  department?: string;   // student / faculty only
  organization?: string; // industry partner only
  phone?: string;
  bio?: string;
  profileComplete: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // never included in query results unless explicitly requested
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'faculty', 'industry'] satisfies UserRole[],
    },
    department: { type: String, trim: true },
    organization: { type: String, trim: true },
    phone: { type: String, trim: true },
    bio: { type: String, trim: true },
    profileComplete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Prevent model re-compilation during Next.js hot-reload
const User: Model<IUserDocument> =
  (mongoose.models.User as Model<IUserDocument>) ||
  mongoose.model<IUserDocument>('User', UserSchema);

export default User;
