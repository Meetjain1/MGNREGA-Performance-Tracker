import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import type { APIResponse, DistrictData } from '@/types';

// Fallback districts for when database isn't available
const FALLBACK_DISTRICTS = [
  { id: 'fb-1', code: 'UP001', name: 'Agra', nameHindi: 'आगरा', stateCode: 'UP', stateName: 'Uttar Pradesh', latitude: 27.1767, longitude: 78.0081, population: 1746467 },
  { id: 'fb-2', code: 'UP002', name: 'Aligarh', nameHindi: 'अलीगढ़', stateCode: 'UP', stateName: 'Uttar Pradesh', latitude: 27.8974, longitude: 78.0880, population: 3673849 },
  { id: 'fb-3', code: 'UP003', name: 'Allahabad', nameHindi: 'इलाहाबाद', stateCode: 'UP', stateName: 'Uttar Pradesh', latitude: 25.4358, longitude: 81.8463, population: 5954391 },
  { id: 'fb-4', code: 'UP004', name: 'Varanasi', nameHindi: 'वाराणसी', stateCode: 'UP', stateName: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739, population: 3676841 },
  { id: 'fb-5', code: 'UP005', name: 'Lucknow', nameHindi: 'लखनऊ', stateCode: 'UP', stateName: 'Uttar Pradesh', latitude: 26.8467, longitude: 80.9462, population: 4588455 },
  { id: 'fb-6', code: 'MH001', name: 'Mumbai', nameHindi: 'मुंबई', stateCode: 'MH', stateName: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, population: 12442373 },
  { id: 'fb-7', code: 'MH002', name: 'Pune', nameHindi: 'पुणे', stateCode: 'MH', stateName: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, population: 9429408 },
  { id: 'fb-8', code: 'BR001', name: 'Patna', nameHindi: 'पटना', stateCode: 'BR', stateName: 'Bihar', latitude: 25.5941, longitude: 85.1376, population: 5838465 },
  { id: 'fb-9', code: 'BR002', name: 'Gaya', nameHindi: 'गया', stateCode: 'BR', stateName: 'Bihar', latitude: 24.7955, longitude: 84.9994, population: 4391418 },
  { id: 'fb-10', code: 'WB001', name: 'Kolkata', nameHindi: 'कोलकाता', stateCode: 'WB', stateName: 'West Bengal', latitude: 22.5726, longitude: 88.3639, population: 14112536 },
];

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
      source: 'fallback'
    });
  }
}
