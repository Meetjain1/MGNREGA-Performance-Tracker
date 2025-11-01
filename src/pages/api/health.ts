import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test database connection
    const districtCount = await prisma.district.count();
    const cachedDataCount = await prisma.cachedMGNREGAData.count();
    
    return res.status(200).json({
      status: 'healthy',
      database: 'connected',
      districts: districtCount,
      cachedRecords: cachedDataCount,
      environment: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL?.substring(0, 20) + '...',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      status: 'unhealthy',
      database: 'failed',
      error: (error as Error).message,
      environment: process.env.NODE_ENV,
    });
  }
}