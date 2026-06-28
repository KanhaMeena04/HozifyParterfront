import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { CloseIcon } from '@/components/ui/Icons';
import Svg, { Path, Circle } from 'react-native-svg';

interface TicketsModalProps {
  visible: boolean;
  onClose: () => void;
}

const TicketIcon = ({ size = 20, color = '#64748B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const TicketsModal: React.FC<TicketsModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          <View style={styles.headerBox}>
            <Text style={styles.titleText}>Your Tickets</Text>
            <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeBtn}>
              <CloseIcon size={14} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list}>
            
            <View style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <View style={styles.ticketIconBox}>
                  <TicketIcon color="#3B82F6" />
                </View>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketId}>Ticket #TKT-8271</Text>
                  <Text style={styles.ticketDate}>May 28, 2026</Text>
                </View>
                <View style={styles.statusBadgeOpen}>
                  <Text style={styles.statusTextOpen}>Open</Text>
                </View>
              </View>
              <Text style={styles.ticketDesc}>I was charged a cancellation fee incorrectly.</Text>
            </View>

            <View style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <View style={styles.ticketIconBox}>
                  <TicketIcon color="#94A3B8" />
                </View>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketId}>Ticket #TKT-4122</Text>
                  <Text style={styles.ticketDate}>Apr 14, 2026</Text>
                </View>
                <View style={styles.statusBadgeClosed}>
                  <Text style={styles.statusTextClosed}>Resolved</Text>
                </View>
              </View>
              <Text style={styles.ticketDesc}>Unable to add my bank account details for payout.</Text>
            </View>

          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, width: '100%', maxHeight: '80%', padding: 20 },
  
  headerBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  titleText: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

  list: { marginBottom: 10 },
  
  ticketCard: { borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 16, padding: 16, marginBottom: 12 },
  ticketHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  ticketIconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  ticketInfo: { flex: 1 },
  ticketId: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  ticketDate: { fontSize: 11, color: '#64748B' },
  
  statusBadgeOpen: { backgroundColor: '#DBEAFE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusTextOpen: { color: '#2563EB', fontSize: 10, fontWeight: '700' },
  statusBadgeClosed: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusTextClosed: { color: '#64748B', fontSize: 10, fontWeight: '700' },

  ticketDesc: { fontSize: 12, color: '#475569', lineHeight: 18 },
});
