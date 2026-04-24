/**
 * src/lib/mongodb.ts
 *
 * Reusable Mongoose connection with caching for Next.js serverless environments.
 * Next.js hot-reload creates new module instances, so we persist the connection
 * on the global object to avoid creating multiple connections during development.
 *
 * Required env variable:
 *   MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority
 */

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

/** Cached connection stored on the global object (survives hot-reload). */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend NodeJS global with our cache key
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

/**
 * Returns a cached Mongoose connection (or creates one on first call).
 * Suitable for both serverless (Vercel, AWS Lambda) and traditional Node servers.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable in .env.local\n' +
      'Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority'
    );
  }

  // Return the existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Reuse the in-flight promise if a connection is already being established
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset so the next call retries
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
