import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

function issueToken(email: string, secret: string) {
  return jwt.sign(
    {
      email,
      role: 'superadmin',
      userType: 'staff',
      permissions: ['*'],
    },
    secret,
    {
      subject: 'usr-admin-1',
      expiresIn: '8h',
      issuer: 'nawbat.af',
      audience: 'nawbat-session',
    },
  );
}

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const jwtSecret = process.env.JWT_SECRET;

  if (!configuredEmail || !passwordHash) {
    return res.status(503).json({
      error: 'Admin access is not configured on the server.',
      code: 'ADMIN_NOT_CONFIGURED',
    });
  }

  if (!jwtSecret || jwtSecret.length < 32) {
    return res.status(503).json({
      error: 'JWT_SECRET is missing or too short.',
      code: 'JWT_NOT_CONFIGURED',
    });
  }

  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (email.trim().toLowerCase() !== configuredEmail) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const matches = await bcrypt.compare(password, passwordHash);
  if (!matches) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  return res.status(200).json({
    success: true,
    token: issueToken(configuredEmail, jwtSecret),
    user: {
      id: 'usr-admin-1',
      email: configuredEmail,
      fullName: 'NAWBAT Administrator',
      userType: 'staff',
      role: 'superadmin',
      roleName: 'Super Admin',
      permissions: ['*'],
      status: 'active',
      kycStatus: 'verified',
      preferredLanguage: 'fa',
    },
  });
}
