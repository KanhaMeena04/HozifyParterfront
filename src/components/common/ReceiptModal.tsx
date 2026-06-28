import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ReceiptModalProps {
  visible: boolean;
  onClose: () => void;
}

const CloseIcon = ({ color = '#64748B' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DownloadIcon = ({ color = '#FFFFFF' }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <TouchableOpacity activeOpacity={1} style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.sheetContainer}>
          
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.title}>Payment Receipt</Text>
            <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeBtn}>
              <CloseIcon />
            </TouchableOpacity>
          </View>

          <View style={styles.receiptCard}>
            
            <View style={styles.idRow}>
              <Text style={styles.idLabel}>BOOKING ID</Text>
              <Text style={styles.idText}>#BK123456</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.lineItem}>
              <Text style={styles.lineLabel}>Service Charges</Text>
              <Text style={styles.lineValue}>₹350</Text>
            </View>
            
            <View style={styles.lineItem}>
              <Text style={styles.lineLabel}>Material Charges</Text>
              <Text style={styles.lineValue}>₹750</Text>
            </View>

            <View style={styles.lineItem}>
              <Text style={styles.lineLabel}>Tax (18%)</Text>
              <Text style={styles.lineValue}>₹198</Text>
            </View>

            <View style={styles.lineItem}>
              <Text style={styles.lineLabel}>Platform fee</Text>
              <Text style={styles.lineValue}>₹198</Text>
            </View>

            <View style={styles.dashedDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalValue}>₹1,298</Text>
            </View>

            <View style={styles.paymentMethodRow}>
              <Text style={styles.paymentMethodText}>Paid via Online</Text>
            </View>

          </View>

          <TouchableOpacity activeOpacity={1} style={styles.downloadBtn}>
            <DownloadIcon />
            <Text style={styles.downloadBtnText}>Download Receipt</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject },

  sheetContainer: { backgroundColor: '#F8FAFC', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24, paddingTop: 16 },
  
  dragHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: 24 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  closeBtn: { padding: 4 },

  receiptCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, marginBottom: 24, boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)', elevation: 2 },
  
  idRow: { marginBottom: 16 },
  idLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  idText: { fontSize: 16, fontWeight: '800', color: '#0F172A' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 20 },

  lineItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  lineLabel: { fontSize: 13, color: '#475569' },
  lineValue: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  
  dashedDivider: { height: 1, backgroundColor: '#E2E8F0', borderStyle: 'dashed', marginVertical: 8, marginBottom: 20 },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  totalLabel: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  totalValue: { fontSize: 20, fontWeight: '800', color: '#22C55E' },

  paymentMethodRow: { alignItems: 'flex-end' },
  paymentMethodText: { fontSize: 11, color: '#94A3B8', fontStyle: 'italic' },

  downloadBtn: { flexDirection: 'row', backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingVertical: 18, borderRadius: 24, alignItems: 'center', justifyContent: 'center', gap: 8 },
  downloadBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
