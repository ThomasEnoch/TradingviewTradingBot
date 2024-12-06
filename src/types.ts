export interface TradingViewAlert {
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: string;
  token: string;
}

export interface BitunixOrderRequest {
  symbol: string;
  qty: string;
  side: 'BUY' | 'SELL';
  tradeSide: 'OPEN' | 'CLOSE';
  orderType: 'MARKET';
  reduceOnly?: boolean;
}

export interface BitunixResponse {
  code: number;
  data: {
    orderId: string;
    clientId?: string;
  };
  msg: string;
}
