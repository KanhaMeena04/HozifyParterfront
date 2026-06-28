import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Modal, KeyboardAvoidingView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, WalletTabIcon, ChartIcon, GiftIcon, TruckIcon, OutlineStarIcon, BankIcon, RightArrowIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CloseIcon, SecurityIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';

export default function WalletScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const [showAddBank, setShowAddBank] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('5,000');

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Wallet</Text>
            <Text style={styles.headerSubtitle}>Personal wallet</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Partner Wallet Card */}
          <View style={styles.walletCard}>
            <View style={styles.walletHeaderRow}>
              <View style={styles.walletIconBox}>
                <WalletTabIcon size={24} color="rgba(26, 15, 163, 1.00)" />
              </View>
              <Text style={styles.walletTitle}>Partner Wallet</Text>
              <View style={styles.spacer} />
              <Text style={styles.walletAmount}>Rs. 100</Text>
              <RightArrowIcon size={16} color="#0F172A" />
            </View>
            <Button 
              title="Withdraw" 
              onPress={() => router.push('/(dashboard)/wallet/withdrawal')} 
              variant="primary" 
              style={styles.withdrawBtn}
            />
          </View>

          {/* Yours Performance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yours Performance</Text>
            <View style={styles.grid}>
              <View style={styles.gridCard}>
                <View style={styles.iconCircle}>
                  <ChartIcon size={16} color="#64748B" />
                </View>
                <Text style={styles.gridLabel}>Total Earnings</Text>
                <Text style={styles.gridValue}>₹124.50</Text>
              </View>

              <View style={styles.gridCard}>
                <View style={styles.iconCircle}>
                  <GiftIcon size={16} color="#64748B" />
                </View>
                <Text style={styles.gridLabel}>Available Balance</Text>
                <Text style={styles.gridValue}>₹9.50</Text>
              </View>

              <View style={styles.gridCard}>
                <View style={styles.iconCircle}>
                  <TruckIcon size={16} color="#64748B" />
                </View>
                <Text style={styles.gridLabel}>Bookings (12)</Text>
                <Text style={styles.gridValue}>₹95.00</Text>
              </View>

              <View style={styles.gridCard}>
                <View style={styles.iconCircle}>
                  <OutlineStarIcon size={16} color="#64748B" />
                </View>
                <Text style={styles.gridLabel}>Incentives</Text>
                <Text style={styles.gridValue}>₹20.00</Text>
              </View>
            </View>
          </View>

          {/* Add Bank Account */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Bank Account</Text>
            <TouchableOpacity activeOpacity={1} style={styles.actionCard} onPress={() => router.push('/(dashboard)/wallet/bank-accounts')}>
              <View style={styles.actionIconBox}>
                <BankIcon size={20} color="rgba(26, 15, 163, 1.00)" />
              </View>
              <Text style={styles.actionText}>Add New Bank Account</Text>
            </TouchableOpacity>
          </View>

          {/* Passbook */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Passbook</Text>
            <TouchableOpacity activeOpacity={1} style={styles.actionCard} onPress={() => router.push('/(dashboard)/passbook')}>
              <View style={styles.actionIconBox}>
                <BankIcon size={20} color="rgba(26, 15, 163, 1.00)" />
              </View>
              <Text style={styles.actionText}>Show Passbook</Text>
            </TouchableOpacity>
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
  headerSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  walletCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)', elevation: 2 },
  walletHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  walletIconBox: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  walletTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  spacer: { flex: 1 },
  walletAmount: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginRight: 8 },
  withdrawBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 14 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 12, paddingLeft: 4 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)', elevation: 2 },
  iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  gridLabel: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  gridValue: { fontSize: 16, fontWeight: '700', color: '#0F172A' },

  actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)', elevation: 2 },
  actionIconBox: { marginRight: 12 },
  actionText: { fontSize: 13, fontWeight: '600', color: '#0F172A' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  modalScroll: { paddingBottom: 20 },
  modalFooter: { paddingTop: 20 },

  modalBody: { paddingBottom: 20 },
  modalSectionTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  bankSelectCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 16, padding: 16, marginBottom: 24 },
  bankSelectIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  bankSelectInfo: { flex: 1 },
  bankSelectName: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  bankSelectDesc: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  bankSelectSub: { fontSize: 10, color: 'rgba(26, 15, 163, 1.00)', fontWeight: '500' },
  radioChecked: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(26, 15, 163, 1.00)', justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(26, 15, 163, 1.00)' },

  amountInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, height: 56, marginBottom: 16 },
  currencySymbol: { fontSize: 20, color: '#64748B', marginRight: 8 },
  amountInput: { flex: 1, fontSize: 24, fontWeight: '700', color: '#0F172A' },

  noteInputContainer: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, height: 48, justifyContent: 'center', marginBottom: 24 },
  noteInput: { fontSize: 13, color: '#0F172A' },

  secureBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F3FF', padding: 12, borderRadius: 12 },
  secureText: { marginLeft: 8, fontSize: 11, color: 'rgba(26, 15, 163, 1.00)', flex: 1, fontWeight: '500' },
});
