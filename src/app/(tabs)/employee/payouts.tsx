import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { useEmployeeStore } from '@/store/employeeStore';
import Svg, { Path, Circle } from 'react-native-svg';

const PRIMARY = 'rgba(26, 15, 163, 1.00)';

const UserIcon = ({ size = 32, color = '#1A0FA3' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function EmployeePayoutsScreen() {
  const router = useSafeRouter();
  const { employeeId } = useLocalSearchParams();
  const { employees, initialize, updateEmployee } = useEmployeeStore();

  const [history, setHistory] = useState([
    { amount: '₹5,000.00', date: '31 May 2024', status: 'Paid' },
    { amount: '₹4,500.00', date: '24 May 2024', status: 'Paid' },
    { amount: '₹4,750.00', date: '17 May 2024', status: 'Paid' },
  ]);

  useEffect(() => {
    initialize();
  }, []);

  const employee = employees.find(e => e.id === employeeId);

  // Fallback default details if employee is not loaded yet
  const name = employee?.name || 'Employee';
  const roleLabel = employee?.role || 'Professional';
  const serviceLabel = employee?.mainService || 'Services';
  
  const totalEarning = employee?.totalEarning || '₹0.00';
  const remainingEarning = employee?.remainingEarning || '₹0.00';

  const handleProcessPayout = async () => {
    if (!employee) return;

    const remainingVal = parseFloat(remainingEarning.replace(/[^0-9.]/g, ''));
    if (!remainingVal || remainingVal <= 0) {
      alert('No remaining payout to process.');
      return;
    }

    const currentRemaining = remainingEarning;

    // Deduct remaining, add to history
    await updateEmployee(employee.id, { remainingEarning: '₹0.00' });
    
    const newPayout = {
      amount: currentRemaining,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Paid'
    };
    
    setHistory(prev => [newPayout, ...prev]);
    alert(`Payout of ${currentRemaining} processed successfully!`);
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Employee Payouts</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          
          {/* Employee Info Box */}
          <View style={styles.employeeCard}>
            <View style={styles.avatarCircle}>
              <UserIcon size={28} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.employeeName}>{name}</Text>
              <Text style={styles.employeeDetail}>{roleLabel} • {serviceLabel}</Text>
            </View>
          </View>

          {/* Dual Stats Card (Total vs Remaining) */}
          <View style={styles.statsCard}>
            <View style={styles.statsCol}>
              <Text style={styles.statsLabel}>TOTAL EARNINGS</Text>
              <Text style={styles.statsValue}>{totalEarning}</Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsCol}>
              <Text style={[styles.statsLabel, { color: '#E11D48' }]}>REMAINING PAYOUT</Text>
              <Text style={[styles.statsValue, { color: '#E11D48' }]}>{remainingEarning}</Text>
            </View>
          </View>

          {/* Process Payout Button */}
          <Button 
            title="Process Payout" 
            onPress={handleProcessPayout} 
            variant="primary" 
            style={styles.processBtn} 
            disabled={!employee || parseFloat(remainingEarning.replace(/[^0-9.]/g, '')) <= 0}
          />

          {/* Payout History Section */}
          <Text style={styles.sectionTitle}>Recent Payouts</Text>

          <View style={styles.historyCard}>
            {history.map((item, idx) => (
              <View key={idx}>
                {idx > 0 && <View style={styles.historyDivider} />}
                <View style={styles.historyRow}>
                  <View>
                    <Text style={styles.historyAmount}>{item.amount}</Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.status}</Text>
                  </View>
                </View>
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
  safeArea: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 16 
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },

  content: { paddingHorizontal: 20, paddingBottom: 40 },

  employeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  employeeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  employeeDetail: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },

  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    elevation: 3,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      }
    }),
  },
  statsCol: {
    flex: 1,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A0FA3',
    marginTop: 6,
  },
  statsLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  statsDivider: {
    width: 1,
    height: 48,
    borderWidth: 0.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },

  processBtn: {
    marginBottom: 28,
  },

  sectionTitle: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: '#0F172A', 
    marginBottom: 14, 
    paddingHorizontal: 2 
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    elevation: 2,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  historyDivider: { height: 1, backgroundColor: '#F1F5F9' },
  historyAmount: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  historyDate: { fontSize: 12, color: '#64748B' },
  badge: { backgroundColor: '#DCFCE7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#166534' }
});
