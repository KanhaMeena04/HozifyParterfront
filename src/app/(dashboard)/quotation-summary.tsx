import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { BackArrowIcon } from '@/components/ui/Icons';

const BellIcon = ({ color = '#0F172A', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckCircleIcon = ({ color = '#22C55E', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M8 12l3 3 5-5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PaperplaneIcon = ({ color = '#FFFFFF', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function QuotationSummaryScreen() {
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
        // Mock fallback if none exists
        setRequest({
          requestId: requestId || 'RQ123456',
          bookingId: bookingId || '#BK123456',
          provider: 'hozify',
          status: 'pending_quote',
          items: [
            { id: '1', name: 'Copper Pipe (1/2 inch)', brand: 'Astral CPVC Pro', qty: '6 Feet', price: 650 },
            { id: '2', name: 'Insulation Tape', brand: 'Premier 1700', qty: '2 Roll', price: 20 },
          ],
          grandTotal: 177.00
        });
      }
    };
    loadRequest();
  }, [requestId]);

  const calculateTotals = () => {
    if (!request || !request.items) return { subtotal: 0, gstTotal: 0, grandTotal: 0 };
    let sub = 0;
    request.items.forEach((item: any) => {
      const qtyNum = parseInt(item.qty.replace(/[^0-9]/g, '')) || 1;
      const unitPrice = item.quotedPrice || item.price || 0;
      sub += unitPrice * qtyNum;
    });
    const gst = Math.round(sub * 0.18);
    const grand = sub + gst;
    return { subtotal: sub, gstTotal: gst, grandTotal: grand };
  };

  const { subtotal, gstTotal, grandTotal } = calculateTotals();

  const handleApprove = async () => {
    if (!request) return;
    
    // Simulate Admin / Customer Approval
    const updatedRequest = { 
      ...request, 
      status: 'approved', 
      approvedAt: new Date().toLocaleDateString('en-IN'),
      subtotal,
      gstTotal,
      grandTotal
    };
    await StorageService.saveMaterialRequest(updatedRequest);
    
    // Update booking in local storage to add the materials and cost
    const bks = await StorageService.getBookings();
    const activeBooking = bks.find(b => b.bookingId === request.bookingId || b.bookingId.replace('#', '') === request.bookingId.replace('#', ''));
    if (activeBooking) {
      // Modify booking status or append extra cost if needed
      // (For this mock flow, let's keep the booking status as checked_in so seller can dispatch, and update active booking)
      const updatedBooking = { ...activeBooking, paymentStatus: 'paid' as const }; // Auto set to paid to proceed
      await StorageService.saveBooking(updatedBooking);
    }

    router.push({
      pathname: '/(dashboard)/approved-quotation',
      params: { requestId: request.requestId, bookingId: request.bookingId }
    });
  };

  if (!request) return null;

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quotation Summary</Text>
          <TouchableOpacity activeOpacity={1} style={styles.bellBtn}>
            <BellIcon />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.reqIdRow}>
            <Text style={styles.reqIdLabel}>Request ID</Text>
            <Text style={styles.reqIdValue}>{request.requestId}</Text>
          </View>

          {/* Provider Card */}
          <View style={styles.providerCard}>
            <Text style={styles.providerLabel}>Material Provider</Text>
            <View style={styles.providerRow}>
              <Text style={styles.providerValue}>Hozify will Provide</Text>
              <CheckCircleIcon />
            </View>
          </View>

          <Text style={styles.sectionHeading}>Item Details</Text>

          {/* Line Items */}
          <View style={styles.itemContainer}>
            {request.items.map((item: any, idx: number) => {
              const qtyNum = parseInt(item.qty.replace(/[^0-9]/g, '')) || 1;
              const unitPrice = item.quotedPrice || item.price || 0;
              const itemTotalBeforeGst = unitPrice * qtyNum;
              const itemGst = Math.round(itemTotalBeforeGst * 0.18);
              const itemTotalWithGst = itemTotalBeforeGst + itemGst;
              const mrp = Math.round(unitPrice * 1.2);
              const hozifyPrice = Math.round(unitPrice * 0.9);

              return (
                <View key={item.id || idx} style={styles.itemRowCard}>
                  <View style={styles.itemHeader}>
                    <View style={styles.itemNumBadge}><Text style={styles.itemNumText}>{idx + 1}</Text></View>
                    <Text style={styles.itemName}>{item.name}</Text>
                  </View>
                  <View style={styles.itemMetaRow}>
                    <View>
                      <Text style={styles.metaLabel}>Quantity / Brand</Text>
                      <Text style={styles.metaValue}>{item.qty} • {item.brand}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.metaLabel}>Total Amount (₹)</Text>
                      <Text style={styles.metaValueBold}>{itemTotalWithGst.toFixed(2)}</Text>
                    </View>
                  </View>
                  <View style={styles.pricingBreakdown}>
                    <Text style={styles.breakdownText}>
                      MRP: ₹{mrp.toFixed(2)} | Selling: ₹{unitPrice.toFixed(2)} | Hozify: ₹{hozifyPrice.toFixed(2)}
                    </Text>
                    <Text style={styles.breakdownText}>
                      GST 18% (₹{itemGst.toFixed(2)})
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Totals Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sub Total (Before GST)</Text>
              <Text style={styles.summaryVal}>₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total GST Amount</Text>
              <Text style={styles.summaryVal}>₹{gstTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Grand Total (Incl. GST)</Text>
              <Text style={styles.totalVal}>₹{grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity activeOpacity={1} style={styles.submitBtn} onPress={handleApprove}>
            <Text style={styles.submitBtnText}>Submit for Review</Text>
            <PaperplaneIcon />
          </TouchableOpacity>

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

  scrollContent: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 16 },

  reqIdRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  reqIdLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  reqIdValue: { fontSize: 13, fontWeight: '800', color: '#0F172A' },

  providerCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  providerLabel: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  providerValue: { fontSize: 13, fontWeight: '700', color: '#15803D' },

  sectionHeading: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 12 },

  itemContainer: { gap: 12, marginBottom: 24 },
  itemRowCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  itemNumBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' },
  itemNumText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  itemName: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  
  itemMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  metaLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700', marginBottom: 2 },
  metaValue: { fontSize: 12, color: '#475569', fontWeight: '600' },
  metaValueBold: { fontSize: 13, color: 'rgba(26, 15, 163, 1.00)', fontWeight: '800' },
  
  pricingBreakdown: { backgroundColor: '#F8FAFC', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#F1F5F9', gap: 4 },
  breakdownText: { fontSize: 10, color: '#64748B', fontWeight: '500' },

  summaryCard: { backgroundColor: '#EFF6FF', borderRadius: 16, padding: 16, marginBottom: 32 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  summaryLabel: { fontSize: 12, color: 'rgba(26, 15, 163, 1.00)', fontWeight: '500' },
  summaryVal: { fontSize: 12, color: '#0F172A', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#DBEAFE', marginVertical: 8 },
  totalLabel: { fontSize: 13, color: '#1E40AF', fontWeight: '800' },
  totalVal: { fontSize: 14, color: '#1E40AF', fontWeight: '800' },

  submitBtn: { 
    backgroundColor: 'rgba(26, 15, 163, 1.00)', 
    height: 48, 
    borderRadius: 12, 
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 8,
    marginBottom: Platform.OS === 'ios' ? 12 : 24
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }
});
