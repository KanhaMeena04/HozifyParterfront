import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { BackArrowIcon } from '@/components/ui/Icons';

const BellIcon = ({ color = '#0F172A', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckCircleIcon = ({ color = '#22C55E', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M8 12l3 3 5-5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ReceiptIcon = ({ color = 'rgba(26, 15, 163, 1.00)', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill={color} />
  </Svg>
);

const DownloadIcon = ({ color = '#FFFFFF', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

import { useState, useEffect } from 'react';
import { StorageService } from '@/services/storage.service';

export default function ApprovedQuotationScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { requestId, bookingId } = useLocalSearchParams<{ requestId: string; bookingId: string }>();
  const [request, setRequest] = useState<any>(null);

  useEffect(() => {
    const loadRequest = async () => {
      const requests = await StorageService.getMaterialRequests();
      const req = requests.find(r => r.requestId === requestId);
      if (req) {
        setRequest(req);
      } else {
        // Fallback
        setRequest({
          requestId: requestId || 'RQ123456',
          grandTotal: 1540.00,
          subtotal: 1400.00,
          gstTotal: 140.00,
          items: [
            { id: '1', name: 'Copper Pipe', brand: 'Astral CPVC Pro', qty: '2 Units', price: 650, quotedPrice: 650 },
            { id: '2', name: 'Insulation Tape', brand: 'Premier 1700', qty: '5 Units', price: 20, quotedPrice: 20 }
          ]
        });
      }
    };
    loadRequest();
  }, [requestId]);

  const dateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleDispatch = () => {
    // Navigate directly to dispatch flow for simulation verification
    router.push({
      pathname: '/(dashboard)/seller/material-dispatch',
      params: { requestId, bookingId }
    });
  };

  if (!request) {
    return (
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#0F172A', fontWeight: '700' }}>Loading...</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.replace('/(dashboard)')} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hozify Partner</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity activeOpacity={1} style={styles.iconBtn}>
              <BellIcon />
            </TouchableOpacity>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Reference/Status Card */}
          <View style={styles.refStatusCard}>
            <View style={styles.refCol}>
              <Text style={styles.refLabel}>REFERENCE NUMBER</Text>
              <Text style={styles.refVal}>{request.requestId}</Text>
            </View>
            <View style={styles.statusCol}>
              <View style={styles.approvedBadge}>
                <CheckCircleIcon size={12} />
                <Text style={styles.approvedBadgeText}>Approved</Text>
              </View>
              <Text style={styles.approvedDateText}>Approved on: {request.approvedAt || dateStr}</Text>
            </View>
          </View>

          {/* Value Card */}
          <View style={styles.valueCard}>
            <View style={styles.valueIconCircle}>
              <ReceiptIcon color="#FFFFFF" />
            </View>
            <View style={styles.valueTextCol}>
              <Text style={styles.valueLabel}>Total Value</Text>
              <Text style={styles.valueSub}>Inclusive of all taxes</Text>
            </View>
            <Text style={styles.valuePrice}>₹{request.grandTotal?.toFixed(2)}</Text>
          </View>

          {/* Material Breakdown */}
          <Text style={styles.sectionHeading}>📦 Material Breakdown</Text>

          <View style={styles.breakdownCard}>
            
            {/* Header Row */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>ITEM DETAILS</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'center' }]}>QTY</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: 'right' }]}>UNIT COST</Text>
            </View>

            {/* Rows */}
            {request.items.map((item: any, idx: number) => {
              const unitPrice = item.quotedPrice || item.price || 0;
              return (
                <View key={item.id || idx} style={styles.tableBodyRow}>
                  <View style={[styles.tableItemCell, { flex: 2 }]}>
                    <Text style={styles.tableItemName}>{item.name}</Text>
                    <Text style={styles.tableItemSub}>{item.brand}</Text>
                  </View>
                  <Text style={[styles.tableBodyCell, { flex: 1, textAlign: 'center' }]}>{item.qty}</Text>
                  <Text style={[styles.tableBodyCell, { flex: 1.2, textAlign: 'right', fontWeight: '700' }]}>₹{unitPrice.toFixed(2)}</Text>
                </View>
              );
            })}

          </View>

          {/* Bill Summary */}
          <View style={styles.billSummaryCard}>
            <Text style={styles.summaryTitle}>Bill Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sub Total</Text>
              <Text style={styles.summaryValue}>₹{(request.subtotal || 0).toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST (18%)</Text>
              <Text style={styles.summaryValue}>₹{(request.gstTotal || 0).toFixed(2)}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.grandLabel}>Grand Total</Text>
              <Text style={styles.grandValue}>₹{(request.grandTotal || 0).toFixed(2)}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity activeOpacity={1} style={styles.outlinedBtn} onPress={() => alert('Viewing detailed quotation...')}>
              <Text style={styles.outlinedBtnText}>View Detailed Quotation</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={1} style={styles.solidBtn} onPress={handleDispatch}>
              <DownloadIcon />
              <Text style={styles.solidBtnText}>Proceed to Dispatch</Text>
            </TouchableOpacity>
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
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { padding: 4 },
  avatar: { width: 32, height: 32, borderRadius: 16 },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 16 },

  refStatusCard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  refCol: {},
  refLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  refVal: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  statusCol: { alignItems: 'flex-end' },
  approvedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  approvedBadgeText: { fontSize: 9, fontWeight: '700', color: '#15803D' },
  approvedDateText: { fontSize: 9, color: '#94A3B8', marginTop: 4 },

  valueCard: { 
    backgroundColor: '#1E1B4B', 
    borderRadius: 16, 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 24
  },
  valueIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  valueTextCol: { flex: 1 },
  valueLabel: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  valueSub: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  valuePrice: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },

  sectionHeading: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 12 },

  breakdownCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 24 },
  tableHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10, marginBottom: 10 },
  tableHeaderCell: { fontSize: 9, color: '#94A3B8', fontWeight: '700', letterSpacing: 0.5 },
  
  tableBodyRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F8FAFC', paddingBottom: 12, marginBottom: 12 },
  tableItemCell: {},
  tableItemName: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  tableItemSub: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  tableBodyCell: { fontSize: 12, color: '#475569', alignSelf: 'center' },

  billSummaryCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginBottom: 32 },
  summaryTitle: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  summaryLabel: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  summaryValue: { fontSize: 12, color: '#0F172A', fontWeight: '700' },
  summaryDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  grandLabel: { fontSize: 13, color: '#0F172A', fontWeight: '800' },
  grandValue: { fontSize: 15, color: 'rgba(26, 15, 163, 1.00)', fontWeight: '800' },

  actionRow: { gap: 12 },
  outlinedBtn: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(26, 15, 163, 1.00)', justifyContent: 'center', alignItems: 'center' },
  outlinedBtnText: { color: 'rgba(26, 15, 163, 1.00)', fontSize: 14, fontWeight: '700' },
  solidBtn: { height: 48, borderRadius: 12, backgroundColor: 'rgba(26, 15, 163, 1.00)', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  solidBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' }
});
