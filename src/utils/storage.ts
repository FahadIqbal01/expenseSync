import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_CREDENTIALS: '@user_credentials',
  USER_SESSION: '@user_session',
};

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
};
