import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface CancellationReasonModalProps {
  visible: boolean;
  onClose: () => void;
  bookingId?: string;
  serviceName?: string;
  onConfirm?: (reason: string) => void;
}

const CloseModalIcon = ({ color = '#0F172A' }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RadioIcon = ({ selected, color = 'rgba(26, 15, 163, 1.00)' }: { selected: boolean, color?: string }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={selected ? color : '#E2E8F0'} strokeWidth="2" />
    {selected && <Circle cx="12" cy="12" r="4" fill={color} />}
  </Svg>
);

export const CancellationReasonModal: React.FC<CancellationReasonModalProps> = ({ 
  visible, 
  onClose,
  bookingId = '#BK123456',
  serviceName = 'AC Repair',
  onConfirm
}) => {
  const [selectedReason, setSelectedReason] = useState('Customer requested');
  const [notes, setNotes] = useState('');

  const REASONS = [
    'Customer requested',
    'Unable to reach',
    'Out of service area',
    'Personal reason',
    'Other reason'
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <View style={styles.sheetContainer}>
          
          <TouchableOpacity activeOpacity={1} style={styles.closeBtn} onPress={onClose}>
            <CloseModalIcon />
          </TouchableOpacity>

          <View style={styles.topBanner}>
            <View>
              <Text style={styles.bannerLabel}>Booking ID</Text>
              <Text style={styles.bannerValue}>{bookingId}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.bannerLabel}>Service</Text>
              <Text style={styles.bannerValue}>{serviceName}</Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Cancellation Reason</Text>
            
            <View style={styles.reasonsCard}>
              {REASONS.map((reason, index) => (
                <TouchableOpacity activeOpacity={1} 
                  key={reason} 
                  style={[styles.reasonRow, index === REASONS.length - 1 && styles.reasonRowLast]}
                  onPress={() => setSelectedReason(reason)}
                >
                  <RadioIcon selected={selectedReason === reason} />
                  <Text style={styles.reasonText}>{reason}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Write here..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
              textAlignVertical="top"
            />
          </ScrollView>

          <TouchableOpacity activeOpacity={1} 
            style={styles.cancelBtn} 
            onPress={() => {
              onConfirm?.(selectedReason + (notes ? ': ' + notes : ''));
              onClose();
            }}
          >
            <Text style={styles.cancelBtnText}>Cancel Booking</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetContainer: { backgroundColor: '#F8FAFC', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%' },
  
  closeBtn: { alignSelf: 'flex-end', padding: 4, marginBottom: 8 },

  topBanner: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#DBEAFE', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(26, 15, 163, 1.00)' },
  bannerLabel: { fontSize: 11, color: '#64748B', marginBottom: 4 },
  bannerValue: { fontSize: 13, fontWeight: '700', color: '#0F172A' },

  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 12 },

  reasonsCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 24 },
  reasonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  reasonRowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  reasonText: { fontSize: 13, color: '#475569', marginLeft: 12 },

  textArea: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, minHeight: 100, fontSize: 13, color: '#0F172A', marginBottom: 24 },

  cancelBtn: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  cancelBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
