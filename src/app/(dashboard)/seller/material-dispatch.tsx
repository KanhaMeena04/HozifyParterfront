import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { StorageService } from '@/services/storage.service';

type DispatchStep = 'accept_order' | 'accepted_success' | 'ready_for_pickup' | 'handover';

const CheckmarkBigIcon = ({ size = 80, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Circle cx="50" cy="50" r="45" fill="#DCFCE7" />
    <Circle cx="50" cy="50" r="35" fill={color} />
    <Path d="M40 50l7 7 14-14" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const NotificationBellIcon = ({ color = '#0F172A', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckboxIcon = ({ size = 20, color = '#22C55E' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M8 12l3 3 5-5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PaperplaneWhiteIcon = ({ color = '#FFFFFF', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function MaterialDispatchScreen() {
  const router = useSafeRouter();
  const { requestId, bookingId } = useLocalSearchParams<{ requestId: string; bookingId: string }>();
  const [step, setStep] = useState<DispatchStep>('accept_order');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [request, setRequest] = useState<any>(null);

  useEffect(() => {
    const loadRequest = async () => {
      if (requestId) {
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
            status: 'approved',
            submittedAt: 'Oct 24, 2023 • 10:30 AM',
            customerName: 'Amit Kumar',
            location: 'House No. 45, Green Valley Apartments, Sector 12, Gurugram, Haryana - 122001',
            items: [
              { id: '1', name: 'Copper Pipe', brand: 'Luvata', qty: '10 Ft', price: 65, note: 'e.g. 5/8 inch diameter, heavy duty' },
              { id: '2', name: 'Insulation Tape', brand: '3M', qty: '2 Rolls', price: 20, note: '' }
            ],
            grandTotal: 1894.44
          });
        }
      }
    };
    loadRequest();
  }, [requestId]);

  const handleAcceptOrder = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('accepted_success');
    }, 1200);
  };

  const handleNotifyProvider = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('handover');
    }, 1200);
  };

  const handleVerifyHandover = async () => {
    if (otp === '1234') {
      setIsLoading(true);
      setTimeout(async () => {
        setIsLoading(false);
        alert('Material Handover Successful!');
        
        const stored = await StorageService.getMaterialRequests();
        const match = stored.find(r => r.requestId === (requestId || request?.requestId));
        if (match) {
          match.status = 'completed';
          await StorageService.saveMaterialRequest(match);
        }

        router.replace({
          pathname: '/(dashboard)/bookings/[id]',
          params: { id: bookingId || request?.bookingId || 'BK123456' }
        });
      }, 1000);
    } else {
      alert('Invalid OTP. Please enter 1234.');
    }
  };

  if (!request) return null;

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

        {/* Step-specific layout rendering */}

        {step === 'accept_order' && (
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
                <BackArrowIcon size={24} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Accept Order</Text>
            </View>

            <ScrollView contentContainerStyle={styles.centerFlowContent}>
              <View style={styles.centerAlignCol}>
                <CheckmarkBigIcon />
                <Text style={styles.acceptTitle}>Accept this order?</Text>
                <Text style={styles.acceptSub}>
                  By accepting this order, you agree to prepare the materials and handover to the service provider.
                </Text>
              </View>

              <Card style={styles.orderSummaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Order ID</Text>
                  <Text style={styles.summaryValueBold}>
                    {request.requestId ? request.requestId.replace('RQ', 'ORD') : 'ORD789456'}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Amount</Text>
                  <Text style={styles.summaryValuePrice}>
                    ₹{request.grandTotal ? request.grandTotal.toFixed(2) : '1,894.44'}
                  </Text>
                </View>
              </Card>

              <View style={styles.actionBlock}>
                <TouchableOpacity activeOpacity={1} 
                  style={[styles.primaryActionBtn, { backgroundColor: '#22C55E' }]} 
                  onPress={handleAcceptOrder}
                >
                  <Text style={styles.actionBtnText}>Accept Order</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.cancelBtn} onPress={() => router.back()}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

        {step === 'accepted_success' && (
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <View style={{ width: 24 }} />
              <Text style={styles.headerTitleCenter}>Order Accepted</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.centerFlowContent}>
              <View style={styles.centerAlignCol}>
                <CheckmarkBigIcon />
                <Text style={styles.acceptTitle}>Order Accepted Successfully!</Text>
                <Text style={styles.acceptSub}>You can now start preparing the materials.</Text>
              </View>

              <Card style={styles.orderSummaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>ORDER ID</Text>
                  <Text style={styles.summaryValueBold}>
                    #{request.requestId ? request.requestId.replace('RQ', 'HZ-8829') : 'HZ-88291'}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Customer</Text>
                  <Text style={styles.summaryValueText}>{request.customerName || 'Jonathan Miller'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Scheduled</Text>
                  <Text style={styles.summaryValueText}>Today, 2:30 PM</Text>
                </View>
              </Card>

              <View style={styles.actionBlock}>
                <TouchableOpacity activeOpacity={1} 
                  style={styles.primaryActionBtn} 
                  onPress={() => setStep('ready_for_pickup')}
                >
                  <Text style={styles.actionBtnText}>Go to Order Details</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.cancelBtn} onPress={() => router.replace('/(dashboard)/seller/quotation-requests')}>
                  <Text style={styles.cancelBtnText}>BACK TO DASHBOARD</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

        {step === 'ready_for_pickup' && (
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={1} onPress={() => setStep('accepted_success')} style={styles.backButton}>
                <BackArrowIcon size={24} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Hozify Partner</Text>
              <TouchableOpacity activeOpacity={1} style={styles.bellBtn}>
                <NotificationBellIcon />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.mainTitle}>Ready for Pickup</Text>
              <Text style={styles.mainSub}>Review the order details before notifying the provider.</Text>

              <Card style={styles.pickupCard}>
                <View style={styles.pickupHeaderRow}>
                  <View>
                    <Text style={styles.labelSub}>ORDER ID</Text>
                    <Text style={styles.orderIdTextBold}>
                      #{request.requestId ? request.requestId.replace('RQ', 'HZ-8829') : 'HZ-8829-BK'}
                    </Text>
                  </View>
                  <View style={styles.readyBadge}>
                    <View style={styles.greenDot} />
                    <Text style={styles.readyBadgeText}>Ready for Pickup</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsGrid}>
                  <View style={styles.gridCell}>
                    <Text style={styles.gridCellLabel}>Service Date</Text>
                    <Text style={styles.gridCellValBold}>Oct 24, 2023</Text>
                  </View>
                  <View style={styles.gridCell}>
                    <Text style={styles.gridCellLabel}>Customer</Text>
                    <Text style={styles.gridCellValBold}>{request.customerName || 'Amit Kumar'}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.priceSummaryRow}>
                  <Text style={styles.priceSummaryLabel}>Total Value</Text>
                  <Text style={styles.priceSummaryVal}>
                    ₹{request.grandTotal ? request.grandTotal.toFixed(2) : '1,894.44'}
                  </Text>
                </View>
              </Card>

              {/* Ready Items Checklist */}
              <Text style={styles.sectionTitle}>Ready Items Checklist</Text>
              {request.items.map((item: any, idx: number) => (
                <View key={item.id || idx} style={styles.checklistItem}>
                  <CheckboxIcon />
                  <View style={styles.checklistInfo}>
                    <Text style={styles.checkitemName}>{item.name}</Text>
                    <Text style={styles.checkitemSub}>
                      {item.qty} ({item.brand})
                    </Text>
                  </View>
                </View>
              ))}

              {/* Pickup Location */}
              <Card style={styles.pickupLocationCard}>
                <View style={styles.locationHeader}>
                  <Text style={{ fontSize: 14 }}>📍</Text>
                  <Text style={styles.locationTitle}>PICKUP LOCATION</Text>
                </View>
                <Text style={styles.warehouseName}>Central Warehouse North</Text>
                <Text style={styles.warehouseAddress}>
                  1200 Logistics Way, Suite B-4, Industrial District
                </Text>
              </Card>

              <View style={styles.mapSection}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop' }} 
                  style={styles.mapImage} 
                />
              </View>

              <TouchableOpacity activeOpacity={1} style={styles.notifyBtn} onPress={handleNotifyProvider}>
                <PaperplaneWhiteIcon />
                <Text style={styles.notifyBtnText}>Notify Service Provider</Text>
              </TouchableOpacity>
              <Text style={styles.disclaimerText}>
                Provider will receive an SMS and Push notification immediately.
              </Text>
            </ScrollView>
          </View>
        )}

        {step === 'handover' && (
          <View style={{ flex: 1 }}>
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={1} onPress={() => setStep('ready_for_pickup')} style={styles.backButton}>
                <BackArrowIcon size={24} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Material Handover</Text>
            </View>

            <ScrollView contentContainerStyle={styles.centerFlowContent}>
              <Card style={styles.handoverCard}>
                <Text style={styles.handoverTitle}>Verify Handover OTP</Text>
                <Text style={styles.handoverSub}>
                  Enter the 4-digit verification OTP shared by the Service Provider / Customer to complete delivery.
                </Text>
                <Text style={styles.dummyOtpHint}>(Use dummy OTP: 1234)</Text>

                <TextInput
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={4}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="0000"
                  placeholderTextColor="#CBD5E1"
                />

                <Button 
                  title="Verify & Complete Handover" 
                  onPress={handleVerifyHandover} 
                  isLoading={isLoading}
                  disabled={otp.length !== 4}
                  variant="primary"
                  style={{ marginTop: 24 }}
                />
              </Card>
            </ScrollView>
          </View>
        )}
        </KeyboardAvoidingView>
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
  headerTitleCenter: { fontSize: 16, fontWeight: '700', color: '#0F172A', flex: 1, textAlign: 'center' },
  bellBtn: { padding: 4 },

  centerFlowContent: { flexGrow: 1, padding: 24, justifyContent: 'center', gap: 24 },
  centerAlignCol: { alignItems: 'center', gap: 16 },
  acceptTitle: { fontSize: 20, fontWeight: '800', color: '#1E1B4B', textAlign: 'center' },
  acceptSub: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 18, paddingHorizontal: 16 },

  orderSummaryCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E2E8F0', gap: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  summaryValueBold: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  summaryValueText: { fontSize: 13, fontWeight: '600', color: '#334155' },
  summaryValuePrice: { fontSize: 18, fontWeight: '800', color: '#16A34A' },

  actionBlock: { gap: 12, marginTop: 16 },
  primaryActionBtn: { height: 48, backgroundColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  cancelBtn: { height: 44, justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { color: '#64748B', fontSize: 13, fontWeight: '700' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 20 },
  mainTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  mainSub: { fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 20 },

  pickupCard: { padding: 16, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', gap: 12, marginBottom: 20 },
  pickupHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelSub: { fontSize: 9, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5 },
  orderIdTextBold: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginTop: 4 },
  readyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 },
  readyBadgeText: { fontSize: 9, fontWeight: '700', color: '#10B981' },
  divider: { height: 1, backgroundColor: '#F1F5F9' },
  
  detailsGrid: { flexDirection: 'row', marginVertical: 4 },
  gridCell: { flex: 1 },
  gridCellLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600', marginBottom: 4 },
  gridCellValBold: { fontSize: 12, color: '#334155', fontWeight: '700' },
  
  priceSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceSummaryLabel: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  priceSummaryVal: { fontSize: 16, fontWeight: '800', color: '#16A34A' },

  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  checklistItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', padding: 12, borderRadius: 16, gap: 12, marginBottom: 12 },
  checklistInfo: { flex: 1 },
  checkitemName: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  checkitemSub: { fontSize: 11, color: '#64748B', marginTop: 2 },

  pickupLocationCard: { padding: 16, backgroundColor: '#FFFFFF', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', gap: 6, marginBottom: 12 },
  locationHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationTitle: { fontSize: 9, fontWeight: '800', color: '#94A3B8', letterSpacing: 0.5 },
  warehouseName: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginTop: 4 },
  warehouseAddress: { fontSize: 11, color: '#64748B', lineHeight: 16 },

  mapSection: { height: 120, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  mapImage: { width: '100%', height: '100%' },

  notifyBtn: { backgroundColor: '#1E1B4B', height: 48, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginBottom: 12 },
  notifyBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  disclaimerText: { fontSize: 11, color: '#94A3B8', textAlign: 'center', lineHeight: 16 },

  handoverCard: { padding: 24, backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  handoverTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 8 },
  handoverSub: { fontSize: 12, color: '#64748B', textAlign: 'center', lineHeight: 18, marginBottom: 8 },
  dummyOtpHint: { fontSize: 11, color: '#F59E0B', fontWeight: '700', marginBottom: 24 },
  otpInput: { width: '70%', height: 48, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, textAlign: 'center', fontSize: 24, letterSpacing: 8, color: '#0F172A', backgroundColor: '#F8FAFC' }
});
