import { NextApiRequest, NextApiResponse } from 'next';

const POSTHOG_HOST = 'https://eu.i.posthog.com';
const ALLOWED_ORIGINS = ['http://localhost:3000', 'http://localhost:3001'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  try {
    // Determine the PostHog endpoint based on the request
    let posthogEndpoint: string;
    let method = req.method || 'POST';

    // Handle different PostHog endpoints
    if (req.url?.includes('decide')) {
      posthogEndpoint = `${POSTHOG_HOST}/decide/`;
      method = 'POST';
    } else if (req.url?.includes('engage')) {
      posthogEndpoint = `${POSTHOG_HOST}/engage/`;
      method = 'POST';
    } else if (req.url?.includes('capture')) {
      posthogEndpoint = `${POSTHOG_HOST}/capture/`;
      method = 'POST';
    } else if (req.url?.includes('batch')) {
      posthogEndpoint = `${POSTHOG_HOST}/batch/`;
      method = 'POST';
    } else {
      // Default to batch endpoint for event capture
      posthogEndpoint = `${POSTHOG_HOST}/batch/`;
      method = 'POST';
    }

    // Prepare headers for PostHog request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': req.headers['user-agent'] || 'GiftSync-Analytics/1.0',
    };

    // Forward authorization header if present
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }

    // Prepare request body
    let body: string | undefined;
    if (method === 'POST' && req.body) {
      // Ensure the body includes the correct API key
      const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      // Add API key if not present
      if (!bodyData.api_key && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        bodyData.api_key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      }

      body = JSON.stringify(bodyData);
    }

    console.log(`[PostHog Proxy] ${method} ${posthogEndpoint}`, {
      hasBody: !!body,
      bodySize: body?.length || 0,
      hasPageview: body?.includes('$pageview') || false,
    });

    // Make request to PostHog
    const response = await fetch(posthogEndpoint, {
      method,
      headers,
      body,
    });

    // Get response data
    const contentType = response.headers.get('content-type');
    let responseData: string | object;

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Log response for debugging
    console.log(`[PostHog Proxy] Response ${response.status}`, {
      status: response.status,
      contentType,
      dataSize: typeof responseData === 'string' ? responseData.length : JSON.stringify(responseData).length,
    });

    // Forward the response
    if (typeof responseData === 'string') {
      return res.status(response.status).send(responseData);
    } else {
      return res.status(response.status).json(responseData);
    }

  } catch (error) {
    console.error('[PostHog Proxy] Error:', error);
    
    // Return detailed error in development
    if (process.env.NODE_ENV === 'development') {
      return res.status(500).json({ 
        error: 'PostHog proxy request failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        endpoint: req.url,
        method: req.method,
      });
    }
    
    return res.status(500).json({ error: 'Analytics service temporarily unavailable' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb', // Increased for larger event batches
    },
  },
};