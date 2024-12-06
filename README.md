# TradingView to Bitunix Futures Trading Bot

An automated trading bot that connects TradingView signals to Bitunix Futures trading platform, enabling automated execution of trading strategies.

## Features

- Webhook endpoint for receiving TradingView alerts
- Automated order execution on Bitunix Futures
- Support for multiple trading pairs
- Secure API key management
- Comprehensive error handling and logging
- Unit and integration tests

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Bitunix Futures account with API access
- TradingView account (Pro, Pro+ or Premium for webhook alerts)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ThomasEnoch/TradingviewTradingBot-.git
cd TradingviewTradingBot-
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
```

## Usage

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

## Testing

Run all tests:
```bash
npm run test:all
```

Run specific test suites:
```bash
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
```

## Configuration

The bot can be configured through environment variables and the config files in the `src` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Security

Never commit your API keys or sensitive information. Always use environment variables for sensitive data.
