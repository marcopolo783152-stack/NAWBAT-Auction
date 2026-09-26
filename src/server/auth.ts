import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export interface SessionClaims extends JwtPayload {
  sub: string;
  email: string;
  role: string;
  userType: string;
  permissions?: string[];
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
  return issueSessionToken({
    sub: 'usr-admin-1',
    email,
    role: 'superadmin',
    userType: 'staff',
    permissions: ['*'],
  });
}

export function issueSessionToken(input: {
  sub: string;
  email: string;
  role: string;
  userType: string;
  permissions?: string[];
}): string {
  return jwt.sign(
    {
      email: input.email,
      role: input.role,
      userType: input.userType,
      permissions: input.permissions || [],
    },
    jwtSecret(),
    {
      subject: input.sub,
      expiresIn: '8h',
      issuer: 'nawbat.af',
      audience: 'nawbat-session',
    },
  );
}

export function verifySessionToken(token: string): SessionClaims {
  return jwt.verify(token, jwtSecret(), {
    issuer: 'nawbat.af',
    audience: 'nawbat-session',
  }) as SessionClaims;
}

function bearer(req: Request) {
  const header = req.headers.authorization;
  return header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;
}

export function requireSession(req: Request, res: Response, next: NextFunction) {
  const token = bearer(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  try {
    const claims = verifySessionToken(token);
    (req as Request & { session?: SessionClaims }).session = claims;
    return next();
  } catch {
    return res.status(401).json({ error: 'Session expired or invalid.' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = bearer(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  try {
    const claims = verifySessionToken(token);
    const allowedRoles = new Set([
      'superadmin',
      'admin',
      'auction_manager',
      'auctioneer',
      'cataloger',
      'finance',
      'kyc',
      'support',
      'logistics',
      'moderator',
    ]);

    if (claims.userType !== 'staff' && !allowedRoles.has(claims.role)) {
      return res.status(403).json({ error: 'Staff access required.' });
    }
    if (!allowedRoles.has(claims.role)) {
      return res.status(403).json({ error: 'This staff role does not have admin-console access.' });
    }

    (req as Request & { admin?: SessionClaims }).admin = claims;
    return next();
  } catch {
    return res.status(401).json({ error: 'Session expired or invalid.' });
  }
}


export function requireRoles(...roles: string[]) {
  const allowed = new Set(roles);
  return (req: Request, res: Response, next: NextFunction) => {
    const claims = (req as Request & { admin?: SessionClaims }).admin;
    if (!claims) return res.status(401).json({ error: 'Authentication required.' });
    if (claims.role === 'superadmin' || claims.role === 'admin') return next();
    if (!allowed.has(claims.role)) {
      return res.status(403).json({ error: 'Your staff role does not permit this action.' });
    }
    return next();
  };
}
