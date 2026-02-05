import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { loadGoogleSheetsData, isGoogleSheetsConfigured } from '../data/googleSheetsLoader';
import type { LoadedSalesData } from '../data/googleSheetsLoader';
import {
  getSalesKPIs,
  getForecastOverTime,
  getForecastOverTimeBySegment,
  getPipelineByStage,
  getDealDistribution,
  getForecastARRWithDetails,
  getPipelineDeals2026,
  getACVByMonth2026,
  getDealsByMonth2026,
  getClientWinsOverTime,
  getClientDeals,
  getDealsByQuarter,
} from '../data/salesMockData';
import type { QuarterId } from '../data/salesMockData';

type SalesDataContextValue = {
  /** When true, Google Sheets is configured and we're loading or using it */
  useGoogleSheets: boolean;
  /** Loaded data from Google (null until loaded or when using mock) */
  googleData: LoadedSalesData | null;
  loading: boolean;
  error: string | null;
  /** Use these getters; they return Google data when available, else mock */
  getKPIs: () => ReturnType<typeof getSalesKPIs>;
  getForecastLine: (selectedSegments?: string[]) => ReturnType<typeof getForecastOverTime>;
  getPipelineStages: () => ReturnType<typeof getPipelineByStage>;
  getDealDist: (selectedSegments?: string[]) => ReturnType<typeof getDealDistribution>;
  getForecastARR: () => ReturnType<typeof getForecastARRWithDetails>;
  getPipelineDeals: () => ReturnType<typeof getPipelineDeals2026>;
  getACVByMonth: (deals: ReturnType<typeof getPipelineDeals2026>) => ReturnType<typeof getACVByMonth2026>;
  getDealsByMonth: (deals: ReturnType<typeof getPipelineDeals2026>) => ReturnType<typeof getDealsByMonth2026>;
  getClientWins: () => ReturnType<typeof getClientWinsOverTime>;
  getClientDealsList: () => ReturnType<typeof getClientDeals>;
  getQuarterDeals: (quarter: QuarterId) => ReturnType<typeof getDealsByQuarter>;
};

const SalesDataContext = createContext<SalesDataContextValue | null>(null);

export function SalesDataProvider({ children }: { children: ReactNode }) {
  const [googleData, setGoogleData] = useState<LoadedSalesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const useGoogleSheets = isGoogleSheetsConfigured();

  useEffect(() => {
    if (!useGoogleSheets) return;
    setLoading(true);
    setError(null);
    loadGoogleSheetsData()
      .then(setGoogleData)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [useGoogleSheets]);

  const getKPIs = useCallback(() => {
    if (googleData?.salesKPIs) return googleData.salesKPIs;
    return getSalesKPIs();
  }, [googleData]);

  const getForecastLine = useCallback(
    (selectedSegments?: string[]) => {
      if (googleData && googleData.forecastPointBySegment.length > 0 && selectedSegments?.length) {
        const filtered = googleData.forecastPointBySegment.filter((r) =>
          selectedSegments.includes(r.segment)
        );
        const byMonth = new Map<string, { forecast: number; target: number }>();
        for (const r of filtered) {
          const cur = byMonth.get(r.month) ?? { forecast: 0, target: 0 };
          cur.forecast += r.forecast;
          cur.target += r.target;
          byMonth.set(r.month, cur);
        }
        return Array.from(byMonth.entries()).map(([month, cur]) => ({
          month,
          forecast: cur.forecast,
          target: cur.target,
        }));
      }
      if (googleData && googleData.forecastPoint.length > 0) return googleData.forecastPoint;
      return getForecastOverTime(selectedSegments);
    },
    [googleData]
  );

  const getPipelineStages = useCallback(() => {
    if (googleData && googleData.pipelineStage.length > 0) return googleData.pipelineStage;
    return getPipelineByStage();
  }, [googleData]);

  const getDealDist = useCallback(
    (selectedSegments?: string[]) => {
      if (googleData && googleData.dealSegment.length > 0) {
        const list =
          selectedSegments?.length > 0
            ? googleData.dealSegment.filter((s) => selectedSegments.includes(s.name))
            : googleData.dealSegment;
        const total = list.reduce((a, s) => a + s.value, 0);
        const normalized =
          total > 0 ? list.map((s) => ({ ...s, value: Math.round((s.value / total) * 100) })) : list;
        return normalized;
      }
      return getDealDistribution(selectedSegments);
    },
    [googleData]
  );

  const getForecastARR = useCallback(() => {
    if (googleData && googleData.arrByMonthPoint.length > 0) {
      return {
        chartData: googleData.arrByMonthPoint,
        detailsByMonth: googleData.detailsByMonth ?? {},
      };
    }
    return getForecastARRWithDetails();
  }, [googleData]);

  const getPipelineDeals = useCallback(() => {
    if (googleData && googleData.pipelineDeal.length > 0) return googleData.pipelineDeal;
    return getPipelineDeals2026();
  }, [googleData]);

  const getACVByMonth = useCallback(
    (deals: ReturnType<typeof getPipelineDeals2026>) => {
      if (googleData && googleData.acvByMonth.length > 0) return googleData.acvByMonth;
      return getACVByMonth2026(deals);
    },
    [googleData]
  );

  const getDealsByMonth = useCallback(
    (deals: ReturnType<typeof getPipelineDeals2026>) => getDealsByMonth2026(deals),
    []
  );

  const getClientWins = useCallback(() => {
    if (googleData && googleData.clientWinsPoint.length > 0) return googleData.clientWinsPoint;
    return getClientWinsOverTime();
  }, [googleData]);

  const getClientDealsList = useCallback(() => {
    if (googleData && googleData.clientDeal.length > 0) return googleData.clientDeal;
    return getClientDeals();
  }, [googleData]);

  const getQuarterDeals = useCallback(
    (quarter: QuarterId) => {
      if (googleData && googleData.quarterDeal.length > 0) {
        const quarterMonths: Record<QuarterId, number[]> = {
          '2026Q1': [1, 2, 3],
          '2026Q2': [4, 5, 6],
          '2026Q3': [7, 8, 9],
          '2026Q4': [10, 11, 12],
        };
        const months = quarterMonths[quarter];
        return googleData.quarterDeal.filter((d) => {
          const m = parseInt(d.closeDate.slice(5, 7), 10);
          return months.includes(m);
        });
      }
      return getDealsByQuarter(quarter);
    },
    [googleData]
  );

  const value: SalesDataContextValue = {
    useGoogleSheets,
    googleData,
    loading,
    error,
    getKPIs,
    getForecastLine,
    getPipelineStages,
    getDealDist,
    getForecastARR,
    getPipelineDeals,
    getACVByMonth,
    getDealsByMonth,
    getClientWins,
    getClientDealsList,
    getQuarterDeals,
  };

  return (
    <SalesDataContext.Provider value={value}>{children}</SalesDataContext.Provider>
  );
}

export function useSalesData(): SalesDataContextValue {
  const ctx = useContext(SalesDataContext);
  if (!ctx) throw new Error('useSalesData must be used within SalesDataProvider');
  return ctx;
}
