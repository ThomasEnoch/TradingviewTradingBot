import express from 'express';
import dotenv from 'dotenv';
import { BitunixAPI } from './bitunix';
import { TradingViewAlert } from './types';

dotenv.config();

const app = express();
app.use(express.json());

const {
  PORT = 3000,
  TRADINGVIEW_TOKEN,
  BITUNIX_API_KEY,
  BITUNIX_API_SECRET
} = process.env;

if (!TRADINGVIEW_TOKEN || !BITUNIX_API_KEY || !BITUNIX_API_SECRET) {
  throw new Error('Missing required environment variables');
}

const bitunix = new BitunixAPI(BITUNIX_API_KEY, BITUNIX_API_SECRET);

app.post('/webhook', async (req, res) => {
  try {
    const alert: TradingViewAlert = req.body;

    if (alert.token !== TRADINGVIEW_TOKEN) {
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

    console.log(`Order placed successfully: ${order.data.orderId}`);
    res.json({ status: 'Order placed', orderId: order.data.orderId });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ 
      error: 'Failed to place order', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
