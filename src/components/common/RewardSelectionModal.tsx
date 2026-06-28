import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Button } from '@/components/ui/Button';
import { CloseIcon, RibbonIcon } from '@/components/ui/Icons';

interface RewardSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (reward: any) => void;
  selectedRewardId?: string;
}

const REWARDS = [
  {
    id: '1',
    title: 'flat ₹50 cashback',
    subtitle: 'Get flat ₹50 cashback on first successful service booking by your friends',
    iconColor: 'rgba(26, 15, 163, 1.00)'
  },
  {
    id: '2',
    title: '₹75 Off Coupon',
    subtitle: 'Get ₹75 off on your next booking when your friend books their first service',
    iconColor: '#22C55E'
  },
  {
    id: '3',
    title: 'flat ₹50 cashback',
    subtitle: 'Get flat ₹50 cashback on first successful service booking by your friends',
    iconColor: 'rgba(26, 15, 163, 1.00)'
  }
];

export const RewardSelectionModal: React.FC<RewardSelectionModalProps> = ({ visible, onClose, onSelect, selectedRewardId }) => {
  const [selected, setSelected] = useState<string | undefined>(selectedRewardId);

  const handleSelect = (reward: any) => {
    setSelected(reward.id);
  };

  const handleConfirm = () => {
    const reward = REWARDS.find(r => r.id === selected);
    if (reward) {
      onSelect(reward);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.header}>
              <View style={styles.headerTopRow}>
                <Text style={styles.title}>Select your reward</Text>
                <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeBtn}>
                  <CloseIcon size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
              <Text style={styles.subtitle}>Choose one reward to continue</Text>
            </View>

            <View style={styles.rewardsList}>
              {REWARDS.map((reward) => (
                <TouchableOpacity activeOpacity={1}
                  key={reward.id}
                  style={[styles.rewardCard, selected === reward.id && styles.rewardCardSelected]}
                  onPress={() => handleSelect(reward)}
                >
                  <View style={styles.rewardIconBox}>
                    <RibbonIcon size={18} color={reward.iconColor} />
                  </View>
                  <View style={styles.rewardInfo}>
                    <Text style={styles.rewardTitle}>{reward.title}</Text>
                    <Text style={styles.rewardSubtitle}>{reward.subtitle}</Text>
                  </View>
                  <View style={[styles.radioOuter, selected === reward.id && styles.radioOuterSelected]}>
                    {selected === reward.id && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

          </ScrollView>

          <View style={styles.footer}>
            <Button 
              title="Generate Referral Code" 
              onPress={handleConfirm} 
              variant="primary" 
              style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)' }}
              disabled={!selected}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%' },
  dragHandleContainer: { width: '100%', alignItems: 'center', paddingTop: 12, paddingBottom: 8 },
  dragHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1' },
  
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  header: { marginBottom: 24, marginTop: 8 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  subtitle: { fontSize: 13, color: '#64748B' },
  
  rewardsList: { gap: 12 },
  rewardCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', backgroundColor: '#FFFFFF' },
  rewardCardSelected: { borderColor: '#E2E8F0', backgroundColor: '#FAFAFA' },
  
  rewardIconBox: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 12, marginTop: 2 },
  rewardInfo: { flex: 1, marginRight: 12 },
  rewardTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  rewardSubtitle: { fontSize: 11, color: '#64748B', lineHeight: 16 },
  
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  radioOuterSelected: { borderColor: 'rgba(26, 15, 163, 1.00)' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(26, 15, 163, 1.00)' },

  footer: { padding: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#FFFFFF' }
});
