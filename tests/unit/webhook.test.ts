import request from 'supertest';
import express from 'express';
import { BitunixAPI } from '../../src/bitunix';
import { TradingViewAlert } from '../../src/types';

jest.mock('../../src/bitunix');

const app = express();
app.use(express.json());

const {
  TRADINGVIEW_WEBHOOK_TOKEN,
  BITUNIX_API_KEY = '',
  BITUNIX_API_SECRET = ''
} = process.env;

const bitunix = new BitunixAPI(BITUNIX_API_KEY, BITUNIX_API_SECRET);

app.post('/webhook', async (req, res) => {
  try {
    const alert: TradingViewAlert = req.body;

    if (alert.token !== TRADINGVIEW_WEBHOOK_TOKEN) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    if (!alert.symbol || !alert.side || !alert.quantity) {
      return res.status(400).json({ error: 'Missing required fields: symbol, side, quantity' });
    }

    const order = await bitunix.placeOrder({
      symbol: alert.symbol,
      qty: alert.quantity,
      side: alert.side,
      tradeSide: 'OPEN',
      orderType: 'MARKET'
    });

    res.json({ status: 'Order placed', orderId: order.data.orderId });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to place order', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

describe('Webhook Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validWebhookData = {
    symbol: 'BTCUSDT',
    side: 'BUY',
    quantity: '0.001',
    token: TRADINGVIEW_WEBHOOK_TOKEN
  };

  test('should accept valid webhook data and place order', async () => {
    const mockOrderResponse = {
      code: 0,
      data: { orderId: 'test-order-id' },
      msg: 'Success'
    };

    (BitunixAPI.prototype.placeOrder as jest.Mock).mockResolvedValueOnce(mockOrderResponse);

    const response = await request(app)
      .post('/webhook')
      .send(validWebhookData)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({
      status: 'Order placed',
      orderId: 'test-order-id'
    });

    expect(BitunixAPI.prototype.placeOrder).toHaveBeenCalledWith({
      symbol: 'BTCUSDT',
      qty: '0.001',
      side: 'BUY',
      tradeSide: 'OPEN',
      orderType: 'MARKET'
    });
  });

  test('should reject request with invalid token', async () => {
    const invalidData = { ...validWebhookData, token: 'invalid-token' };

    const response = await request(app)
      .post('/webhook')
      .send(invalidData)
      .expect('Content-Type', /json/)
      .expect(403);

    expect(response.body).toEqual({
      error: 'Invalid token'
    });

    expect(BitunixAPI.prototype.placeOrder).not.toHaveBeenCalled();
  });

  test('should reject request with missing required fields', async () => {
    const invalidData = {
      symbol: 'BTCUSDT',
      token: TRADINGVIEW_WEBHOOK_TOKEN
    };

    const response = await request(app)
      .post('/webhook')
      .send(invalidData)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toEqual({
      error: 'Missing required fields: symbol, side, quantity'
    });

    expect(BitunixAPI.prototype.placeOrder).not.toHaveBeenCalled();
  });

  test('should handle Bitunix API errors', async () => {
    (BitunixAPI.prototype.placeOrder as jest.Mock).mockRejectedValueOnce(
      new Error('Bitunix API error: Insufficient balance')
    );

    const response = await request(app)
      .post('/webhook')
      .send(validWebhookData)
      .expect('Content-Type', /json/)
      .expect(500);

    expect(response.body).toEqual({
      error: 'Failed to place order',
      details: 'Bitunix API error: Insufficient balance'
    });
  });
});
