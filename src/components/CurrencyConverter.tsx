import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { ApiService } from '../services/api';

type ExchangeRates = {
  EUR: number;
  GBP: number;
  CAD: number;
  PKR: number;
};

const CurrencyConverter = () => {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    const result = await ApiService.getExchangeRates();

    if (result.success) {
      setRates(result.rates ?? null);
    } else {
      setError('Unable to load live rates.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>🔱 Live Exchange Rates (1 USD)</Text>
        <TouchableOpacity onPress={fetchRates} disabled={loading}>
          <Text style={styles.refreshText}>
            {loading ? '...' : '🔄 Refresh'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color="#0066CC" />
          <Text style={styles.loadingText}>Fetching currency rates...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchRates}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.ratesGrid}>
          <View style={styles.rateBox}>
            <Text style={styles.currencyLabel}>EUR (Euro)</Text>
            <Text style={styles.currencyValue}>
              €{rates?.EUR ? rates.EUR.toFixed(2) : 'N/A'}
            </Text>
          </View>

          <View style={styles.rateBox}>
            <Text style={styles.currencyLabel}>GBP (Pound)</Text>
            <Text style={styles.currencyValue}>
              £{rates?.GBP ? rates.GBP.toFixed(2) : 'N/A'}
            </Text>
          </View>

          <View style={styles.rateBox}>
            <Text style={styles.currencyLabel}>CAD (Dollar)</Text>
            <Text style={styles.currencyValue}>
              ${rates?.CAD ? rates.CAD.toFixed(2) : 'N/A'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default CurrencyConverter;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  refreshText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '600',
  },
  centerContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '600',
  },
  ratesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rateBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  currencyLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  currencyValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
});
