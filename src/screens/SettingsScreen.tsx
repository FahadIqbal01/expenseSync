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
import { StorageService } from '../utils/storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState({
    userName: 'User',
    email: 'user@example.com',
  });

  // Settings State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currency, setCurrency] = useState('USD ($)');

  useEffect(() => {
    const loadUserData = async () => {
      const creds = await StorageService.getUserCredentials();
      if (creds) {
        setUserProfile({
          userName: creds.userName || 'User',
          email: creds.email || 'user@example.com',
        });
      }
    };
    loadUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearUserSession();
            if (navigation) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          },
        },
      ],
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Reset All Data',
      'This will erase all saved transactions and user credentials from local storage. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Everything',
          style: 'destructive',
          onPress: async () => {
            const success = await StorageService.clearAll();
            if (success) {
              Alert.alert(
                'Reset Complete',
                'All local app data has been cleared.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      if (navigation) {
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'SignUp' }],
                        });
                      }
                    },
                  },
                ],
              );
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation && navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {userProfile.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.userName}</Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
          </View>
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionHeader}>PREFERENCES</Text>
        <View style={styles.settingGroup}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#CBD5E1', true: '#0066CC' }}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#CBD5E1', true: '#0066CC' }}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() =>
              Alert.alert('Currency', 'Default currency selection')
            }
          >
            <Text style={styles.settingLabel}>Primary Currency</Text>
            <Text style={styles.settingValueText}>{currency} ›</Text>
          </TouchableOpacity>
        </View>

        {/* Storage & Data Section */}
        <Text style={styles.sectionHeader}>DATA & STORAGE</Text>
        <View style={styles.settingGroup}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleClearAllData}
          >
            <Text style={[styles.settingLabel, styles.dangerText]}>
              Clear All Storage & Cache
            </Text>
            <Text style={styles.settingValueText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* About App Section */}
        <Text style={styles.sectionHeader}>ABOUT</Text>
        <View style={styles.settingGroup}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>App Version</Text>
            <Text style={styles.settingValueText}>1.0.0 (Build 2026)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Developer</Text>
            <Text style={styles.settingValueText}>IBM Capstone Project</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 15,
    color: '#0066CC',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: '#64748B',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    marginLeft: 4,
  },
  settingGroup: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
  },
  settingValueText: {
    fontSize: 14,
    color: '#64748B',
  },
  dangerText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  logoutButton: {
    height: 48,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '600',
  },
});
