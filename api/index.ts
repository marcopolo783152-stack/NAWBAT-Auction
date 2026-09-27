import type { Request, Response } from 'express';
import { createApp } from '../server';

let appPromise: ReturnType<typeof createApp> | null = null;

function getApp() {
  if (!appPromise) appPromise = createApp(false);
  return appPromise;
}

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
  try {
    const app = await getApp();

    // Vercel rewrites /api/* to this single serverless function.
    // Restore the original API path so Express route matching stays authoritative.
    req.url = normalizeForwardedPath(req);

    return app(req, res);
  } catch (error: any) {
    console.error('NAWBAT API initialization failed', error);
    return res.status(500).json({
      error: 'NAWBAT API initialization failed.',
      code: 'API_INITIALIZATION_FAILED',
      requestId: req.headers['x-vercel-id'] || null,
    });
  }
}
