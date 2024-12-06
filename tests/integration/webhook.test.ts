import request from 'supertest';
import express from 'express';
import { BitunixAPI } from '../../src/bitunix';
import { TradingViewAlert } from '../../src/types';

const app = express();
app.use(express.json());

const {
  TRADINGVIEW_WEBHOOK_TOKEN,
  BITUNIX_API_KEY = '',
  BITUNIX_API_SECRET = ''
} = process.env;

if (!TRADINGVIEW_WEBHOOK_TOKEN || !BITUNIX_API_KEY || !BITUNIX_API_SECRET) {
  throw new Error('Required environment variables are not set');
}

const bitunix = new BitunixAPI(BITUNIX_API_KEY, BITUNIX_API_SECRET);

app.post('/webhook', async (req, res) => {
  try {
    const alert: TradingViewAlert = req.body;
    console.log('Received webhook data:', alert);

    if (alert.token !== TRADINGVIEW_WEBHOOK_TOKEN) {
      console.log('Token mismatch. Expected:', TRADINGVIEW_WEBHOOK_TOKEN, 'Received:', alert.token);
      return res.status(403).json({ error: 'Invalid token' });
    }

    if (!alert.symbol || !alert.side || !alert.quantity) {
      console.log('Missing fields in request:', alert);
      if (!alert.quantity) {
        return res.status(400).json({ error: 'Missing required fields', details: 'quantity is required' });
      }
      return res.status(400).json({ error: 'Missing required fields: symbol, side' });
    }

    console.log('Placing order with Bitunix:', {
      symbol: alert.symbol,
      qty: alert.quantity,
      side: alert.side,
      tradeSide: 'OPEN',
      orderType: 'MARKET'
    });

    try {
      const order = await bitunix.placeOrder({
        symbol: alert.symbol,
        qty: alert.quantity,
        side: alert.side,
        tradeSide: 'OPEN',
        orderType: 'MARKET'
      });

      console.log('Order placed successfully:', order);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error details:', error);
      return res.status(400).json({ 
        error: 'Failed to place order', 
        details: `Bitunix API error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    }
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Failed to place order', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

describe('Webhook Integration Tests', () => {
  const itif = process.env.NODE_ENV === 'integration' ? it : it.skip;

  const validWebhookData = {
    symbol: 'BTCUSDT',
    side: 'BUY',
    quantity: '0.001',
    token: TRADINGVIEW_WEBHOOK_TOKEN
  };

  itif('should handle missing fields', async () => {
    const { quantity, ...invalidData } = validWebhookData;
    const response = await request(app)
      .post('/webhook')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Missing required fields',
      details: 'quantity is required'
    });
  });

  itif('should handle invalid token', async () => {
    const response = await request(app)
      .post('/webhook')
      .send({
        ...validWebhookData,
        token: 'invalid-token'
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: 'Invalid token'
    });
  });

  itif('should handle order placement errors', async () => {
    const response = await request(app)
      .post('/webhook')
      .send(validWebhookData);

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      error: 'Failed to place order',
      details: expect.stringContaining('Bitunix API error:')
    });
  });
});
