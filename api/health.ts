import type { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  return res.status(200).json({
    status: 'ok',
    platform: 'NAWBAT Afghanistan Auction Marketplace',
    adminConfigured: Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH),
    jwtConfigured: Boolean(process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 32),
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    timestamp: new Date().toISOString(),
  });
}
