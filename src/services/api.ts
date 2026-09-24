// Centralized API Service for External Data Fetching

const BASE_URL = 'https://open.er-api.com/v6/latest/USD';

export const ApiService = {
  /**
   * Fetches latest currency exchange rates relative to USD
   */
  getExchangeRates: async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return {
        success: true,
        base: data.base_code,
        rates: {
          EUR: data.rates.EUR,
          GBP: data.rates.GBP,
          CAD: data.rates.CAD,
          PKR: data.rates.PKR,
        },
        lastUpdated: data.time_last_update_utc,
      };
    } catch (error) {
      console.error('API Fetch Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch live rates',
      };
    }
  },
};
