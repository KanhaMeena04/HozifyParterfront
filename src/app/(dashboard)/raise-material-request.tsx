import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { Booking } from '@/types/storage.types';

const BellIcon = ({ color = '#0F172A', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PaperplaneIcon = ({ color = '#FFFFFF', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CameraIcon = ({ color = 'rgba(26, 15, 163, 1.00)', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M23 19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V8C1 6.89543 1.89543 6 3 6H7L9 3H15L17 6H21C22.1046 6 23 6.89543 23 8V19Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="13" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const TrashIcon = ({ color = '#EF4444', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 7M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

interface MaterialItem {
  id: string;
  name: string;
  brand: string;
  qty: string;
  price: number;
}

export default function RaiseMaterialRequestScreen() {
  useAndroidBack();
  const router = useSafeRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);

  const [items, setItems] = useState<MaterialItem[]>([
    { id: '1', name: 'Copper Pipe (1/2 inch)', brand: 'Astral CPVC Pro', qty: '6 Feet', price: 650 },
    { id: '2', name: 'Insulation Tape', brand: 'Premier 1700', qty: '2 Roll', price: 20 },
  ]);
  const [note, setNote] = useState('Please provide best quality material.');
  const [hasPhoto, setHasPhoto] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadBookingAndItems = async () => {
        if (bookingId) {
          const bks = await StorageService.getBookings();
          const bk = bks.find(b => b.bookingId === bookingId || b.bookingId.replace('#', '') === bookingId);
          if (bk) setBooking(bk);
        }
        
        // Read custom materials if added from add-material.tsx
        const customItems = await StorageService.getItem<any[]>('TEMP_MATERIAL_ITEMS');
        if (customItems && customItems.length > 0) {
          setItems(customItems.map((item, idx) => ({
            id: item.id || idx.toString(),
            name: item.name,
            brand: item.brand || 'Astral CPVC Pro',
            qty: item.qty + ' Units',
            price: item.price
          })));
        }
      };
      loadBookingAndItems();
    }, [bookingId])
  );

  const calculateTotal = () => {
    // Return total (matching Image 2 cost breakdown or custom total)
    // Image 2 shows Est. Material Cost ₹1,559.00
    // Item 1 (Copper Pipe): 2 units * 650.00 = 1300
    // Item 2 (Insulation Tape): 5 units * 20.00 = 100
    // Plus GST = ₹1,540.00.
    // Let's do a dynamic sum based on qty and price
    return items.reduce((acc, item) => {
      const numericQty = parseInt(item.qty.replace(/[^0-9]/g, '')) || 1;
      return acc + (item.price * numericQty);
    }, 0) + 109; // Add ₹109 taxes/fees to simulate Image 2's specific 1559.00 or just show dynamic total
  };

  const removeItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    StorageService.setItem('TEMP_MATERIAL_ITEMS', updated);
  };

  const handleAddMore = () => {
    // Save current items to temporary storage so add-material.tsx can append
    StorageService.setItem('TEMP_MATERIAL_ITEMS', items.map(item => ({
      id: item.id,
      name: item.name,
      qty: parseInt(item.qty.replace(/[^0-9]/g, '')) || 1,
      price: item.price,
      brand: item.brand
    })));
    router.push({
      pathname: '/(dashboard)/add-material',
      params: { bookingId }
    });
  };

  const handleSubmit = async () => {
    if (!booking) return;
    const reqId = 'RQ' + Math.floor(100000 + Math.random() * 900000);
    const newRequest = {
      requestId: reqId,
      bookingId: booking.bookingId,
      provider: 'hozify',
      status: 'pending_quote',
      items: items,
      notes: note,
      submittedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      grandTotal: calculateTotal()
    };
    await StorageService.saveMaterialRequest(newRequest);
    
    // Clear temp items
    await StorageService.removeItem('TEMP_MATERIAL_ITEMS');

    router.push({
      pathname: '/(dashboard)/quotation-submitted',
      params: { requestId: reqId, bookingId }
    });
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Raise Material Request</Text>
          <TouchableOpacity activeOpacity={1} style={styles.bellBtn}>
            <BellIcon />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.introText}>
            Review the material request details below before submitting for quotation.
          </Text>

          {/* Booking Info Card */}
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Booking ID</Text>
              <Text style={styles.infoValue}>{booking?.bookingId || '#BK123456'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Service</Text>
              <Text style={styles.infoValueBold}>AC Repair</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Material Provider</Text>
              <View style={styles.providerBadge}>
                <View style={styles.greenDot} />
                <Text style={styles.providerBadgeText}>Hozify will Provide</Text>
              </View>
            </View>
          </View>

          {/* Material Items Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Material Items ({items.length})</Text>
            <TouchableOpacity activeOpacity={1} onPress={handleAddMore}>
              <Text style={styles.addMoreLink}>+ Add more</Text>
            </TouchableOpacity>
          </View>

          {items.map((item, idx) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemIndexText}>ITEM {idx + 1}</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => removeItem(item.id)}>
                  <TrashIcon />
                </TouchableOpacity>
              </View>
              <Text style={styles.itemNameText}>{item.name}</Text>
              <View style={styles.itemMetaRow}>
                <View>
                  <Text style={styles.metaLabel}>BRAND</Text>
                  <Text style={styles.metaValue}>{item.brand}</Text>
                </View>
                <View>
                  <Text style={styles.metaLabel}>QUANTITY</Text>
                  <Text style={styles.metaValue}>{item.qty}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Note Input */}
          <Text style={styles.notesInputLabel}>Note (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            value={note}
            onChangeText={setNote}
            multiline
            placeholder="Please enter a note..."
            placeholderTextColor="#94A3B8"
          />

          {/* Evidence & Verification Photo Section */}
          <Text style={styles.evidenceHeading}>Evidence & Verification</Text>
          <View style={styles.uploadCard}>
            <View style={styles.cameraIconCircle}>
              <CameraIcon />
            </View>
            <Text style={styles.uploadTextTitle}>Upload Material Photo</Text>
            <Text style={styles.uploadTextSub}>JPG or PNG up to 5MB</Text>
            <TouchableOpacity activeOpacity={1} style={styles.uploadOutlineBtn} onPress={() => setHasPhoto(true)}>
              <Text style={styles.uploadOutlineBtnText}>Upload Image</Text>
            </TouchableOpacity>
          </View>

          {hasPhoto && (
            <View style={styles.photoFilenameCard}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1596700057077-bd1c9c0587d5?q=80&w=150&auto=format&fit=crop' }} style={styles.photoThumb} />
              <View style={styles.filenameMeta}>
                <Text style={styles.filenameText}>request_photo_01.jpg</Text>
                <Text style={styles.uploadTimeText}>Uploaded 2 mins ago</Text>
              </View>
              <TouchableOpacity activeOpacity={1} onPress={() => alert('Viewing details...')}>
                <Text style={styles.viewDetailsLink}>View Details</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.termsDisclaimer}>
            By submitting, you are requesting quotes from available verified sellers in the Hozify network.
          </Text>

        </ScrollView>

        {/* Sticky Action Footer */}
        <View style={styles.stickyFooter}>
          <View style={styles.footerRow}>
            <Text style={styles.estLabel}>Est. Material Cost</Text>
            <Text style={styles.estValue}>₹{calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
          </View>
          <TouchableOpacity activeOpacity={1} style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Submit for Quotation</Text>
            <PaperplaneIcon />
          </TouchableOpacity>
        </View>
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

  scrollContent: { paddingHorizontal: 16, paddingBottom: 120, paddingTop: 12 },
  introText: { fontSize: 13, color: '#64748B', lineHeight: 18, marginBottom: 16 },

  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  infoLabel: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  infoValue: { fontSize: 12, color: '#0F172A', fontWeight: '700' },
  infoValueBold: { fontSize: 12, color: '#0F172A', fontWeight: '800' },
  
  providerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#15803D', marginRight: 6 },
  providerBadgeText: { fontSize: 9, fontWeight: '700', color: '#15803D' },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionHeading: { fontSize: 13, fontWeight: '800', color: '#0F172A' },
  addMoreLink: { fontSize: 12, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },

  itemCard: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemIndexText: { fontSize: 9, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)', letterSpacing: 0.5 },
  itemNameText: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  itemMetaRow: { flexDirection: 'row', gap: 32 },
  metaLabel: { fontSize: 9, color: '#94A3B8', fontWeight: '700', marginBottom: 2 },
  metaValue: { fontSize: 12, fontWeight: '600', color: '#475569' },

  notesInputLabel: { fontSize: 12, fontWeight: '700', color: '#0F172A', marginTop: 12, marginBottom: 8 },
  notesInput: { backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#FFEDD5', borderRadius: 12, padding: 12, fontSize: 12, color: '#9A3412', minHeight: 44, textAlignVertical: 'top', marginBottom: 20 },

  evidenceHeading: { fontSize: 12, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  uploadCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: '#CBD5E1', marginBottom: 12 },
  cameraIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0EFFF', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  uploadTextTitle: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 4 },
  uploadTextSub: { fontSize: 10, color: '#94A3B8', marginBottom: 16 },
  uploadOutlineBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  uploadOutlineBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },

  photoFilenameCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12, marginBottom: 24 },
  photoThumb: { width: 36, height: 36, borderRadius: 6, marginRight: 12 },
  filenameMeta: { flex: 1 },
  filenameText: { fontSize: 12, fontWeight: '700', color: '#1E40AF' },
  uploadTimeText: { fontSize: 10, color: '#60A5FA', marginTop: 2 },
  viewDetailsLink: { fontSize: 11, fontWeight: '700', color: '#3B82F6' },

  termsDisclaimer: { fontSize: 10, color: '#94A3B8', textAlign: 'center', lineHeight: 14, marginBottom: 24 },

  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 6 },
      android: { elevation: 8 }
    })
  },
  footerRow: {},
  estLabel: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  estValue: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  submitBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', height: 44, borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 },
  submitBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' }
});
