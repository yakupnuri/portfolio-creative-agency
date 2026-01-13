import jwt from 'jsonwebtoken';
import type { Role } from './models/User';
import { ENV } from './env';

type JwtPayload = { uid: string; role: Role; email: string };

export function signToken(payload: JwtPayload): string {
  const secret = ENV.APP_SECRET || 'dev-secret';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const secret = ENV.APP_SECRET || 'dev-secret';
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}

export function cookieOptions() {
  const isProd = !!process.env.NODE_ENV && process.env.NODE_ENV !== 'development';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    domain: ENV.COOKIE_DOMAIN ? ENV.COOKIE_DOMAIN : (isProd ? '.abdulhamitgulen.com' : undefined),
    path: '/',
    maxAge: 7 * 24 * 3600
  } as any;
}
