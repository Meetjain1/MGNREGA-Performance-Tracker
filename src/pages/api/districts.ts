import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import type { APIResponse, DistrictData } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<DistrictData[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { search } = req.query;

    console.log('Districts API called, DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 20) + '...');

    let whereClause: any = {};
    
    if (search && typeof search === 'string') {
      whereClause = {
        OR: [
          { name: { contains: search } },
          { nameHindi: { contains: search } },
          { code: { contains: search } },
        ],
      };
    }

    const districts = await prisma.district.findMany({
      where: whereClause,
      select: {
        id: true,
        code: true,
        name: true,
        nameHindi: true,
        stateCode: true,
        stateName: true,
        latitude: true,
        longitude: true,
        population: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log(`Found ${districts.length} districts`); // Debug log

    const formattedDistricts = districts.map((d: any) => ({
      ...d,
      nameHindi: d.nameHindi || undefined,
      population: d.population || undefined,
    }));

    return res.status(200).json({
      success: true,
      data: formattedDistricts,
    });
  } catch (error) {
    console.error('Error fetching districts:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch districts: ' + (error as Error).message,
    });
  }
}
