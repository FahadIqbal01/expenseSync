import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DetailScreen = ({ route, navigation }) => {
  // Retrieve the transaction item passed via navigation route parameters
  const { item } = route.params || {
    item: {
      id: '1',
      title: 'Grocery Store',
      category: 'Food & Dining',
      amount: '-$45.00',
      date: 'Sep 24, 2026',
      notes: 'Weekly grocery run at Whole Foods',
      paymentMethod: 'Credit Card (**** 4242)',
    },
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this expense record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Logic to delete item from storage
            if (navigation) navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation && navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => Alert.alert('Edit', 'Edit expense feature')}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Hero Amount Display */}
        <View style={styles.heroCard}>
          <View style={styles.largeIconCircle}>
            <Text style={styles.largeIconText}>
              {item.title ? item.title.charAt(0) : 'E'}
            </Text>
          </View>
          <Text
            style={[
              styles.heroAmount,
              item.isIncome ? styles.incomeText : styles.expenseText,
            ]}
          >
            {item.amount}
          </Text>
          <Text style={styles.heroTitle}>{item.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
        </View>

        {/* Detailed Attribute Breakdown */}
        <View style={styles.detailsGroup}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {item.date || 'Sep 24, 2026'}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{item.category}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>
              {item.paymentMethod || 'Credit Card'}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Notes</Text>
            <Text style={styles.detailValue}>
              {item.notes || 'No extra notes provided.'}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete Transaction</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;

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
  editButton: {
    paddingVertical: 4,
  },
  editButtonText: {
    fontSize: 15,
    color: '#0066CC',
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  heroCard: {
    alignItems: 'center',
    marginBottom: 32,
  },
  largeIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  largeIconText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 4,
  },
  expenseText: {
    color: '#0F172A',
  },
  incomeText: {
    color: '#16A34A',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryBadgeText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  detailsGroup: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 32,
  },
  detailRow: {
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  deleteButton: {
    height: 48,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FCA5A5',
    borderWidth: 1,
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '600',
  },
});
