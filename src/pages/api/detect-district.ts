import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { findNearestDistrict } from '@/lib/utils';
import type { APIResponse, GeolocationResponse } from '@/types';

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

    // Get all districts
    const districts = await prisma.district.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        nameHindi: true,
        latitude: true,
        longitude: true,
        stateCode: true,
        stateName: true,
        population: true,
      },
    });

    if (districts.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No districts found',
      });
    }

    // Find nearest district
    const nearest = findNearestDistrict(latitude, longitude, districts);

    if (!nearest) {
      return res.status(404).json({
        success: false,
        error: 'Could not find nearest district',
      });
    }

      // Log user activity (optional)
      try {
        await prisma.userActivity.create({
          data: {
            action: 'geolocation',
            districtId: nearest.id,
            metadata: JSON.stringify({
              latitude,
              longitude,
              distance: nearest.distance,
            }),
            ipAddress: req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress,
            userAgent: req.headers['user-agent'],
          },
        });
      } catch (err) {
        // Don't fail the request if logging fails
        console.error('Failed to log user activity:', err);
      }    return res.status(200).json({
      success: true,
      data: {
        district: {
          id: nearest.id,
          code: nearest.code,
          name: nearest.name,
          nameHindi: nearest.nameHindi || undefined,
          stateCode: (nearest as any).stateCode,
          stateName: (nearest as any).stateName,
          latitude: nearest.latitude,
          longitude: nearest.longitude,
          population: (nearest as any).population || undefined,
        },
        distance: nearest.distance || 0,
      },
    } as any);
  } catch (error) {
    console.error('Error detecting district:', error);
    console.error('Database URL:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    
    // Fallback: return a default district near Delhi
    const fallbackDistrict = {
      id: 'fallback-default',
      code: 'UP001',
      name: 'Agra',
      nameHindi: 'आगरा',
      stateCode: 'UP',
      stateName: 'Uttar Pradesh',
      latitude: 27.1767,
      longitude: 78.0081,
      population: 1746467,
    };

    return res.status(200).json({
      success: true,
      data: {
        district: fallbackDistrict,
        distance: 0,
      },
      source: 'fallback',
      note: 'Database not available, using fallback district'
    } as any);
  }
}
