export interface MGNREGAMetrics {
  jobCardsIssued?: bigint;
  activeJobCards?: bigint;
  activeWorkers?: bigint;
  householdsWorked?: bigint;
  personDaysGenerated?: bigint;
  womenPersonDays?: bigint;
  scPersonDays?: bigint;
  stPersonDays?: bigint;
  totalWorksStarted?: bigint;
  totalWorksCompleted?: bigint;
  totalWorksInProgress?: bigint;
  totalExpenditure?: number;
  wageExpenditure?: number;
  materialExpenditure?: number;
  averageDaysForPayment?: number;
}

export interface DistrictData {
  id: string;
  code: string;
  name: string;
  nameHindi?: string;
  stateCode: string;
  stateName: string;
  latitude: number;
  longitude: number;
  population?: number;
}

export interface CachedData extends MGNREGAMetrics {
  id: string;
  districtId: string;
  financialYear: string;
  month: number;
  fetchedAt: Date;
  isStale: boolean;
  rawData?: any;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  source?: 'cache' | 'api' | 'fallback';
  cachedAt?: string;
}

export interface GeolocationRequest {
  latitude: number;
  longitude: number;
}

export interface GeolocationResponse {
  district: DistrictData;
  distance: number;
}
