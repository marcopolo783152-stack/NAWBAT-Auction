import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export interface AdminClaims extends JwtPayload {
  sub: string;
  email: string;
  role: string;
}

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be configured and at least 32 characters long.');
  }
  return secret;
}

export async function verifyAdminCredentials(email: string, password: string) {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();

  if (!configuredEmail || !passwordHash) {
    return { ok: false as const, reason: 'ADMIN_NOT_CONFIGURED' };
  }

  if (email.trim().toLowerCase() !== configuredEmail) {
    return { ok: false as const, reason: 'INVALID_CREDENTIALS' };
  }

  const passwordMatches = await bcrypt.compare(password, passwordHash);
  return passwordMatches
    ? { ok: true as const, email: configuredEmail }
    : { ok: false as const, reason: 'INVALID_CREDENTIALS' };
}

export function issueAdminToken(email: string): string {
  return jwt.sign(
    { email, role: 'SuperAdmin' },
    jwtSecret(),
    { subject: 'usr-admin-1', expiresIn: '8h', issuer: 'nawbat.af', audience: 'nawbat-admin' },
  );
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const token = header.slice('Bearer '.length);
    const claims = jwt.verify(token, jwtSecret(), {
      issuer: 'nawbat.af',
      audience: 'nawbat-admin',
    }) as AdminClaims;
    (req as Request & { admin?: AdminClaims }).admin = claims;
    return next();
  } catch {
    return res.status(401).json({ error: 'Session expired or invalid.' });
  }
}
