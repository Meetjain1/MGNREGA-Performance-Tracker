import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getFinancialYear } from '@/lib/utils';
import type { APIResponse, CachedData } from '@/types';

// Rate limiting storage (in-memory for simplicity, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = parseInt(process.env.RATE_LIMIT_REQUESTS || '100', 10);
  const window = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);

  const current = rateLimitMap.get(ip);

  if (!current || now > current.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + window });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count++;
  return true;
}

async function fetchFromDataGovAPI(
  districtCode: string,
  financialYear: string,
  month: number
): Promise<any> {
  const apiKey = process.env.MGNREGA_API_KEY || '';
  const baseUrl = process.env.MGNREGA_API_BASE_URL || 'https://api.data.gov.in/resource';
  
  // Note: The actual resource ID and parameters need to be updated based on data.gov.in documentation
  // This is a placeholder implementation
  const resourceId = '6e4f1cc5-a6a9-4d61-a04e-2d8c1f8e6f8d'; // Replace with actual resource ID
  
  const url = new URL(`${baseUrl}/${resourceId}`);
  url.searchParams.append('api-key', apiKey);
  url.searchParams.append('format', 'json');
  url.searchParams.append('filters[district_code]', districtCode);
  url.searchParams.append('filters[financial_year]', financialYear);
  url.searchParams.append('filters[month]', month.toString());

  const response = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
    },
    signal: AbortSignal.timeout(15000), // 15 second timeout
  });

  if (!response.ok) {
    throw new Error(`API returned ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

function parseAPIResponse(apiData: any): Partial<CachedData> {
  // This function needs to be updated based on actual API response structure
  // Currently using a generic parser
  
  const record = apiData.records?.[0] || apiData;
  
  return {
    jobCardsIssued: record.total_job_cards_issued ? BigInt(record.total_job_cards_issued) : undefined,
    activeJobCards: record.active_job_cards ? BigInt(record.active_job_cards) : undefined,
    activeWorkers: record.active_workers ? BigInt(record.active_workers) : undefined,
    householdsWorked: record.households_worked ? BigInt(record.households_worked) : undefined,
    personDaysGenerated: record.person_days_generated ? BigInt(record.person_days_generated) : undefined,
    womenPersonDays: record.women_person_days ? BigInt(record.women_person_days) : undefined,
    scPersonDays: record.sc_person_days ? BigInt(record.sc_person_days) : undefined,
    stPersonDays: record.st_person_days ? BigInt(record.st_person_days) : undefined,
    totalWorksStarted: record.total_works_started ? BigInt(record.total_works_started) : undefined,
    totalWorksCompleted: record.total_works_completed ? BigInt(record.total_works_completed) : undefined,
    totalWorksInProgress: record.total_works_in_progress ? BigInt(record.total_works_in_progress) : undefined,
    totalExpenditure: record.total_expenditure ? parseFloat(record.total_expenditure) : undefined,
    wageExpenditure: record.wage_expenditure ? parseFloat(record.wage_expenditure) : undefined,
    materialExpenditure: record.material_expenditure ? parseFloat(record.material_expenditure) : undefined,
    averageDaysForPayment: record.avg_days_for_payment ? parseFloat(record.avg_days_for_payment) : undefined,
    rawData: JSON.stringify(apiData),
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<CachedData>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  const startTime = Date.now();

  try {
    // Rate limiting
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
      });
    }

    // Parse query parameters
    const { districtId, financialYear: fyParam, month: monthParam } = req.query;

    if (!districtId || typeof districtId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'District ID is required',
      });
    }

    // Get district
    const district = await prisma.district.findUnique({
      where: { id: districtId },
    });

    if (!district) {
      return res.status(404).json({
        success: false,
        error: 'District not found',
      });
    }

    const financialYear = typeof fyParam === 'string' ? fyParam : getFinancialYear();
    const month = monthParam ? parseInt(monthParam as string, 10) : new Date().getMonth() + 1;

    // Check cache first
    const cacheTTL = parseInt(process.env.CACHE_TTL_HOURS || '24', 10);
    const cacheThreshold = new Date(Date.now() - cacheTTL * 60 * 60 * 1000);

    const cachedData = await prisma.cachedMGNREGAData.findUnique({
      where: {
        districtId_financialYear_month: {
          districtId: district.id,
          financialYear,
          month,
        },
      },
    });

    // Return fresh cache if available
    if (cachedData && cachedData.fetchedAt > cacheThreshold && !cachedData.isStale) {
      await logAPIRequest(req, 200, Date.now() - startTime);
      
      return res.status(200).json({
        success: true,
        data: serializeCachedData(cachedData),
        source: 'cache',
        cachedAt: cachedData.fetchedAt.toISOString(),
      });
    }

    // Try to fetch from API
    try {
      const apiData = await fetchFromDataGovAPI(district.code, financialYear, month);
      const parsedData = parseAPIResponse(apiData);

      // Update cache
      const updated = await prisma.cachedMGNREGAData.upsert({
        where: {
          districtId_financialYear_month: {
            districtId: district.id,
            financialYear,
            month,
          },
        },
        update: {
          ...parsedData,
          fetchedAt: new Date(),
          isStale: false,
        },
        create: {
          districtId: district.id,
          financialYear,
          month,
          ...parsedData,
          isStale: false,
        },
      });

      await logAPIRequest(req, 200, Date.now() - startTime);

      return res.status(200).json({
        success: true,
        data: serializeCachedData(updated),
        source: 'api',
        cachedAt: updated.fetchedAt.toISOString(),
      });
    } catch (apiError) {
      console.error('API fetch failed:', apiError);

      // Fall back to stale cache if available
      if (cachedData) {
        await logAPIRequest(req, 200, Date.now() - startTime, 'Using stale cache');

        // Mark as stale
        await prisma.cachedMGNREGAData.update({
          where: { id: cachedData.id },
          data: { isStale: true },
        });

        return res.status(200).json({
          success: true,
          data: serializeCachedData(cachedData),
          source: 'fallback',
          cachedAt: cachedData.fetchedAt.toISOString(),
        });
      }

      // No cache available
      await logAPIRequest(req, 502, Date.now() - startTime, String(apiError));

      return res.status(502).json({
        success: false,
        error: 'Unable to fetch data from API and no cached data available',
      });
    }
  } catch (error) {
    console.error('Error in MGNREGA API:', error);
    await logAPIRequest(req, 500, Date.now() - startTime, String(error));

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}

function serializeCachedData(data: any): CachedData {
  return {
    ...data,
    jobCardsIssued: data.jobCardsIssued?.toString(),
    activeJobCards: data.activeJobCards?.toString(),
    activeWorkers: data.activeWorkers?.toString(),
    householdsWorked: data.householdsWorked?.toString(),
    personDaysGenerated: data.personDaysGenerated?.toString(),
    womenPersonDays: data.womenPersonDays?.toString(),
    scPersonDays: data.scPersonDays?.toString(),
    stPersonDays: data.stPersonDays?.toString(),
    totalWorksStarted: data.totalWorksStarted?.toString(),
    totalWorksCompleted: data.totalWorksCompleted?.toString(),
    totalWorksInProgress: data.totalWorksInProgress?.toString(),
  };
}

async function logAPIRequest(
  req: NextApiRequest,
  statusCode: number,
  responseTime: number,
  errorMessage?: string
) {
  try {
    await prisma.aPIRequestLog.create({
      data: {
        endpoint: req.url || '/api/mgnrega',
        method: req.method || 'GET',
        statusCode,
        responseTime,
        errorMessage,
      },
    });
  } catch (err) {
    console.error('Failed to log API request:', err);
  }
}
