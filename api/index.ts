import type { Request, Response } from 'express';
import { createApp } from '../server';

const appPromise = createApp(false);

function normalizeForwardedPath(req: Request) {
  const raw = req.query?.path;
  const forwarded = Array.isArray(raw) ? raw.join('/') : typeof raw === 'string' ? raw : '';
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(req.query || {})) {
    if (key === 'path') continue;
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, String(item));
    } else if (value !== undefined) {
      params.set(key, String(value));
    }
  }

  const suffix = params.toString();
  return `/api/${forwarded}${suffix ? `?${suffix}` : ''}`;
}

export default async function handler(req: Request, res: Response) {
  const app = await appPromise;

  // Vercel rewrites /api/* to this single serverless function.
  // Restore the original API path so Express route matching stays authoritative.
  req.url = normalizeForwardedPath(req);

  return app(req, res);
}
