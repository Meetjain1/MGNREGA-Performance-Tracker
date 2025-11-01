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

    const whereClause = search && typeof search === 'string'
      ? {
          OR: [
            { name: { contains: search } },
            { nameHindi: { contains: search } },
            { code: { contains: search } },
          ],
        }
      : undefined;

    const districts = await prisma.district.findMany({
      where: whereClause as any,
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
      error: 'Failed to fetch districts',
    });
  }
}
