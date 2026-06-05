import axios, { type AxiosInstance } from "axios";
import type {
  ActivityLog,
  DashboardData,
  ExecutionInstruction,
  MarketSnapshot,
  Order,
  Position,
  Statistics,
  TradeSignal,
} from "./types";
import {
  PAGE_SIZE,
  type PaginatedResult,
  type PaginationMeta,
} from "./pagination";

export type { PaginatedResult, PaginationMeta } from "./pagination";
export { PAGE_SIZE } from "./pagination";

function resolveApiBase(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (configured) return configured;
  // Same-origin: Next.js rewrites /api/* to the Rails API (avoids CORS in dev).
  if (typeof window !== "undefined") return "";
  return "http://localhost:3000";
}

const API_PREFIX = "/api/v1";

function createClient(): AxiosInstance {
  return axios.create({
    baseURL: `${resolveApiBase()}${API_PREFIX}`,
    headers: { Accept: "application/json" },
    timeout: 15_000,
  });
}

const client = createClient();

function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && "data" in payload) {
    const data = (payload as { data: unknown }).data;
    if (Array.isArray(data)) return data as T[];
  }
  return [];
}

function unwrapPaginated<T>(payload: unknown): PaginatedResult<T> {
  const data = unwrapList<T>(payload);
  const record = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const metaRaw = record.meta;

  if (metaRaw && typeof metaRaw === "object") {
    const meta = metaRaw as Record<string, unknown>;
    return {
      data,
      meta: {
        page: Number(meta.page) || 1,
        per_page: Number(meta.per_page) || PAGE_SIZE,
        total_count: Number(meta.total_count) || data.length,
        total_pages: Number(meta.total_pages) || 1,
      },
    };
  }

  return {
    data,
    meta: {
      page: 1,
      per_page: data.length || PAGE_SIZE,
      total_count: data.length,
      total_pages: data.length > 0 ? 1 : 0,
    },
  };
}

type ListQueryParams = {
  page?: number;
  per_page?: number;
};

function listParams(params?: ListQueryParams): Record<string, number> {
  return {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? PAGE_SIZE,
  };
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { error?: string; message?: string } | undefined;
    const message =
      data?.error ||
      data?.message ||
      (status ? `Request failed (${status})` : undefined) ||
      error.message ||
      "Request failed";
    return new ApiError(message, status);
  }
  if (error instanceof Error) return new ApiError(error.message);
  return new ApiError("Unknown error");
}

async function get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  try {
    const { data } = await client.get<T>(path, { params });
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

export const api = {
  getMarketSnapshots: async (params?: {
    symbol?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResult<MarketSnapshot>> => {
    const data = await get<unknown>("/market_snapshots", {
      ...listParams(params),
      ...(params?.symbol ? { symbol: params.symbol } : {}),
    });
    return unwrapPaginated<MarketSnapshot>(data);
  },

  getTradeSignals: async (params?: {
    symbol?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResult<TradeSignal>> => {
    const data = await get<unknown>("/trade_signals", {
      ...listParams(params),
      ...(params?.symbol ? { symbol: params.symbol } : {}),
    });
    return unwrapPaginated<TradeSignal>(data);
  },

  getOrders: async (params?: {
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResult<Order>> => {
    const data = await get<unknown>("/orders", {
      ...listParams(params),
      ...(params?.status ? { status: params.status } : {}),
    });
    return unwrapPaginated<Order>(data);
  },

  getPositions: async (params?: {
    status?: string;
    symbol?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResult<Position>> => {
    const data = await get<unknown>("/positions", {
      ...listParams(params),
      ...(params?.status ? { status: params.status } : {}),
      ...(params?.symbol ? { symbol: params.symbol } : {}),
    });
    return unwrapPaginated<Position>(data);
  },

  getExecution: async (): Promise<ExecutionInstruction> => {
    return get<ExecutionInstruction>("/execution");
  },

  getActivityLogs: async (params?: {
    limit?: number;
    since_id?: number;
  }): Promise<ActivityLog[]> => {
    const data = await get<{ data: ActivityLog[] }>("/activity_logs", {
      limit: params?.limit ?? PAGE_SIZE,
      ...(params?.since_id != null ? { since_id: params.since_id } : {}),
    });
    return Array.isArray(data.data) ? data.data : unwrapList<ActivityLog>(data);
  },

  getActivityLogsPage: async (params?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResult<ActivityLog>> => {
    const data = await get<unknown>("/activity_logs", {
      page: params?.page ?? 1,
      per_page: params?.per_page ?? PAGE_SIZE,
    });
    return unwrapPaginated<ActivityLog>(data);
  },

  getStatistics: async (params?: {
    from?: string;
    to?: string;
    daily_days?: number;
    monthly_months?: number;
  }): Promise<Statistics> => {
    return get<Statistics>("/statistics", params);
  },

  getPerformance: async (params?: {
    from?: string;
    to?: string;
    daily_days?: number;
    monthly_months?: number;
  }): Promise<Statistics> => {
    return get<Statistics>("/performance", params);
  },

  getDashboard: async (): Promise<DashboardData> => {
    const payload = await get<{
      xauusd_price: string | number | null;
      latest_signal: TradeSignal | null;
      signal_confidence: number | null;
      order_status: string;
      open_position_status: string;
      daily_pnl: string | number | null;
      total_trades_today: number | null;
    }>("/dashboard");

    return {
      xauusdPrice:
        payload.xauusd_price !== null && payload.xauusd_price !== undefined
          ? String(payload.xauusd_price)
          : null,
      latestSignal: payload.latest_signal,
      signalConfidence: payload.signal_confidence,
      orderStatus: payload.order_status,
      openPositionStatus: payload.open_position_status,
      dailyPnl:
        payload.daily_pnl !== null && payload.daily_pnl !== undefined
          ? String(payload.daily_pnl)
          : null,
      totalTradesToday: payload.total_trades_today,
    };
  },
};

export function getApiBase(): string {
  return resolveApiBase();
}
