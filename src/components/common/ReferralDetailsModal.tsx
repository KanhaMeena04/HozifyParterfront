import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { CloseIcon } from '@/components/ui/Icons';

interface ReferralDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  referral: any;
}

export const ReferralDetailsModal: React.FC<ReferralDetailsModalProps> = ({ visible, onClose, referral }) => {
  if (!referral) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          <View style={styles.closeBtnContainer}>
            <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeBtn}>
              <CloseIcon size={14} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerBox}>
            <Image source={{ uri: referral.image || 'https://i.pravatar.cc/150' }} style={styles.profileImage} />
            <Text style={styles.nameText}>{referral.name || 'John Doe'}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{referral.type === 'PARTNER' ? 'PARTNER' : 'USER'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Booking Count</Text>
              <Text style={styles.statValue}>3 Completed</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Status of Referral</Text>
              <Text style={[styles.statValue, { color: '#22C55E' }]}>Active</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Payout Claimed Date</Text>
              <Text style={styles.statValue}>Oct 15, 2023</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Claim Status</Text>
              <Text style={[styles.statValue, { color: '#3B82F6' }]}>Processed</Text>
            </View>
          </View>

          <View style={styles.footerBlock}>
            <Text style={styles.footerLabel}>Total Earning</Text>
            <Text style={styles.footerAmount}>₹500</Text>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, width: '100%', padding: 20 },
  
  closeBtnContainer: { alignItems: 'flex-end', marginBottom: 4 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

  headerBox: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 64, height: 64, borderRadius: 32, marginBottom: 12 },
  nameText: { fontSize: 16, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)', marginBottom: 6 },
  roleBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  roleText: { color: '#64748B', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 24, marginHorizontal: -20 },

  statsContainer: { gap: 24, marginBottom: 32 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#64748B' },
  statValue: { fontSize: 12, color: '#0F172A', fontWeight: '500' },

  footerBlock: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { fontSize: 12, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },
  footerAmount: { fontSize: 20, fontWeight: '700', color: 'rgba(26, 15, 163, 1.00)' },
});
