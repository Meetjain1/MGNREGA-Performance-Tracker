import type { NextApiRequest, NextApiResponse } from 'next';

// Fallback static data for when database isn't available
const FALLBACK_DISTRICTS = [
  {
    id: 'fallback-1',
    code: 'UP001',
    name: 'Agra',
    nameHindi: 'आगरा',
    stateCode: 'UP',
    stateName: 'Uttar Pradesh',
    latitude: 27.1767,
    longitude: 78.0081,
    population: 1746467
  },
  {
    id: 'fallback-2', 
    code: 'UP002',
    name: 'Aligarh',
    nameHindi: 'अलीगढ़',
    stateCode: 'UP',
    stateName: 'Uttar Pradesh',
    latitude: 27.8974,
    longitude: 78.0880,
    population: 3673849
  },
  {
    id: 'fallback-3',
    code: 'UP003', 
    name: 'Allahabad',
    nameHindi: 'इलाहाबाद',
    stateCode: 'UP',
    stateName: 'Uttar Pradesh',
    latitude: 25.4358,
    longitude: 81.8463,
    population: 5954391
  },
  {
    id: 'fallback-4',
    code: 'MH001',
    name: 'Mumbai',
    nameHindi: 'मुंबई', 
    stateCode: 'MH',
    stateName: 'Maharashtra',
    latitude: 19.0760,
    longitude: 72.8777,
    population: 12442373
  },
  {
    id: 'fallback-5',
    code: 'MH002',
    name: 'Pune',
    nameHindi: 'पुणे',
    stateCode: 'MH', 
    stateName: 'Maharashtra',
    latitude: 18.5204,
    longitude: 73.8567,
    population: 9429408
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Try to import and use Prisma
    const { prisma } = await import('@/lib/prisma');
    
    const { search } = req.query;
    console.log('Districts API called, DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 30) + '...');

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

    console.log(`Found ${districts.length} districts from database`);

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
    console.error('Database error, using fallback data:', error);
    
    // Use fallback data if database fails
    const { search } = req.query;
    let filteredDistricts = FALLBACK_DISTRICTS;
    
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      filteredDistricts = FALLBACK_DISTRICTS.filter(d => 
        d.name.toLowerCase().includes(searchLower) ||
        d.nameHindi?.includes(search) ||
        d.code.toLowerCase().includes(searchLower)
      );
    }

    console.log(`Using ${filteredDistricts.length} fallback districts`);

    return res.status(200).json({
      success: true,
      data: filteredDistricts,
      source: 'fallback',
      note: 'Using static data - database not available'
    });
  }
}