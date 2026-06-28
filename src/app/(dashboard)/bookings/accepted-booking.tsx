import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon, LocationPinIcon } from '@/components/ui/Icons';
import { StorageService } from '@/services/storage.service';
import Svg, { Path } from 'react-native-svg';

const UserIcon = ({ size, color }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const LocationIcon = ({ size, color }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export default function AcceptedBookingScreen() {
  const router = useSafeRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      const loadBooking = async () => {
        if (bookingId) {
          const bks = await StorageService.getBookings();
          const bk = bks.find(b => b.bookingId === bookingId || b.bookingId.replace('#', '') === bookingId);
          if (bk) setBooking(bk);
        }
      };
      loadBooking();
    }, [bookingId])
  );

  const getBookingDisplayDetails = (b: any) => {
    const isAC = b.serviceName?.toLowerCase().includes('ac') || b.serviceId === 'SRV-001';
    const isPlumbing = b.serviceName?.toLowerCase().includes('plumb') || b.serviceId === 'SRV-002';
    const isCleaning = b.serviceName?.toLowerCase().includes('clean') || b.serviceId === 'SRV-003';
    
    let iconBg = '#EFF6FF';
    let icon = <Text style={{ fontSize: 22 }}>❄️</Text>;
    if (isPlumbing) { iconBg = '#F0FDF4'; icon = <Text style={{ fontSize: 22 }}>🔧</Text>; }
    if (isCleaning) { iconBg = '#FEF2F2'; icon = <Text style={{ fontSize: 22 }}>✨</Text>; }
    
    let dtStr = 'Today';
    let tmStr = '10:00 AM - 11:30 AM';
    if (b.scheduleDate) {
      const d = new Date(b.scheduleDate);
      if (!isNaN(d.getTime())) {
        dtStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }
    }
    if (b.scheduleTime) tmStr = b.scheduleTime;

    return {
      serviceName: b.serviceName || 'Service',
      customerName: b.customer?.name || b.customerName || 'Customer',
      location: b.customer?.address || b.location || 'Address not available',
      price: `₹${b.amount || 0}`,
      dateStr: dtStr,
      timeStr: tmStr,
      iconBg,
      serviceIcon: icon,
      paymentLabel: b.paymentStatus === 'paid' ? 'Paid' : '',
      paymentColor: b.paymentStatus === 'paid' ? '#059669' : 'transparent',
    };
  };

  const display = booking ? getBookingDisplayDetails(booking) : null;

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Accepted Booking</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {booking && display && (
            <View style={styles.bookingCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.serviceIconContainer, { backgroundColor: display.iconBg }]}>
                  {display.serviceIcon}
                </View>
                <View style={styles.serviceTextCol}>
                  <Text style={styles.serviceName}>{display.serviceName}</Text>
                  <Text style={styles.idText}>ID: {booking.bookingId}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <UserIcon size={16} color="#64748B" />
                <Text style={styles.infoText}>{display.customerName}</Text>
              </View>

              <View style={styles.infoRowAlignTop}>
                <LocationIcon size={16} color="#64748B" />
                <Text style={styles.addressText}>{display.location}</Text>
              </View>

              <View style={styles.bottomBanner}>
                <View>
                  <Text style={styles.bannerLabel}>Schedule</Text>
                  <Text style={styles.bannerValueDate}>{display.dateStr}</Text>
                  <Text style={styles.bannerValueTime}>{display.timeStr}</Text>
                </View>
                <View style={styles.alignRight}>
                  <Text style={styles.bannerLabel}>Payment</Text>
                  <Text style={styles.bannerValuePrice}>{display.price}</Text>
                  <Text style={[styles.paymentStatusText, { color: display.paymentColor }]}>
                    {display.paymentLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.cardActionsRow}>
                {!booking.employeeId ? (
                  <TouchableOpacity activeOpacity={1}
                    style={styles.cardAcceptBtn}
                    onPress={() => {
                      router.push({
                        pathname: '/(dashboard)/bookings/assign-booking',
                        params: { bookingId: booking.bookingId }
                      } as any);
                    }}
                  >
                    <Text style={styles.cardAcceptText}>Assign To</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity activeOpacity={1}
                    style={styles.cardAcceptBtn}
                    onPress={async () => {
                      const updated = { ...booking, status: 'on_the_way' as const };
                      await StorageService.saveBooking(updated);
                      router.push(`/(dashboard)/bookings/${booking.bookingId.replace('#', '')}` as any);
                    }}
                  >
                    <Text style={styles.cardAcceptText}>ON the way</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </ScrollView>
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
  
  bookingCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, borderWidth: 1, borderColor: '#F1F5F9' },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  serviceIconContainer: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  serviceTextCol: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  idText: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  infoRowAlignTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 8 },
  infoText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  addressText: { fontSize: 13, color: '#475569', flex: 1, lineHeight: 18 },
  bottomBanner: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, marginTop: 4 },
  bannerLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600', marginBottom: 4 },
  bannerValueDate: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  bannerValueTime: { fontSize: 12, color: '#64748B', marginTop: 2 },
  alignRight: { alignItems: 'flex-end' },
  bannerValuePrice: { fontSize: 16, fontWeight: '800', color: 'rgba(26, 15, 163, 1)' },
  paymentStatusText: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  cardActionsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cardAcceptBtn: { flex: 1, height: 44, borderRadius: 12, backgroundColor: 'rgba(26, 15, 163, 1)', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 6 },
  cardAcceptText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }
});
