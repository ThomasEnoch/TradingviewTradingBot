# TradingView to Bitunix Trading Bot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An automated trading bot that connects TradingView signals to Bitunix Futures trading platform, enabling automated execution of trading strategies. This bot allows you to automate your trading strategies by receiving webhook alerts from TradingView and executing trades on Bitunix Futures automatically.

## 🚀 Features

- 📈 Real-time webhook endpoint for TradingView alerts
- 🤖 Automated order execution on Bitunix Futures
- 💱 Support for multiple trading pairs and order types
- 🔒 Secure API key management with environment variables
- 📊 Position management and risk controls
- 🧪 Comprehensive test suite with unit and integration tests
- 📝 Detailed logging for monitoring and debugging

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Bitunix Futures account with API access
- TradingView account (Pro, Pro+ or Premium for webhook alerts)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/ThomasEnoch/TradingviewTradingBot.git
cd TradingviewTradingBot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your configuration:
```env
BITUNIX_API_KEY=your_api_key
BITUNIX_API_SECRET=your_api_secret
PORT=3000
NODE_ENV=production
```

## 🔧 Configuration

### Environment Variables

- `BITUNIX_API_KEY`: Your Bitunix API key
- `BITUNIX_API_SECRET`: Your Bitunix API secret
- `PORT`: Port for the webhook server (default: 3000)
- `NODE_ENV`: Environment (development/production)

### TradingView Alert Setup

1. In TradingView, create a new alert
2. Set the webhook URL to your bot's endpoint
3. Format the alert message as JSON:
```json
{
  "symbol": "BTCUSDT",
  "side": "buy",
  "quantity": 1,
  "price": 50000
}
```

## 🚦 Usage

1. Build the project:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## 🧪 Testing

Run all tests:
```bash
npm run test:all
```

Run specific test suites:
```bash
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
```

## 📚 API Documentation

### Webhook Endpoint

POST `/webhook`

Example payload:
```json
{
  "symbol": "BTCUSDT",
  "side": "buy",
  "quantity": 1,
  "price": 50000,
  "stopLoss": 49000,
  "takeProfit": 51000
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This bot is for educational purposes only. Cryptocurrency trading carries significant risks. Always test thoroughly with small amounts first. We are not responsible for any financial losses incurred while using this bot.

## 🔒 Security

- Never commit API keys or sensitive information
- Always use environment variables for sensitive data
- Regularly update dependencies for security patches
- Use secure HTTPS endpoints in production

## 📞 Support

- Create an issue for bug reports or feature requests
- Check existing issues before creating new ones
- Follow the issue templates for bug reports and feature requests

## 🙏 Acknowledgments

- TradingView for their excellent charting and alerting platform
- Bitunix for their trading API
- All contributors who have helped improve this project
