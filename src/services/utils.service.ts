import { APIRequest } from './api-request';

export class UtilsService extends APIRequest {
  statistics() {
    return this.get('/admin/statistics');
  }

  earningstatistics() {
    return this.get('/admin/statistics/earnings');
  }

  statisticsEndpoint() {
    return '/admin/statistics';
  }

  earningstatisticsEndpoint() {
    return '/admin/statistics/earnings';
  }
}

export const utilsService = new UtilsService();
