import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
} from 'react-native';
import { StorageService, debugDumpStorage } from '../utils/storage'; // Custom storage service import
import { SafeAreaView } from 'react-native-safe-area-context';
import CurrencyConverter from '../components/CurrencyConverter';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('User');
  const [transactions, setTransactions] = useState([]); // <--- New state for storage transactions

  useEffect(() => {
    // 1. Storage ka current state logcat/terminal par print karne ke liye
    debugDumpStorage();

    // 2. Screen load hote hi session + transactions fetch karein
    const loadHomeScreenData = async () => {
      try {
        // --- User Name Fetching ---
        const session = await StorageService.getUserSession();
        if (session && session.user) {
          setUserName(session.user);
        } else {
          const creds = await StorageService.getUserCredentials();
          if (creds && creds.userName) {
            setUserName(creds.userName);
          }
        }

        // --- Transactions Fetching from Local Storage ---
        const storedTransactions = await StorageService.getTransactions();
        setTransactions(storedTransactions);
      } catch (error) {
        console.error('Error loading HomeScreen data:', error);
      }
    };

    loadHomeScreenData();
  }, []);

  const handleLogout = async () => {
    await StorageService.clearUserSession();
    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.transactionCard}
      onPress={() => navigation && navigation.navigate('Detail', { item })}
    >
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>{item.title.charAt(0)}</Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionCategory}>
          {item.category} • {item.date}
        </Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          item.isIncome ? styles.incomeText : styles.expenseText,
        ]}
      >
        {item.amount}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{userName}!</Text>
        </View>
        <TouchableOpacity style={styles.avatarCircle} onPress={handleLogout}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>TOTAL SPENT THIS MONTH</Text>
          <Text style={styles.summaryAmount}>$120.00</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Sep 2026</Text>
          </View>
        </View>

        {/* API Integration Component Placement */}
        <CurrencyConverter />

        {/* Add Expense Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => Alert.alert('Add Expense', 'New expense screen link')}
        >
          <Text style={styles.addButtonText}>+ Add New Expense</Text>
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>Recent Transactions</Text>

        {/* Local Storage se loaded State Data Render ho raha hai */}
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={renderTransactionItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
    marginVertical: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '500',
  },
  addButton: {
    height: 48,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
  },
  transactionCategory: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '600',
  },
  expenseText: {
    color: '#0F172A',
  },
  incomeText: {
    color: '#16A34A',
  },
  bottomNav: {
    height: 64,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#0F172A',
    fontWeight: '700',
  },
});
