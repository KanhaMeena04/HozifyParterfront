import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams } from 'expo-router';
import { StorageService } from '@/services/storage.service';
import { Booking } from '@/types/storage.types';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { ReviewModal } from '@/components/common/ReviewModal';
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

const LocationPinIcon = ({ color = '#94A3B8' }) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.5" />
  </Svg>
);

const CalendarIcon = ({ color = '#94A3B8' }) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const NoteIcon = ({ color = '#94A3B8' }) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path d="M12 6V12L16 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default function JobCompletedScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [receiptVisible, setReceiptVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (bookingId) {
        const bks = await StorageService.getBookings();
        const bk = bks.find(b => b.bookingId === bookingId || b.bookingId.replace('#', '') === bookingId);
        if (bk) setBooking(bk);
      }
    };
    loadData();

    // Automatically pop up the review modal after a short delay to celebrate completion!
    const timer = setTimeout(() => {
      setReviewModalVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [bookingId]);

  let serviceName = 'AC Repair - Split AC Service';
  let cost = '₹599';
  let address = '23, Green Park, Indiranagar, Bangalore - 560038';
  let dateText = 'Tomorrow, 10:00 AM';
  let customerNote = 'Please check the gas level.';

  if (booking) {
    address = booking.location;
    dateText = booking.scheduledTime.replace('\n', ' ');
    if (booking.serviceId === 'S1' || booking.serviceId.toLowerCase().includes('ac') || booking.serviceId.toLowerCase().includes('repair')) {
      serviceName = 'AC Repair - Split AC Service';
    } else if (booking.serviceId === 'S2' || booking.serviceId.toLowerCase().includes('wash') || booking.serviceId.toLowerCase().includes('machine')) {
      serviceName = 'Washing Machine - Deep Cleaning & Service';
    } else if (booking.serviceId === 'S3' || booking.serviceId.toLowerCase().includes('ro') || booking.serviceId.toLowerCase().includes('install')) {
      serviceName = 'RO Installation & Filter Service';
    }

    if (booking.userId === 'U1') {
      cost = '₹599';
      customerNote = 'AC is making a strange clicking noise and cooling is weak.';
    } else if (booking.userId === 'U2') {
      cost = '₹649';
      customerNote = 'Washing machine makes loud noise on spin cycle.';
    } else if (booking.userId === 'U3') {
      cost = '₹799';
      customerNote = 'Water taste is metallic. Please replace filters.';
    } else if (booking.userId === 'U4') {
      cost = '₹549';
      customerNote = 'AC service and clean up.';
    } else if (booking.userId === 'U5') {
      cost = '₹599';
      customerNote = 'Regular washing machine cleaning.';
    }
  }

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
              <Text style={styles.successTitle}>Job Completed!</Text>
              <Text style={styles.successDesc}>Payment of <Text style={styles.boldAmount}>{cost}</Text> collected successfully.</Text>
            </View>

            {/* Receipt Details Card */}
            <View style={styles.detailsCard}>
              <View style={styles.detailItemRow}>
                <Text style={styles.detailLabel}>Service</Text>
                <Text style={styles.detailValueBold}>{serviceName}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailItemRowWithIcon}>
                <LocationPinIcon />
                <View style={styles.detailTextCol}>
                  <Text style={styles.detailLabelIcon}>Address</Text>
                  <Text style={styles.detailValue}>{address}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailItemRowWithIcon}>
                <CalendarIcon />
                <View style={styles.detailTextCol}>
                  <Text style={styles.detailLabelIcon}>Date & Time</Text>
                  <Text style={styles.detailValue}>{dateText}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailItemRowWithIcon}>
                <NoteIcon />
                <View style={styles.detailTextCol}>
                  <Text style={styles.detailLabelIcon}>Customer Note</Text>
                  <Text style={styles.detailValue}>{customerNote}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.chargesRow}>
                <Text style={styles.detailLabel}>Total Amount (Collected)</Text>
                <Text style={styles.chargesValue}>{cost}</Text>
              </View>
            </View>

            <View style={styles.thanksCard}>
              <Text style={styles.thanksText}>Thanks for your Booking</Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity activeOpacity={1} style={styles.secondaryBtn} onPress={() => setReviewModalVisible(true)}>
                <Text style={styles.secondaryBtnText}>Write a review</Text>
              </TouchableOpacity>
              
              <TouchableOpacity activeOpacity={1} style={styles.secondaryBtn} onPress={() => setReceiptVisible(true)}>
                <Text style={styles.secondaryBtnText}>View Receipt</Text>
              </TouchableOpacity>
              
              <TouchableOpacity activeOpacity={1} style={styles.primaryBtn} onPress={() => router.push('/(dashboard)')}>
                <Text style={styles.primaryBtnText}>Back to Home</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>

      </SafeAreaView>

      <ReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={(rating, review) => {
          console.log('Submitted review:', rating, review);
          setReviewModalVisible(false);
          router.replace('/(dashboard)');
        }}
      />

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

  scrollContent: { paddingHorizontal: 16, paddingBottom: 120, flexGrow: 1 },

  mainCard: { backgroundColor: '#FFFFFF', borderRadius: 32, padding: 24, paddingTop: 32 },

  centerContent: { alignItems: 'center', marginBottom: 24 },
  
  successIconWrapper: { position: 'relative', marginBottom: 24 },
  confetti: { position: 'absolute' },
  successCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#22C55E', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 10px 20px rgba(34, 197, 94, 0.3)', elevation: 10 },
  
  successTitle: { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  successDesc: { fontSize: 13, color: '#64748B' },
  boldAmount: { fontWeight: '700', color: '#0F172A' },

  detailsCard: { borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 24, paddingVertical: 16, marginBottom: 24 },
  
  detailItemRow: { paddingHorizontal: 20, marginBottom: 4 },
  detailLabel: { fontSize: 9, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 },
  detailValueBold: { fontSize: 12, fontWeight: '700', color: '#0F172A' },

  divider: { height: 1, backgroundColor: '#F8FAFC', marginVertical: 12 },

  detailItemRowWithIcon: { flexDirection: 'row', paddingHorizontal: 20, paddingRight: 40 },
  detailTextCol: { marginLeft: 12 },
  detailLabelIcon: { fontSize: 9, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginBottom: 4 },
  detailValue: { fontSize: 11, fontWeight: '600', color: '#0F172A', lineHeight: 18 },
  linkText: { fontSize: 11, fontWeight: '700', color: '#3B82F6', marginTop: 4 },

  chargesRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  chargesValue: { fontSize: 14, fontWeight: '800', color: '#0F172A' },

  thanksCard: { width: '100%', paddingVertical: 20, borderRadius: 24, borderWidth: 1, borderColor: '#F8FAFC', backgroundColor: '#FAFAF9', alignItems: 'center', marginBottom: 24 },
  thanksText: { fontSize: 12, color: '#64748B' },

  actionButtons: { gap: 12 },
  secondaryBtn: { width: '100%', paddingVertical: 18, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(26, 15, 163, 1.00)', alignItems: 'center' },
  secondaryBtnText: { color: '#0F172A', fontSize: 13, fontWeight: '700' },
  
  primaryBtn: { width: '100%', backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 18, borderRadius: 24, alignItems: 'center' },
  primaryBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
