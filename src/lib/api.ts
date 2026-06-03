import axios, { type AxiosInstance } from "axios";
import type {
  DashboardData,
  ExecutionInstruction,
  MarketSnapshot,
  Order,
  Position,
  Statistics,
  TradeSignal,
} from "./types";

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
    limit?: number;
  }): Promise<MarketSnapshot[]> => {
    const data = await get<unknown>("/market_snapshots", {
      ...(params?.symbol ? { symbol: params.symbol } : {}),
      ...(params?.limit ? { limit: params.limit } : {}),
    });
    return unwrapList<MarketSnapshot>(data);
  },

  getTradeSignals: async (params?: { limit?: number }): Promise<TradeSignal[]> => {
    const data = await get<unknown>("/trade_signals", {
      ...(params?.limit ? { limit: params.limit } : {}),
    });
    return unwrapList<TradeSignal>(data);
  },

  getOrders: async (): Promise<Order[]> => {
    const data = await get<unknown>("/orders");
    return unwrapList<Order>(data);
  },

  getPositions: async (params?: { status?: string }): Promise<Position[]> => {
    const data = await get<unknown>("/positions", {
      ...(params?.status ? { status: params.status } : {}),
    });
    return unwrapList<Position>(data);
  },

  getExecution: async (): Promise<ExecutionInstruction> => {
    return get<ExecutionInstruction>("/execution");
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
