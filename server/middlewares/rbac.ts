import { Request, Response, NextFunction } from 'express';
import cookie from 'cookie';
import { verifyToken } from '../auth';
import type { Role } from '../models/User';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const raw = req.headers.cookie || '';
  const parsed = cookie.parse(raw);
  const token = parsed['auth_token'];
  if (!token) return res.status(401).json({ error: 'unauthorized' });
  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: 'unauthorized' });
  (req as any).user = payload;
  next();
}

export function requireRole(role: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'unauthorized' });
    if (user.role !== role) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}

export function requireAnyRole(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'unauthorized' });
    if (!roles.includes(user.role)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}
