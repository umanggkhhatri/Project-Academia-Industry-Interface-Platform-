/**
 * src/lib/auth.ts
 *
 * JWT signing/verification helpers and HTTP-only cookie configuration.
 * Used by all /api/auth/* routes.
 *
 * Required env variable:
 *   JWT_SECRET=<strong random string>
 *   (generate with: openssl rand -base64 64)
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Please define JWT_SECRET in .env.local');
}

/** Name of the HTTP-only cookie that carries the session token. */
export const COOKIE_NAME = 'token';

/** 7-day expiry — adjust as needed. */
const EXPIRES_IN = '7d';
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 604800

/** Payload embedded inside the JWT. */
export interface JwtPayload {
  sub: string;          // MongoDB _id as string
  email: string;
  role: 'student' | 'faculty' | 'industry';
  name: string;
  iat?: number;
  exp?: number;
}

/**
 * Sign a new JWT token from the given payload.
 */
export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: EXPIRES_IN });
}

/**
 * Verify a JWT token and return the decoded payload.
 * Throws if invalid or expired.
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET as string) as JwtPayload;
}

/**
 * Serialise the JWT as a Set-Cookie header value.
 * HttpOnly + SameSite=Lax + Secure (in production) for security.
 */
export function buildSetCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === 'production';
  const parts = [
    `${COOKIE_NAME}=${token}`,
    `Path=/`,
    `Max-Age=${MAX_AGE_SECONDS}`,
    `HttpOnly`,
    `SameSite=Lax`,
  ];
  if (isProd) parts.push('Secure');
  return parts.join('; ');
}

/**
 * Serialise a cookie that immediately expires (used for logout).
 */
export function buildClearCookieHeader(): string {
  return [
    `${COOKIE_NAME}=`,
    `Path=/`,
    `Max-Age=0`,
    `HttpOnly`,
    `SameSite=Lax`,
  ].join('; ');
}
