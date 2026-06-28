import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, TruckIcon, GiftIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const MinusCircleIcon = ({ size = 20, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <Path d="M8 12H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const ArrowUpRightIcon = ({ size = 20, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M7 17L17 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 7H17V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BANK_TRANSACTIONS = [
  { id: '1', type: 'Debit', method: 'cash', date: '8 May 26, 05:34 PM', amount: '- ₹34.00' },
  { id: '2', type: 'Debit', method: 'cash', date: '8 May 26, 12:02 PM', amount: '- ₹37.00' },
  { id: '3', type: 'Debit', method: 'cash', date: '8 May 26, 09:20 AM', amount: '- ₹37.00' },
  { id: '4', type: 'Debit', method: 'cash', date: '30 Apr 26, 12:48 PM', amount: '- ₹69.00' },
  { id: '5', type: 'Debit', method: 'cash', date: '30 Apr 26, 05:49 AM', amount: '- ₹174.00' },
  { id: '6', type: 'Debit', method: 'cash', date: '29 Apr 26, 03:27 PM', amount: '- ₹65.00' },
  { id: '7', type: 'Debit', method: 'cash', date: '27 Apr 26, 06:41 PM', amount: '- ₹111.00' },
];

const BOOKING_TRANSACTIONS = [
  { id: '1', title: 'Trip to Downtown', subtitle: 'ID: BKG-8492', amount: '+₹24.50', time: '10:42 AM', type: 'trip' },
  { id: '2', title: 'Referral Bonus', subtitle: 'Referred John D.', amount: '+₹10.00', time: '09:15 AM', type: 'referral' },
  { id: '3', title: 'Bank Withdrawal', subtitle: 'To Chase ****4211', amount: '-₹150.00', time: 'Yesterday', type: 'withdrawal' },
  { id: '4', title: 'Trip to Airport', subtitle: 'ID: BKG-8488', amount: '+₹45.00', time: 'Yesterday', type: 'trip' },
];

export default function PassbookScreen() {
  useAndroidBack(() => router.back());
  const router = useSafeRouter();
  const [activeTab, setActiveTab] = useState<'bank' | 'booking'>('bank');

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Passbook</Text>
        </View>

        <View style={styles.tabContainer}>
          <View style={styles.tabToggle}>
            <TouchableOpacity activeOpacity={1}
              style={[styles.tabButton, activeTab === 'bank' && styles.tabButtonActive]}
              onPress={() => setActiveTab('bank')}
            >
              <Text style={[styles.tabText, activeTab === 'bank' && styles.tabTextActive]}>Bank</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1}
              style={[styles.tabButton, activeTab === 'booking' && styles.tabButtonActive]}
              onPress={() => setActiveTab('booking')}
            >
              <Text style={[styles.tabText, activeTab === 'booking' && styles.tabTextActive]}>Booking</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            {activeTab === 'bank' ? (
              <View>
                {BANK_TRANSACTIONS.map((tx, index) => (
                  <View key={tx.id} style={[styles.txRow, index === BANK_TRANSACTIONS.length - 1 && styles.txRowLast]}>
                    <View style={styles.bankTxIcon}>
                      <MinusCircleIcon size={20} color="#DC2626" />
                    </View>
                    <View style={styles.bankTxInfo}>
                      <Text style={styles.bankTxTitle}>{tx.type}</Text>
                      <Text style={styles.bankTxMethod}>{tx.method}</Text>
                      <Text style={styles.bankTxDate}>{tx.date}</Text>
                    </View>
                    <Text style={styles.bankTxAmount}>{tx.amount}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View>
                <View style={styles.recentHeader}>
                  <Text style={styles.recentTitle}>RECENT TRANSACTIONS</Text>
                  <TouchableOpacity activeOpacity={1}>
                    <Text style={styles.viewAllText}>View All</Text>
                  </TouchableOpacity>
                </View>

                {BOOKING_TRANSACTIONS.map((tx, index) => (
                  <View key={tx.id} style={[styles.bookingTxRow, index === BOOKING_TRANSACTIONS.length - 1 && styles.txRowLast]}>
                    <View style={styles.bookingTxIconBox}>
                      {tx.type === 'trip' && <TruckIcon size={16} color="#0F172A" />}
                      {tx.type === 'referral' && <GiftIcon size={16} color="#0F172A" />}
                      {tx.type === 'withdrawal' && <ArrowUpRightIcon size={16} color="#0F172A" />}
                    </View>
                    <View style={styles.bookingTxInfo}>
                      <Text style={styles.bookingTxTitle}>{tx.title}</Text>
                      <Text style={styles.bookingTxSubtitle}>{tx.subtitle}</Text>
                    </View>
                    <View style={styles.bookingTxRight}>
                      <Text style={[styles.bookingTxAmount, tx.amount.startsWith('-') ? styles.amountNegative : styles.amountPositive]}>
                        {tx.amount}
                      </Text>
                      <Text style={styles.bookingTxTime}>{tx.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  
  tabContainer: { paddingHorizontal: 20, marginBottom: 16 },
  tabToggle: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 4, width: 180, alignSelf: 'flex-start' },
  tabButton: { flex: 1, paddingVertical: 6, borderRadius: 16, alignItems: 'center' },
  tabButtonActive: { backgroundColor: 'rgba(26, 15, 163, 1.00)' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#FFFFFF' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20 },

  // Bank Tab Styles
  txRow: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  txRowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  bankTxIcon: { marginRight: 12, marginTop: 2 },
  bankTxInfo: { flex: 1 },
  bankTxTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
  bankTxMethod: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  bankTxDate: { fontSize: 11, color: '#94A3B8' },
  bankTxAmount: { fontSize: 14, fontWeight: '600', color: '#0F172A' },

  // Booking Tab Styles
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  recentTitle: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1 },
  viewAllText: { fontSize: 12, fontWeight: '600', color: '#3B82F6' },
  
  bookingTxRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  bookingTxIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  bookingTxInfo: { flex: 1 },
  bookingTxTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 4 },
  bookingTxSubtitle: { fontSize: 12, color: '#64748B' },
  bookingTxRight: { alignItems: 'flex-end' },
  bookingTxAmount: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  amountPositive: { color: '#10B981' },
  amountNegative: { color: '#0F172A' },
  bookingTxTime: { fontSize: 11, color: '#94A3B8' },
});
