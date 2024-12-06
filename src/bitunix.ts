import axios from 'axios';
import crypto from 'crypto';
import { BitunixOrderRequest, BitunixResponse } from './types';

export class BitunixAPI {
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly baseUrl = 'https://fapi.bitunix.com';

  constructor(apiKey: string, secretKey: string) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
  }

  private generateNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private generateSignature(nonce: string, timestamp: string, body: string): string {
    const queryParams = '';
    const digestInput = nonce + timestamp + this.apiKey + queryParams + body;
    const digest = crypto.createHash('sha256').update(digestInput).digest('hex');
    const signInput = digest + this.secretKey;
    return crypto.createHash('sha256').update(signInput).digest('hex');
  }

  async placeOrder(order: BitunixOrderRequest): Promise<BitunixResponse> {
    const endpoint = '/api/v1/futures/trade/place_order';
    const nonce = this.generateNonce();
    const timestamp = Date.now().toString();
    const body = JSON.stringify(order);

    const signature = this.generateSignature(nonce, timestamp, body);

    try {
      const response = await axios.post<BitunixResponse>(
        `${this.baseUrl}${endpoint}`,
        order,
        {
          headers: {
            'api-key': this.apiKey,
            'nonce': nonce,
            'timestamp': timestamp,
            'sign': signature,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.code !== 0) {
            throw new Error(`Bitunix API error: ${response.data.msg} (code: ${response.data.code})`);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(`Bitunix API error: ${error.response.data.msg || error.message}`);
      }
      throw error;
    }
  }
}
