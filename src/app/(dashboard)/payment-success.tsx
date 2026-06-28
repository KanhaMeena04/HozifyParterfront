import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { ReceiptModal } from '@/components/common/ReceiptModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const SuccessCheckIcon = () => (
  <View style={styles.successIconWrapper}>
    {/* Decorative confetti */}
    <View style={[styles.confetti, { backgroundColor: '#A78BFA', top: 60, left: -20, width: 12, height: 12, borderRadius: 6 }]} />
    <View style={[styles.confetti, { backgroundColor: '#60A5FA', top: 10, left: 10, width: 8, height: 8, borderRadius: 4 }]} />
    <View style={[styles.confetti, { backgroundColor: '#34D399', top: 15, right: -10, width: 10, height: 10, borderRadius: 5 }]} />
    <View style={[styles.confetti, { backgroundColor: '#FBBF24', top: 70, right: 0, width: 6, height: 6, borderRadius: 3 }]} />
    
    <View style={styles.successCircle}>
      <Svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <Path d="M5 13L9 17L19 7" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  </View>
);

export default function PaymentSuccessScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const [receiptVisible, setReceiptVisible] = useState(false);

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collect Payment</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.mainCard}>
            
            <View style={styles.centerContent}>
              <SuccessCheckIcon />
              <Text style={styles.successTitle}>Payment Received</Text>
              <Text style={styles.successDesc}>Payment of <Text style={styles.boldAmount}>₹1,298</Text> collected successfully.</Text>
              
              <View style={styles.thanksCard}>
                <Text style={styles.thanksText}>Thanks for your service.</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity activeOpacity={1} style={styles.secondaryBtn} onPress={() => setReceiptVisible(true)}>
                <Text style={styles.secondaryBtnText}>View Receipt</Text>
              </TouchableOpacity>
              
              <TouchableOpacity activeOpacity={1} style={styles.secondaryBtn} onPress={() => router.push('/(dashboard)/job-completed')}>
                <Text style={styles.secondaryBtnText}>Booking Complete</Text>
              </TouchableOpacity>
              
              <TouchableOpacity activeOpacity={1} style={styles.primaryBtn} onPress={() => router.push('/(dashboard)')}>
                <Text style={styles.primaryBtnText}>Back to Home</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>

      </SafeAreaView>

      <ReceiptModal 
        visible={receiptVisible}
        onClose={() => setReceiptVisible(false)}
      />

    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 24, flexGrow: 1, justifyContent: 'center' },

  mainCard: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 24, paddingTop: 48 },

  centerContent: { alignItems: 'center', marginBottom: 40 },
  
  successIconWrapper: { position: 'relative', marginBottom: 24 },
  confetti: { position: 'absolute' },
  successCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 10px 20px rgba(34, 197, 94, 0.3)', elevation: 10 },
  
  successTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  successDesc: { fontSize: 13, color: '#64748B', marginBottom: 32 },
  boldAmount: { fontWeight: '700', color: '#0F172A' },

  thanksCard: { width: '100%', paddingVertical: 20, borderRadius: 24, borderWidth: 1, borderColor: '#F8FAFC', backgroundColor: '#FAFAF9', alignItems: 'center' },
  thanksText: { fontSize: 12, color: '#64748B' },

  actionButtons: { gap: 12 },
  secondaryBtn: { width: '100%', paddingVertical: 18, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(26, 15, 163, 1.00)', alignItems: 'center' },
  secondaryBtnText: { color: '#0F172A', fontSize: 13, fontWeight: '700' },
  
  primaryBtn: { width: '100%', backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 18, borderRadius: 24, alignItems: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
