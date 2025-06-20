import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    webUrl: process.env.NEXT_PUBLIC_WEB_URL,
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}