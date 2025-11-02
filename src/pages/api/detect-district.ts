import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { calculateDistance } from '@/lib/utils';
import type { APIResponse, GeolocationResponse, DistrictData } from '@/types';

// Major cities as fallback districts
const fallbackDistricts: Array<{
  name: string;
  stateName: string;
  latitude: number;
  longitude: number;
}> = [
  { name: 'Mumbai', stateName: 'Maharashtra', latitude: 19.0760, longitude: 72.8777 },
  { name: 'Delhi', stateName: 'Delhi', latitude: 28.6139, longitude: 77.2090 },
  { name: 'Bengaluru', stateName: 'Karnataka', latitude: 12.9716, longitude: 77.5946 },
  { name: 'Hyderabad', stateName: 'Telangana', latitude: 17.3850, longitude: 78.4867 },
  { name: 'Chennai', stateName: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707 },
  { name: 'Kolkata', stateName: 'West Bengal', latitude: 22.5726, longitude: 88.3639 },
  { name: 'Pune', stateName: 'Maharashtra', latitude: 18.5204, longitude: 73.8567 },
  { name: 'Ahmedabad', stateName: 'Gujarat', latitude: 23.0225, longitude: 72.5714 },
];

function findNearestFallbackDistrict(
  userLat: number,
  userLng: number,
  fallbacks: typeof fallbackDistricts
) {
  let nearest = fallbacks[0];
  let minDistance = calculateDistance(userLat, userLng, nearest.latitude, nearest.longitude);

  for (const district of fallbacks) {
    const distance = calculateDistance(userLat, userLng, district.latitude, district.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = district;
    }
  }

  return { ...nearest, distance: minDistance };
}

async function getLocationName(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.city || data.locality || data.principalSubdivision || 'Unknown Location';
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
  }
  
  return `Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<GeolocationResponse>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { latitude, longitude } = req.body;

    // Validate coordinates
    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates',
      });
    }

    // Get all districts from database
    const allDistricts = await prisma.district.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        stateCode: true,
        stateName: true,
        latitude: true,
        longitude: true,
      },
    });

    if (allDistricts.length === 0) {
      return res.status(500).json({
        success: false,
        error: 'No districts found in database',
      });
    }

    // Find nearest district
    let nearestDistrict = allDistricts[0];
    let minDistance = calculateDistance(
      latitude,
      longitude,
      nearestDistrict.latitude,
      nearestDistrict.longitude
    );

    for (const district of allDistricts) {
      const distance = calculateDistance(
        latitude,
        longitude,
        district.latitude,
        district.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestDistrict = district;
      }
    }

    // Convert to DistrictData format
    const districtData: DistrictData = {
      id: nearestDistrict.id,
      code: nearestDistrict.code,
      name: nearestDistrict.name,
      stateCode: nearestDistrict.stateCode,
      stateName: nearestDistrict.stateName,
      latitude: nearestDistrict.latitude,
      longitude: nearestDistrict.longitude,
    };

    return res.status(200).json({
      success: true,
      data: {
        district: districtData,
        distance: minDistance,
      },
    });

  } catch (error) {
    console.error('Error in detect-district:', error);

    // Fallback to nearest major city if database query fails
    const { latitude, longitude } = req.body || {};
    
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      try {
        const nearest = findNearestFallbackDistrict(latitude, longitude, fallbackDistricts);
        const locationName = await getLocationName(latitude, longitude);

        // Create a fallback district data structure
        const fallbackDistrictData: DistrictData = {
          id: 'fallback',
          code: 'FALLBACK',
          name: nearest.name,
          stateCode: 'FB',
          stateName: nearest.stateName,
          latitude: nearest.latitude,
          longitude: nearest.longitude,
        };

        return res.status(200).json({
          success: true,
          data: {
            district: fallbackDistrictData,
            distance: nearest.distance,
          },
          source: 'fallback',
        });
      } catch (fallbackError) {
        console.error('Fallback location detection failed:', fallbackError);
      }
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to detect location',
    });
  }
}
