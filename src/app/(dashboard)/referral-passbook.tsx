import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, CheckCircleIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const DUMMY_TRANSACTIONS = [
  { id: '1', title: 'Credit', type: 'cash', date: '8 May 26, 05:34 PM', amount: '₹34.00' },
  { id: '2', title: 'Credit', type: 'cash', date: '8 May 26, 05:34 PM', amount: '₹34.00' },
  { id: '3', title: 'Credit', type: 'cash', date: '8 May 26, 05:34 PM', amount: '₹34.00' },
  { id: '4', title: 'Credit', type: 'cash', date: '8 May 26, 05:34 PM', amount: '₹34.00' },
  { id: '5', title: 'Credit', type: 'cash', date: '8 May 26, 05:34 PM', amount: '₹34.00' },
  { id: '6', title: 'Credit', type: 'cash', date: '8 May 26, 05:34 PM', amount: '₹34.00' },
  { id: '7', title: 'Credit', type: 'cash', date: '8 May 26, 05:34 PM', amount: '₹34.00' },
  { id: '8', title: 'Credit', type: 'cash', date: '8 May 26, 05:34 PM', amount: '₹34.00' },
];

export default function ReferralPassbookScreen() {
  useAndroidBack(() => router.back());
  const router = useSafeRouter();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Referral Passbook</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.listContainer}>
            {DUMMY_TRANSACTIONS.map((txn, index) => (
              <View key={index} style={styles.txnCard}>
                <View style={styles.iconBox}>
                  <CheckCircleIcon size={24} color="#22C55E" />
                </View>
                <View style={styles.txnInfo}>
                  <Text style={styles.txnTitle}>{txn.title}</Text>
                  <Text style={styles.txnType}>{txn.type}</Text>
                  <Text style={styles.txnDate}>{txn.date}</Text>
                </View>
                <Text style={styles.txnAmount}>{txn.amount}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  listContainer: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 12 },
  txnCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 16, marginBottom: 8 },
  iconBox: { marginRight: 12, marginTop: 2 },
  txnInfo: { flex: 1 },
  txnTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  txnType: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  txnDate: { fontSize: 11, color: '#64748B' },
  txnAmount: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
});
