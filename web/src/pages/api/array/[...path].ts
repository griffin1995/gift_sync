import { NextApiRequest, NextApiResponse } from 'next';

const POSTHOG_HOST = 'https://eu.i.posthog.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    const { path } = req.query;
    const pathArray = Array.isArray(path) ? path : [path];
    const fullPath = pathArray.join('/');
    
    // Construct PostHog array endpoint URL
    const posthogUrl = `${POSTHOG_HOST}/array/${fullPath}`;
    
    // Add query parameters
    const url = new URL(posthogUrl);
    Object.entries(req.query).forEach(([key, value]) => {
      if (key !== 'path' && value) {
        url.searchParams.set(key, Array.isArray(value) ? value[0] : value);
      }
    });

    console.log('[PostHog Array Proxy]', req.method, url.toString());

    // Forward request to PostHog
    const response = await fetch(url.toString(), {
      method: req.method || 'GET',
      headers: {
        'User-Agent': req.headers['user-agent'] || 'GiftSync-Analytics/1.0',
        ...(req.method === 'POST' && { 'Content-Type': 'application/json' }),
      },
      ...(req.method === 'POST' && { body: JSON.stringify(req.body) }),
    });

    // Forward response
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/javascript') || contentType?.includes('text/javascript')) {
      const text = await response.text();
      res.setHeader('Content-Type', 'application/javascript');
      return res.status(response.status).send(text);
    } else if (contentType?.includes('application/json')) {
      const data = await response.json();
      return res.status(response.status).json(data);
    } else {
      const text = await response.text();
      res.setHeader('Content-Type', contentType || 'text/plain');
      return res.status(response.status).send(text);
    }

  } catch (error) {
    console.error('[PostHog Array Proxy] Error:', error);
    
    if (process.env.NODE_ENV === 'development') {
      return res.status(500).json({ 
        error: 'PostHog array proxy failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        path: req.query.path,
      });
    }
    
    return res.status(500).json({ error: 'Analytics configuration unavailable' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};