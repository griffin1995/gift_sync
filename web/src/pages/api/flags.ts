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
    // Construct PostHog flags endpoint URL
    const url = new URL(`${POSTHOG_HOST}/flags/`);
    
    // Add query parameters
    Object.entries(req.query).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, Array.isArray(value) ? value[0] : value);
      }
    });

    console.log('[PostHog Flags Proxy]', req.method, url.toString());

    // Prepare request body for POST requests
    let body: string | undefined;
    if (req.method === 'POST' && req.body) {
      const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      // Ensure API key is included
      if (!bodyData.api_key && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        bodyData.api_key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      }

      body = JSON.stringify(bodyData);
    }

    // Forward request to PostHog
    const response = await fetch(url.toString(), {
      method: req.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': req.headers['user-agent'] || 'GiftSync-Analytics/1.0',
      },
      ...(body && { body }),
    });

    // Handle response based on content type
    const contentType = response.headers.get('content-type');
    let responseData: any;

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      // Try to parse as JSON, fallback to text
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { status: 'error', message: text };
      }
    }

    console.log('[PostHog Flags Proxy] Response', {
      status: response.status,
      contentType,
      hasFeatureFlags: !!responseData?.featureFlags,
      flagCount: responseData?.featureFlags ? Object.keys(responseData.featureFlags).length : 0,
    });

    return res.status(response.status).json(responseData);

  } catch (error) {
    console.error('[PostHog Flags Proxy] Error:', error);
    
    if (process.env.NODE_ENV === 'development') {
      return res.status(500).json({ 
        error: 'PostHog flags proxy failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
    
    return res.status(500).json({ error: 'Feature flags service temporarily unavailable' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};