import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys mein key add karein
const KEYS = {
  USER_CREDENTIALS: '@user_credentials',
  USER_SESSION: '@user_session',
  TRANSACTIONS: '@transactions_data', // New key
};

// Initial dummy data
const DUMMY_TRANSACTIONS = [
  {
    id: '1',
    title: 'Grocery Store',
    category: 'Food & Dining',
    amount: '-$45.00',
    date: 'Sep 24',
  },
  {
    id: '2',
    title: 'Fuel / Gas',
    category: 'Transportation',
    amount: '-$30.00',
    date: 'Sep 23',
  },
  {
    id: '3',
    title: 'Salary Deposit',
    category: 'Income',
    amount: '+$2,500.00',
    date: 'Sep 20',
    isIncome: true,
  },
  {
    id: '4',
    title: 'Coffee Shop',
    category: 'Food & Dining',
    amount: '-$4.50',
    date: 'Sep 19',
  },
];

export const StorageService = {
  saveUserCredentials: async userData => {
    try {
      const jsonValue = JSON.stringify(userData);
      await AsyncStorage.setItem(KEYS.USER_CREDENTIALS, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving user credentials:', error);
      return false;
    }
  },

  getUserCredentials: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.USER_CREDENTIALS);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error fetching user credentials:', error);
      return null;
    }
  },

  saveUserSession: async sessionData => {
    try {
      const jsonValue = JSON.stringify(sessionData);
      await AsyncStorage.setItem(KEYS.USER_SESSION, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving user session:', error);
      return false;
    }
  },

  getUserSession: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.USER_SESSION);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error fetching user session:', error);
      return null;
    }
  },

  clearUserSession: async () => {
    try {
      await AsyncStorage.removeItem(KEYS.USER_SESSION);
      return true;
    } catch (error) {
      console.error('Error clearing user session:', error);
      return false;
    }
  },
  getTransactions: async () => {
    try {
      const data = await AsyncStorage.getItem(KEYS.TRANSACTIONS);
      if (data != null) {
        return JSON.parse(data);
      } else {
        // Pehli baar dummy data storage mein save kar dein
        await AsyncStorage.setItem(
          KEYS.TRANSACTIONS,
          JSON.stringify(DUMMY_TRANSACTIONS),
        );
        return DUMMY_TRANSACTIONS;
      }
    } catch (error) {
      console.error('Error reading transactions:', error);
      return DUMMY_TRANSACTIONS;
    }
  },
  addTransaction: async newTransaction => {
    try {
      const existing = await StorageService.getTransactions();
      const updated = [newTransaction, ...existing];
      await AsyncStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return null;
    }
  },
};

export const debugDumpStorage = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('=== ASYNC STORAGE DUMP ===');
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      console.log(`${key}:`, value);
    }
    console.log('==========================');
  } catch (error) {
    console.error('Failed to dump storage:', error);
  }
};
