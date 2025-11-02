/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find nearest district based on user coordinates
 */
export interface District {
  id: string;
  code: string;
  name: string;
  nameHindi: string | null;
  latitude: number;
  longitude: number;
  distance?: number;
}

export function findNearestDistrict(
  userLat: number,
  userLon: number,
  districts: District[]
): District | null {
  if (!districts || districts.length === 0) return null;

  let nearestDistrict = districts[0];
  let minDistance = calculateDistance(
    userLat,
    userLon,
    districts[0].latitude,
    districts[0].longitude
  );

  for (let i = 1; i < districts.length; i++) {
    const distance = calculateDistance(
      userLat,
      userLon,
      districts[i].latitude,
      districts[i].longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestDistrict = districts[i];
    }
  }

  return {
    ...nearestDistrict,
    distance: minDistance,
  };
}

/**
 * Format large numbers for Indian locale (Lakhs/Crores)
 */
export function formatIndianNumber(num: number | bigint): string {
  const numStr = num.toString();
  const len = numStr.length;

  if (len <= 3) return numStr;
  if (len <= 5) return `${numStr.slice(0, len - 3)},${numStr.slice(len - 3)}`;

  // Format with lakhs and crores
  let result = numStr.slice(-3);
  let remaining = numStr.slice(0, -3);

  while (remaining.length > 2) {
    result = `${remaining.slice(-2)},${result}`;
    remaining = remaining.slice(0, -2);
  }

  if (remaining.length > 0) {
    result = `${remaining},${result}`;
  }

  return result;
}

/**
 * Convert number to human-readable format (Lakhs/Crores)
 */
export function formatLargeNumber(num: number | bigint): string {
  const n = typeof num === 'bigint' ? Number(num) : num;

  if (n >= 10000000) {
    // Crores
    return `${(n / 10000000).toFixed(2)} करोड़ (Cr)`;
  } else if (n >= 100000) {
    // Lakhs
    return `${(n / 100000).toFixed(2)} लाख (L)`;
  } else if (n >= 1000) {
    // Thousands
    return `${(n / 1000).toFixed(2)} हजार (K)`;
  }
  return n.toString();
}

/**
 * Get financial year from date
 */
export function getFinancialYear(date: Date = new Date()): string {
  // For now, return the financial year that has data in the API
  return "2024-2025";
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Safe BigInt conversion
 */
export function toBigInt(value: any): bigint {
  if (typeof value === 'bigint') return value;
  if (typeof value === 'number') return BigInt(Math.floor(value));
  if (typeof value === 'string') return BigInt(value);
  return BigInt(0);
}

/**
 * Safe number conversion from BigInt
 */
export function toNumber(value: any): number {
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value);
  return 0;
}
