export interface MarketSnapshot {
  id: number;
  symbol: string;
  timeframe: string;
  price: number | string;
  rsi: number | string | null;
  ema50: number | string | null;
  ema200: number | string | null;
  support: number | string | null;
  resistance: number | string | null;
  created_at: string;
}

export interface TradeSignal {
  id: number;
  symbol: string;
  action: string;
  confidence: number;
  timeframe: string | null;
  reason: string | null;
  created_at: string;
}

export interface Order {
  id: number;
  action: string;
  entry_type: string;
  entry_price: number | string;
  stop_loss: number | string;
  take_profit: number | string;
  status: string;
  expires_at: string | null;
  created_at?: string;
}

export interface Position {
  id: number;
  ticket: string;
  symbol: string;
  action: string;
  entry_price: number | string;
  stop_loss: number | string;
  take_profit: number | string;
  status: string;
  profit_loss: number | string | null;
}

export interface ExecutionInstruction {
  action: string;
  reason?: string;
  order_id?: number;
  symbol?: string;
  entry_price?: number | string;
  stop_loss?: number | string;
  take_profit?: number | string;
  expires_at?: string;
}

export interface StatisticsSummary {
  total_trades: number;
  wins: number;
  losses: number;
  breakeven?: number;
  win_rate: number;
  total_profit_loss: number | string;
  gross_profit?: number | string;
  gross_loss?: number | string;
}

export interface DailyPnl {
  date: string;
  profit_loss: number | string;
  trades: number;
  wins: number;
  losses: number;
}

export interface MonthlyPnl {
  month: string;
  profit_loss: number | string;
  trades: number;
  wins: number;
  losses: number;
}

export interface Statistics {
  generated_at: string;
  period: {
    from: string;
    to: string;
    symbol: string | null;
  };
  summary: StatisticsSummary;
  daily_pnl: DailyPnl[];
  monthly_pnl: MonthlyPnl[];
}

export interface DashboardData {
  xauusdPrice: string | null;
  latestSignal: TradeSignal | null;
  signalConfidence: number | null;
  orderStatus: string;
  openPositionStatus: string;
  dailyPnl: string | null;
  totalTradesToday: number | null;
}
