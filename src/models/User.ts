/**
 * src/models/User.ts
 *
 * Represents a platform user (student, faculty, or industry partner).
 * The `uid` field stores the Firebase Auth UID so that we can link
 * Firebase authentication with MongoDB profile data.
 */

import mongoose, { Document, Model, Schema } from 'mongoose';

export type UserRole = 'student' | 'faculty' | 'industry';

export interface IUser {
  uid: string;           // Firebase Auth UID — primary lookup key
  name: string;
  email: string;
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
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
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
