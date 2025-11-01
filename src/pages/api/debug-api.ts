import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.MGNREGA_API_KEY || '';
  const baseUrl = process.env.MGNREGA_API_BASE_URL || 'https://api.data.gov.in/resource/ee83643a-ee4c-48c2-ac30-9f2ff26ab722';

  try {
    // Test basic API access
    const url = new URL(baseUrl);
    url.searchParams.append('api-key', apiKey);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', '5');

    console.log('Testing API URL:', url.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MGNREGA-Performance-Tracker/1.0',
      },
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();

    // Also try XML format
    const xmlUrl = new URL(baseUrl);
    xmlUrl.searchParams.append('api-key', apiKey);
    xmlUrl.searchParams.append('format', 'xml');
    xmlUrl.searchParams.append('limit', '2');

    const xmlResponse = await fetch(xmlUrl.toString(), {
      headers: {
        'Accept': 'application/xml',
        'User-Agent': 'MGNREGA-Performance-Tracker/1.0',
      },
      signal: AbortSignal.timeout(10000),
    });

    const xmlText = await xmlResponse.text();

    return res.status(200).json({
      success: true,
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT_SET',
      baseUrl,
      jsonResponse: {
        status: response.status,
        data: data,
      },
      xmlResponse: {
        status: xmlResponse.status,
        data: xmlText.substring(0, 500) + (xmlText.length > 500 ? '...' : ''),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT_SET',
      baseUrl,
    });
  }
}