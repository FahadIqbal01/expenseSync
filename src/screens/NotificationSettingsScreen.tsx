import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../utils/notificationService';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORAGE_KEY = '@notification_settings';

const NotificationSettingsScreen = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          setIsEnabled(parsed.isEnabled);
          setDailyReminder(parsed.dailyReminder);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const saveSettings = async (enabledState, reminderState) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isEnabled: enabledState,
          dailyReminder: reminderState,
        }),
      );
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleToggleMaster = async value => {
    if (value) {
      const granted = await NotificationService.requestAndroidPermission();
      if (!granted) {
        Alert.alert(
          'Permission Denied',
          'Please grant notification permissions in settings.',
        );
        return;
      }
      setIsEnabled(true);
      await saveSettings(true, dailyReminder);
      if (dailyReminder) {
        await NotificationService.scheduleDailyReminder();
      }
    } else {
      setIsEnabled(false);
      await saveSettings(false, dailyReminder);
      NotificationService.cancelAllReminders();
    }
  };

  const handleSendTest = async () => {
    if (!isEnabled) {
      Alert.alert('Disabled', 'Please enable notifications first.');
      return;
    }

    const success = await NotificationService.sendTestNotification();
    if (!success) {
      Alert.alert('Error', 'Notification permission not granted.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation && navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionHeader}>GENERAL NOTIFICATIONS</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.labelGroup}>
              <Text style={styles.rowTitle}>Allow Notifications</Text>
              <Text style={styles.rowSubtitle}>
                Enable or disable all app alerts
              </Text>
            </View>
            <Switch
              value={isEnabled}
              onValueChange={handleToggleMaster}
              trackColor={{ false: '#CBD5E1', true: '#0066CC' }}
            />
          </View>
        </View>

        <Text style={styles.sectionHeader}>TEST & VERIFY</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.testButton, !isEnabled && styles.disabledButton]}
            onPress={handleSendTest}
            disabled={!isEnabled}
          >
            <Text style={styles.testButtonText}>
              🔔 Trigger Immediate Test Notification
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationSettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: { paddingVertical: 4 },
  backButtonText: { fontSize: 15, color: '#0066CC', fontWeight: '600' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  labelGroup: { flex: 1, marginRight: 12 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  rowSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  testButton: { paddingVertical: 14, alignItems: 'center' },
  disabledButton: { opacity: 0.4 },
  testButtonText: { color: '#0066CC', fontSize: 14, fontWeight: '700' },
});
