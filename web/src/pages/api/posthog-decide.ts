import { NextApiRequest, NextApiResponse } from 'next';

const POSTHOG_HOST = 'https://eu.i.posthog.com';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Only allow POST requests for decide endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const decideEndpoint = `${POSTHOG_HOST}/decide/`;
    
    // Prepare request body
    const bodyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    // Ensure API key is included
    if (!bodyData.api_key && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      bodyData.api_key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    }

    console.log('[PostHog Decide Proxy] Processing decide request', {
      hasDistinctId: !!bodyData.distinct_id,
      hasToken: !!bodyData.token,
    });

    // Forward request to PostHog
    const response = await fetch(decideEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': req.headers['user-agent'] || 'GiftSync-Analytics/1.0',
      },
      body: JSON.stringify(bodyData),
    });

    const responseData = await response.json();

    console.log('[PostHog Decide Proxy] Response received', {
      status: response.status,
      hasFeatureFlags: !!responseData.featureFlags,
      hasToolbarParams: !!responseData.toolbarParams,
    });

    return res.status(response.status).json(responseData);

  } catch (error) {
    console.error('[PostHog Decide Proxy] Error:', error);
    
    if (process.env.NODE_ENV === 'development') {
      return res.status(500).json({ 
        error: 'PostHog decide proxy failed',
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