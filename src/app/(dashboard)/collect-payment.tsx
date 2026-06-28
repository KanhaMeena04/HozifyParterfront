import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const ReceiptIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M14 2V8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 18V12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 14H14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 16H14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CashIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M6 12H6.01M18 12H18.01" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const OnlineIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 10H22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckCircleIcon = ({ color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M8 12L11 15L16 9" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function CollectPaymentScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const [paymentMethod, setPaymentMethod] = useState<'online'>('online');

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collect Payment</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.mainCard}>
            
            {/* Top Section */}
            <View style={styles.topSection}>
              <View style={styles.iconCircle}>
                <ReceiptIcon />
              </View>
              <Text style={styles.pendingText}>Pending Payment</Text>
              <Text style={styles.amountText}>₹1,298</Text>
            </View>

            {/* Bottom Sheet Section */}
            <View style={styles.bottomSection}>
              <View style={styles.dragHandle} />
              
              <Text style={styles.questionText}>Payment Method</Text>

              {/* Online Option */}
              <TouchableOpacity activeOpacity={1} 
                style={[styles.optionCard, styles.optionCardSelected]} 
                onPress={() => setPaymentMethod('online')}
              >
                <View style={styles.optionLeft}>
                  <View style={styles.optionIconBox}>
                    <OnlineIcon color="rgba(26, 15, 163, 1.00)" />
                  </View>
                  <Text style={styles.optionText}>Online Payment Link</Text>
                </View>
                <CheckCircleIcon />
              </TouchableOpacity>

              {/* Action Button */}
              <TouchableOpacity activeOpacity={1} 
                style={styles.actionBtn} 
                onPress={() => router.push('/(dashboard)/customer-signature')}
              >
                <Text style={styles.actionBtnText}>
                  Generate Link
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>

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

  content: { flex: 1, paddingHorizontal: 16, paddingBottom: 24 },

  mainCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 32, overflow: 'hidden' },

  topSection: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  pendingText: { fontSize: 14, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)', marginBottom: 8 },
  amountText: { fontSize: 36, fontWeight: '800', color: '#0F172A' },

  bottomSection: { backgroundColor: '#FFFFFF', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32, boxShadow: '0px -10px 20px rgba(0, 0, 0, 0.05)', elevation: 10, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  dragHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0', alignSelf: 'center', marginBottom: 24 },
  questionText: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 24 },

  optionCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 16 },
  optionCardSelected: { backgroundColor: '#EEF2FF', borderColor: 'rgba(26, 15, 163, 1.00)' },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  optionIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  optionText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  
  uncheckCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1' },

  actionBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 18, borderRadius: 24, alignItems: 'center', marginTop: 8 },
  actionBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
