import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { CloseIcon, BackArrowIcon } from '@/components/ui/Icons';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { ReferralDetailsModal } from './ReferralDetailsModal';
import { WalletTransferModal } from './WalletTransferModal';

// Local Icons
const HistoryIcon = ({ size = 20, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 8V12L15 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
  </Svg>
);

const TransferIcon = ({ size = 16, color = '#0F172A' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M17 7L7 17M17 7H7M17 7V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const BankIcon = ({ size = 20, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 21H21M4 10H20M6 10V18M10 10V18M14 10V18M18 10V18M12 3L2 8H22L12 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DUMMY_REFERRALS = [
  { id: '1', name: 'Sarah Chen', type: 'USER', date: 'Oct 12, 2023', status: 'Completed', image: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Sarah Chen', type: 'USER', date: 'Oct 12, 2023', status: 'Completed', image: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Sarah Chen', type: 'USER', date: 'Oct 12, 2023', status: 'Completed', image: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Sarah Chen', type: 'USER', date: 'Oct 12, 2023', status: 'Completed', image: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Sarah Chen', type: 'USER', date: 'Oct 12, 2023', status: 'Completed', image: 'https://i.pravatar.cc/150?u=5' },
];

interface ReferralStatusModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ReferralStatusModal: React.FC<ReferralStatusModalProps> = ({ visible, onClose }) => {
  const router = useSafeRouter();
  
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<any>(null);

  const handlePassbook = () => {
    onClose();
    router.push('/(dashboard)/referral-passbook');
  };

  const handleViewDetails = (ref: any) => {
    setSelectedReferral(ref);
    setDetailsModalVisible(true);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <GradientBackground style={styles.gradientBg}>
            
            <View style={styles.header}>
              <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.backButton}>
                <BackArrowIcon size={24} color="#0F172A" />
              </TouchableOpacity>
              <View style={styles.headerTitleBox}>
                <Text style={styles.headerTitle}>Referral status</Text>
                <Text style={styles.headerSubtitle}>Earn rewards by inviting friends</Text>
              </View>
              
              <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeBtn}>
                <CloseIcon size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              
              <View style={styles.earningCard}>
                <View style={styles.earningTopRow}>
                  <View>
                    <Text style={styles.availPayoutLabel}>Available Payout</Text>
                    <Text style={styles.availPayoutAmount}>₹42,500</Text>
                  </View>
                  <View style={styles.payoutReadyTag}>
                    <View style={styles.payoutReadyDot} />
                    <Text style={styles.payoutReadyText}>Payout Ready</Text>
                  </View>
                </View>

                <View style={styles.earningStatsRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.statLabel}>Total earning</Text>
                    <Text style={styles.statValue}>₹12,600</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.statLabel}>Lifetime Earnings</Text>
                    <Text style={styles.statValue}>₹3.4L</Text>
                  </View>
                </View>

                <View style={styles.earningActionsRow}>
                  <TouchableOpacity activeOpacity={1} onPress={() => setWalletModalVisible(true)} style={styles.transferBtn}>
                    <TransferIcon size={16} color="#0F172A" />
                    <Text style={styles.transferBtnText}>Transfer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} style={styles.historyBtn}>
                    <HistoryIcon size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Passbook</Text>
              <TouchableOpacity activeOpacity={1} onPress={handlePassbook} style={styles.passbookCard}>
                <View style={styles.bankIconBox}>
                  <BankIcon size={20} color="rgba(26, 15, 163, 1.00)" />
                </View>
                <Text style={styles.passbookText}>Show Passboook</Text>
              </TouchableOpacity>

              <View style={styles.filtersRow}>
                <TouchableOpacity activeOpacity={1} style={styles.filterPillActive}>
                  <Text style={styles.filterPillTextActive}>All Activity</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.filterPill}>
                  <Text style={styles.filterPillText}>User</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={styles.filterPill}>
                  <Text style={styles.filterPillText}>Partner</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.listContainer}>
                {DUMMY_REFERRALS.map((ref, index) => (
                  <View key={index} style={styles.refCard}>
                    <Image source={{ uri: ref.image }} style={styles.refImage} />
                    <View style={styles.refInfo}>
                      <View style={styles.refNameRow}>
                        <Text style={styles.refName}>{ref.name}</Text>
                        <Text style={styles.refType}>{ref.type}</Text>
                      </View>
                      <View style={styles.refDateRow}>
                        <Text style={styles.refDate}>{ref.date}</Text>
                        <Text style={styles.refDot}> • </Text>
                        <Text style={styles.refStatus}>{ref.status}</Text>
                      </View>
                    </View>
                    <TouchableOpacity activeOpacity={1} onPress={() => handleViewDetails(ref)} style={styles.viewBtn}>
                      <Text style={styles.viewBtnText}>View</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

            </ScrollView>
          </GradientBackground>
        </View>
      </View>
      
      <WalletTransferModal 
        visible={walletModalVisible}
        onClose={() => setWalletModalVisible(false)}
      />

      <ReferralDetailsModal 
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        referral={selectedReferral}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '95%', overflow: 'hidden' },
  gradientBg: { flex: 1 },
  
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  backButton: { marginRight: 12 },
  headerTitleBox: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  headerSubtitle: { fontSize: 12, color: '#64748B' },
  closeBtn: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 20 },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  earningCard: { backgroundColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 24, padding: 24, marginBottom: 24 },
  earningTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  availPayoutLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 4 },
  availPayoutAmount: { fontSize: 32, fontWeight: '700', color: '#FFFFFF' },
  payoutReadyTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#312E81', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  payoutReadyDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E', marginRight: 6 },
  payoutReadyText: { fontSize: 10, color: '#FFFFFF', fontWeight: '600' },

  earningStatsRow: { flexDirection: 'row', marginBottom: 24 },
  statLabel: { fontSize: 10, color: '#94A3B8', marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },

  earningActionsRow: { flexDirection: 'row', gap: 12 },
  transferBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, height: 48, gap: 8 },
  transferBtnText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  historyBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#312E81', justifyContent: 'center', alignItems: 'center' },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  
  passbookCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 24 },
  bankIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF7ED', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  passbookText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },

  filtersRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  filterPillActive: { backgroundColor: 'rgba(26, 15, 163, 1.00)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  filterPillTextActive: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  filterPill: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  filterPillText: { fontSize: 12, fontWeight: '500', color: '#64748B' },

  listContainer: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 8 },
  refCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 16, marginBottom: 8 },
  refImage: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  refInfo: { flex: 1 },
  refNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  refName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginRight: 8 },
  refType: { fontSize: 9, fontWeight: '700', color: '#94A3B8' },
  refDateRow: { flexDirection: 'row', alignItems: 'center' },
  refDate: { fontSize: 11, color: '#64748B' },
  refDot: { fontSize: 11, color: '#64748B' },
  refStatus: { fontSize: 11, color: '#22C55E', fontWeight: '600' },
  viewBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  viewBtnText: { fontSize: 11, fontWeight: '600', color: '#0F172A' },

});
