import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams } from 'expo-router';
import { StorageService } from '@/services/storage.service';
import { Booking } from '@/types/storage.types';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const ArrowRightIcon = ({ color = '#FFFFFF' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M5 12H19M19 12L12 5M19 12L12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function InvoiceSummaryScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (bookingId) {
        const bks = await StorageService.getBookings();
        const bk = bks.find(b => b.bookingId === bookingId || b.bookingId.replace('#', '') === bookingId);
        if (bk) setBooking(bk);
      }
    };
    loadData();
  }, [bookingId]);

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Invoice summary</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.idCard}>
            <Text style={styles.idLabel}>BOOKING ID</Text>
            <Text style={styles.idText}>{booking?.bookingId || '#BK123456'}</Text>
          </View>

          <View style={styles.mainCard}>
            
            <View style={styles.lineItem}>
              <Text style={styles.lineLabel}>Service Charges</Text>
              <Text style={styles.lineValue}>₹549</Text>
            </View>
            
            <View style={styles.lineItem}>
              <Text style={styles.lineLabel}>Material Charges</Text>
              <Text style={styles.lineValue}>₹750</Text>
            </View>

            <View style={styles.lineItem}>
              <Text style={styles.lineLabel}>Tax (18%)</Text>
              <Text style={styles.lineValue}>₹198</Text>
            </View>

            <View style={styles.lineItem}>
              <Text style={styles.lineLabel}>Platform fee</Text>
              <Text style={styles.lineValue}>₹198</Text>
            </View>

            <View style={styles.dashedDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹1,298</Text>
            </View>

          </View>

          <View style={styles.breakupCard}>
            <Text style={styles.breakupTitle}>Breakup</Text>

            <View style={styles.breakupItem}>
              <View style={styles.breakupLeft}>
                <View style={styles.dot} />
                <Text style={styles.breakupLabel}>Service</Text>
              </View>
              <Text style={styles.breakupValue}>₹350</Text>
            </View>

            <View style={styles.breakupItem}>
              <View style={styles.breakupLeft}>
                <View style={styles.dot} />
                <Text style={styles.breakupLabel}>Materials</Text>
              </View>
              <Text style={styles.breakupValue}>₹750</Text>
            </View>

            <View style={styles.breakupItem}>
              <View style={styles.breakupLeft}>
                <View style={styles.dot} />
                <Text style={styles.breakupLabel}>Tax (18%)</Text>
              </View>
              <Text style={styles.breakupValue}>₹198</Text>
            </View>

          </View>

          {/* Proceed Button */}
          <TouchableOpacity activeOpacity={1} 
            style={styles.proceedBtn} 
            onPress={() => router.push({
              pathname: '/(dashboard)/work-progress-photos',
              params: { bookingId }
            })}
          >
            <Text style={styles.proceedBtnText}>Proceed to Work Progress </Text>
            <ArrowRightIcon />
          </TouchableOpacity>

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

  scrollContent: { paddingHorizontal: 16, paddingBottom: 120 },

  idCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, marginBottom: 16 },
  idLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  idText: { fontSize: 18, fontWeight: '800', color: '#0F172A' },

  mainCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, marginBottom: 16 },
  lineItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  lineLabel: { fontSize: 12, color: '#475569' },
  lineValue: { fontSize: 13, fontWeight: '500', color: '#0F172A' },
  
  dashedDivider: { height: 1, backgroundColor: '#E2E8F0', borderStyle: 'dashed', marginVertical: 8, marginBottom: 24 },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  totalValue: { fontSize: 20, fontWeight: '800', color: 'rgba(26, 15, 163, 1.00)' },

  breakupCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, marginBottom: 24 },
  breakupTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 20 },
  
  breakupItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  breakupLeft: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#2DD4BF', marginRight: 8 },
  breakupLabel: { fontSize: 12, color: '#64748B' },
  breakupValue: { fontSize: 12, color: '#475569' },

  proceedBtn: { flexDirection: 'row', backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  proceedBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginRight: 8 },
});
