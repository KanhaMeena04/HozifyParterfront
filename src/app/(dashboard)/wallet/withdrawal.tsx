import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon, SecurityIcon } from '@/components/ui/Icons';

export default function WithdrawalScreen() {
  const router = useSafeRouter();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Withdrawal request submitted successfully.');
      router.back();
    }, 1500);
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Withdraw Funds</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.card}>
            <View style={styles.balanceBox}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>₹12,450.00</Text>
            </View>

            <View style={styles.divider} />

            <Input
              label="Enter Amount (₹)"
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <View style={styles.alertBox}>
              <SecurityIcon size={16} color="#3B82F6" />
              <Text style={styles.alertText}>Withdrawals are processed every Tuesday and Friday. Minimum withdrawal amount is ₹500.</Text>
            </View>

            <Button 
              title="Submit Request" 
              onPress={handleWithdraw} 
              isLoading={isLoading}
              disabled={!amount || Number(amount) < 500}
              variant="primary" 
              style={styles.btn} 
            />
          </Card>
        </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  content: { padding: 20 },
  card: { padding: 20, backgroundColor: '#FFFFFF', borderRadius: 24 },
  balanceBox: { alignItems: 'center', marginBottom: 16 },
  balanceLabel: { fontSize: 13, color: '#64748B', marginBottom: 4 },
  balanceAmount: { fontSize: 32, fontWeight: '800', color: 'rgba(26, 15, 163, 1.00)' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginBottom: 16 },
  alertBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#EFF6FF', padding: 12, borderRadius: 12, marginBottom: 24, marginTop: 8 },
  alertText: { flex: 1, fontSize: 12, color: '#1E40AF', lineHeight: 18 },
  btn: {}
});
