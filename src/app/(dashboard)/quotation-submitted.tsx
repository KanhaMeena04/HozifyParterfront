import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';

const BellIcon = ({ color = '#0F172A', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SuccessClipboardIcon = () => (
  <View style={styles.graphicWrapper}>
    <Svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <Circle cx="60" cy="60" r="50" fill="#E0F2FE" />
      <Rect x="40" y="35" width="40" height="50" rx="4" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
      <Path d="M48 45h24M48 55h24M48 65h16" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="60" cy="85" r="12" fill="#22C55E" />
      <Path d="M55 85l3 3 7-7" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  </View>
);

const DocumentTextIcon = ({ color = '#FFFFFF', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill={color} />
  </Svg>
);

export default function QuotationSubmittedScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { requestId, bookingId } = useLocalSearchParams<{ requestId: string; bookingId: string }>();

  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const handleViewQuotations = () => {
    router.push({
      pathname: '/(dashboard)/quotation-summary',
      params: { requestId, bookingId }
    });
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.replace('/(dashboard)')} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Submit for Admin Review</Text>
          <TouchableOpacity activeOpacity={1} style={styles.bellBtn}>
            <BellIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.centerCol}>
            <SuccessClipboardIcon />
            <Text style={styles.successTitle}>Quotation Submitted!!</Text>
            <Text style={styles.successDesc}>Your quotation has been submitted for admin review.</Text>
          </View>

          {/* Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Request ID</Text>
              <Text style={styles.detailValue}>{requestId || 'RQ123456'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Submitted On</Text>
              <Text style={styles.detailValueRight}>{dateStr}{'\n'}{timeStr}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>Pending Review</Text>
              </View>
            </View>
          </View>

          <Text style={styles.infoFooterText}>
            Seller submits the quotation and it goes to admin for review & approval. You will be notified once the review is complete.
          </Text>

          <TouchableOpacity activeOpacity={1} style={styles.viewQuotationsBtn} onPress={handleViewQuotations}>
            <DocumentTextIcon />
            <Text style={styles.viewQuotationsBtnText}>View My Quotations</Text>
          </TouchableOpacity>

        </View>

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
    paddingHorizontal: 16, 
    paddingTop: 16, 
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },
  bellBtn: { padding: 4 },

  content: { flex: 1, padding: 24, justifyContent: 'center' },
  
  centerCol: { alignItems: 'center', marginBottom: 32 },
  graphicWrapper: { marginBottom: 24 },
  successTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  successDesc: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 18 },

  detailsCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  detailLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  detailValue: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  detailValueRight: { fontSize: 13, fontWeight: '700', color: '#0F172A', textAlign: 'right', lineHeight: 18 },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEDD5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D97706', marginRight: 6 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#D97706' },

  infoFooterText: { fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 16, marginBottom: 32 },

  viewQuotationsBtn: { 
    backgroundColor: 'rgba(26, 15, 163, 1.00)', 
    height: 48, 
    borderRadius: 12, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 8,
    marginBottom: Platform.OS === 'ios' ? 12 : 24
  },
  viewQuotationsBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }
});
