import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { StorageService } from '@/services/storage.service';

const LocationPinIcon = ({ color = 'rgba(26, 15, 163, 1.00)', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

const CheckCircleFilledIcon = ({ color = 'rgba(26, 15, 163, 1.00)', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M8 12l3 3 5-5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CompassIcon = ({ color = 'rgba(26, 15, 163, 1.00)', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DocumentIcon = ({ color = '#FFFFFF', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill={color} />
  </Svg>
);

export default function QuotationDetailsScreen() {
  const router = useSafeRouter();
  const { requestId } = useLocalSearchParams<{ requestId: string }>();
  const [request, setRequest] = useState<any>(null);

  useEffect(() => {
    const loadRequest = async () => {
      const stored = await StorageService.getMaterialRequests();
      const match = stored.find(r => r.requestId === requestId);
      if (match) {
        setRequest(match);
      } else {
        // Fallback matching design requirements
        setRequest({
          requestId: requestId || 'RQ123456',
          bookingId: 'BK123456',
          title: 'AC Repair',
          status: 'pending_quote',
          submittedAt: 'Oct 24, 2023 • 10:30 AM',
          customerName: 'Amit Kumar',
          location: 'House No. 45, Green Valley Apartments, Sector 12, Gurugram, Haryana - 122001',
          items: [
            { id: '1', name: 'Copper Pipe', brand: 'Luvata', qty: '10 Ft', price: 65, note: 'e.g. 5/8 inch diameter, heavy duty' },
            { id: '2', name: 'Insulation Tape', brand: '3M', qty: '2 Rolls', price: 20, note: '' }
          ]
        });
      }
    };
    loadRequest();
  }, [requestId]);

  if (!request) return null;

  const handleAction = () => {
    if (request.status === 'pending_quote') {
      router.push({
        pathname: '/(dashboard)/seller/submit-quotation',
        params: { requestId: request.requestId }
      });
    } else if (request.status === 'approved') {
      router.push({
        pathname: '/(dashboard)/seller/material-dispatch',
        params: { requestId: request.requestId, bookingId: request.bookingId }
      });
    }
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>View Request Details</Text>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Request Info Card */}
          <Card style={styles.card}>
            <View style={styles.requestHeaderRow}>
              <View>
                <Text style={styles.labelSub}>REQUEST ID</Text>
                <Text style={styles.requestIdBold}>{request.requestId}</Text>
              </View>
              <View style={styles.activeRequestBadge}>
                <View style={styles.greenDot} />
                <Text style={styles.activeRequestBadgeText}>Active Request</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsGrid}>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>Service</Text>
                <View style={styles.serviceRow}>
                  <Text style={{ fontSize: 13, marginRight: 4 }}>❄️</Text>
                  <Text style={styles.gridCellValBold}>{request.title || 'AC Repair'}</Text>
                </View>
              </View>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>Booking ID</Text>
                <Text style={styles.gridCellVal}>{request.bookingId}</Text>
              </View>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>Customer</Text>
                <Text style={styles.gridCellVal}>{request.customerName || 'Amit Kumar'}</Text>
              </View>
              <View style={styles.gridCell}>
                <Text style={styles.gridCellLabel}>Requested On</Text>
                <Text style={styles.gridCellVal}>{request.submittedAt}</Text>
              </View>
            </View>
          </Card>

          {/* Service Address Card */}
          <Card style={styles.card}>
            <View style={styles.sectionTitleRow}>
              <LocationPinIcon />
              <Text style={styles.sectionTitleText}>Service Address</Text>
            </View>
            <Text style={styles.addressText}>{request.location}</Text>
            <TouchableOpacity activeOpacity={1} style={styles.getDirectionsBtn}>
              <CompassIcon color="rgba(26, 15, 163, 1.00)" />
              <Text style={styles.getDirectionsBtnText}>Get Directions</Text>
            </TouchableOpacity>
          </Card>

          {/* Material Provider Selector Card */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitleTextOnly}>Material Provider</Text>
            
            <View style={styles.providerOptionsRow}>
              <View style={[styles.providerOptionCard, styles.providerOptionCardSelected]}>
                <CheckCircleFilledIcon />
                <Text style={styles.providerOptionTextSelected}>Hozify will Provide</Text>
              </View>
              <View style={[styles.providerOptionCard, styles.providerOptionCardUnselected]}>
                <View style={styles.uncheckCircle} />
                <Text style={styles.providerOptionTextUnselected}>Partner will Provide</Text>
              </View>
            </View>
          </Card>

          {/* Material Requirements Section */}
          <Text style={styles.materialHeading}>Material Requirements</Text>

          {request.items.map((item: any, idx: number) => (
            <Card key={item.id || idx} style={styles.materialCard}>
              <View style={styles.materialCardHeader}>
                <Text style={styles.materialIndexLabel}>Material #{idx + 1}</Text>
                <View style={styles.accessoryBadge}>
                  <Text style={styles.accessoryBadgeText}>{idx === 0 ? 'Standard Item' : 'Accessory'}</Text>
                </View>
              </View>

              <Text style={styles.inputLabel}>Material Name</Text>
              <View style={styles.disabledInput}>
                <Text style={styles.disabledInputText}>{item.name}</Text>
              </View>

              <View style={styles.flexRow}>
                <View style={{ flex: 1.5, marginRight: 12 }}>
                  <Text style={styles.inputLabel}>Brand Preference</Text>
                  <View style={styles.disabledInput}>
                    <Text style={styles.disabledInputText}>{item.brand}</Text>
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Quantity</Text>
                  <View style={styles.qtyInputRow}>
                    <Text style={styles.qtyInputVal}>{item.qty?.split(' ')[0] || item.qty}</Text>
                    <View style={styles.unitBadge}>
                      <Text style={styles.unitBadgeText}>{item.qty?.split(' ')[1] || 'Ft'}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {item.note ? (
                <>
                  <Text style={styles.inputLabel}>Model / Specification</Text>
                  <View style={styles.disabledInput}>
                    <Text style={styles.disabledInputText}>{item.note}</Text>
                  </View>
                </>
              ) : null}
            </Card>
          ))}

          {/* Map Section */}
          <View style={styles.mapCard}>
            <View style={styles.mapPlaceholder}>
              <LocationPinIcon color="#1A0FA3" size={32} />
              <Text style={styles.mapPlaceholderText}>{request.location?.split(',').slice(-2).join(',').trim() || 'Gurugram, Haryana'}</Text>
            </View>
            <View style={styles.mapLabelContainer}>
              <Text style={styles.mapLabelText}>GURUGRAM SECTOR 12</Text>
            </View>
          </View>

        </ScrollView>

        {/* Dynamic Action Button in Sticky Footer */}
        <View style={styles.footer}>
          {request.status === 'pending_quote' && (
            <TouchableOpacity activeOpacity={1} style={styles.actionBtn} onPress={handleAction}>
              <DocumentIcon />
              <Text style={styles.actionBtnText}>Create Quotation</Text>
            </TouchableOpacity>
          )}

          {request.status === 'quoted' && (
            <View style={styles.statusBannerQuoted}>
              <Text style={styles.statusBannerQuotedText}>Quotation Sent • Awaiting review & approval</Text>
            </View>
          )}

          {request.status === 'approved' && (
            <TouchableOpacity activeOpacity={1} style={[styles.actionBtn, { backgroundColor: '#10B981' }]} onPress={handleAction}>
              <Text style={styles.actionBtnText}>Accept Order & Proceed to Dispatch</Text>
            </TouchableOpacity>
          )}

          {request.status === 'completed' && (
            <View style={styles.statusBannerCompleted}>
              <Text style={styles.statusBannerCompletedText}>✓ Material Handover Completed</Text>
            </View>
          )}
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
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1 },
  avatar: { width: 32, height: 32, borderRadius: 16 },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 16, gap: 16 },

  card: { padding: 16, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  requestHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelSub: { fontSize: 9, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5 },
  requestIdBold: { fontSize: 16, fontWeight: '800', color: '#1E1B4B', marginTop: 4 },
  
  activeRequestBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 },
  activeRequestBadgeText: { fontSize: 9, fontWeight: '700', color: '#10B981' },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  
  detailsGrid: { flexDirection: 'row', marginBottom: 12 },
  gridCell: { flex: 1 },
  gridCellLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  gridCellVal: { fontSize: 12, color: '#334155', fontWeight: '600', marginTop: 4 },
  gridCellValBold: { fontSize: 12, color: '#0F172A', fontWeight: '700', marginTop: 4 },
  serviceRow: { flexDirection: 'row', alignItems: 'center' },

  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  sectionTitleText: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  sectionTitleTextOnly: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  addressText: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 12 },
  getDirectionsBtn: { height: 36, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  getDirectionsBtnText: { color: 'rgba(26, 15, 163, 1.00)', fontSize: 11, fontWeight: '700' },

  providerOptionsRow: { flexDirection: 'row', gap: 12 },
  providerOptionCard: { flex: 1, height: 44, borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 8, borderWidth: 1 },
  providerOptionCardSelected: { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' },
  providerOptionCardUnselected: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
  providerOptionTextSelected: { fontSize: 11, fontWeight: '700', color: '#2563EB' },
  providerOptionTextUnselected: { fontSize: 11, fontWeight: '600', color: '#64748B' },
  uncheckCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#CBD5E1' },

  materialHeading: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginTop: 8 },
  materialCard: { padding: 16, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', gap: 8 },
  materialCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  materialIndexLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },
  accessoryBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  accessoryBadgeText: { fontSize: 9, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },

  inputLabel: { fontSize: 10, fontWeight: '700', color: '#64748B', marginTop: 4 },
  disabledInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 38, justifyContent: 'center' },
  disabledInputText: { fontSize: 12, color: '#334155' },
  flexRow: { flexDirection: 'row' },
  qtyInputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, height: 38, overflow: 'hidden' },
  qtyInputVal: { flex: 1, paddingHorizontal: 12, fontSize: 12, color: '#334155' },
  unitBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, height: '100%', justifyContent: 'center', alignItems: 'center' },
  unitBadgeText: { fontSize: 10, fontWeight: '700', color: '#1E40AF' },

  mapCard: { height: 140, borderRadius: 20, overflow: 'hidden', marginBottom: 12 },
  mapPlaceholder: { flex: 1, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', gap: 8 },
  mapPlaceholderText: { fontSize: 11, fontWeight: '600', color: 'rgba(26, 15, 163, 1.00)', textAlign: 'center', paddingHorizontal: 16 },
  mapImage: { width: '100%', height: '100%' },
  mapLabelContainer: { position: 'absolute', bottom: 12, right: 12, backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: '#E2E8F0' },
  mapLabelText: { fontSize: 9, fontWeight: '800', color: '#475569' },

  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: '#FFFFFF', 
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12
  },
  actionBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', height: 48, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, shadowColor: '#1A0FA3', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  actionBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  statusBannerQuoted: { backgroundColor: '#EFF6FF', height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DBEAFE' },
  statusBannerQuotedText: { color: '#1D4ED8', fontSize: 12, fontWeight: '700' },
  statusBannerCompleted: { backgroundColor: '#ECFDF5', height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#D1FAE5' },
  statusBannerCompletedText: { color: '#065F46', fontSize: 12, fontWeight: '700' }
});
