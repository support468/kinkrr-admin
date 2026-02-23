import { APIRequest } from './api-request';

export class TokenTransactionService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/admin/wallet/charges/search', query)
    );
  }

  searchEndpoint() {
    return '/admin/wallet/charges/search';
  }
}

export const tokenTransactionService = new TokenTransactionService();
