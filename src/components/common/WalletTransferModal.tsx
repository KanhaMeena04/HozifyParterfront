import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { CloseIcon, SecurityIcon } from '@/components/ui/Icons';
import Svg, { Path, Rect } from 'react-native-svg';
import { Button } from '@/components/ui/Button';

const WalletIcon = ({ size = 20, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="6" width="18" height="14" rx="2" stroke={color} strokeWidth="1.5" />
    <Path d="M16 11H21V15H16C14.8954 15 14 14.1046 14 13C14 11.8954 14.8954 11 16 11Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18 13.01L18.01 12.9989" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RadioChecked = ({ size = 20, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="2" width="20" height="20" rx="10" stroke={color} strokeWidth="4" />
    <Rect x="8" y="8" width="8" height="8" rx="4" fill={color} />
  </Svg>
);

interface WalletTransferModalProps {
  visible: boolean;
  onClose: () => void;
}

export const WalletTransferModal: React.FC<WalletTransferModalProps> = ({ visible, onClose }) => {
  const [amount, setAmount] = useState('5,000');
  const [description, setDescription] = useState('');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.headerBox}>
              <Text style={styles.titleText}>Wallet transfer</Text>
              <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeBtn}>
                <CloseIcon size={14} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionLabel}>Transfer To</Text>
            
            <View style={styles.walletCard}>
              <View style={styles.walletIconBox}>
                <WalletIcon size={20} color="rgba(26, 15, 163, 1.00)" />
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.walletName}>Wallet</Text>
                <Text style={styles.walletType}>My Pay Wallet</Text>
                <Text style={styles.walletSub}>Instant transfer within minutes</Text>
              </View>
              <View style={styles.radioBox}>
                <RadioChecked size={20} color="rgba(26, 15, 163, 1.00)" />
              </View>
            </View>

            <Text style={styles.sectionLabel}>Enter Amount</Text>
            
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput 
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.descInputContainer}>
              <Text style={styles.descIcon}>≡</Text>
              <TextInput 
                style={styles.descInput}
                placeholder="Add a description or note (optional)..."
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.securityBanner}>
              <SecurityIcon size={18} color="rgba(26, 15, 163, 1.00)" />
              <Text style={styles.securityText}>Transfers are encrypted and securely{'\n'}processed.</Text>
            </View>

          </ScrollView>

          <View style={styles.footer}>
            <Button 
              title="Wallet transfer" 
              onPress={onClose} 
              variant="primary" 
              style={{ backgroundColor: 'rgba(26, 15, 163, 1.00)' }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  
  headerBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  titleText: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },

  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 12 },

  walletCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(26, 15, 163, 1.00)', borderRadius: 16, padding: 16, marginBottom: 24, backgroundColor: '#FFFFFF' },
  walletIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  walletInfo: { flex: 1 },
  walletName: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  walletType: { fontSize: 11, color: '#64748B', marginBottom: 2 },
  walletSub: { fontSize: 9, fontWeight: '600', color: 'rgba(26, 15, 163, 1.00)' },
  radioBox: { marginLeft: 12 },

  amountInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 16, paddingHorizontal: 16, height: 72, marginBottom: 16, backgroundColor: '#FFFFFF' },
  currencySymbol: { fontSize: 24, fontWeight: '500', color: '#64748B', marginRight: 12 },
  amountInput: { flex: 1, fontSize: 28, fontWeight: '700', color: '#0F172A' },

  descInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 16, paddingHorizontal: 16, height: 56, marginBottom: 24, backgroundColor: '#FFFFFF' },
  descIcon: { fontSize: 18, color: '#94A3B8', marginRight: 12 },
  descInput: { flex: 1, fontSize: 13, color: '#0F172A' },

  securityBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F3FF', borderRadius: 16, padding: 16, marginBottom: 16 },
  securityText: { fontSize: 11, color: 'rgba(26, 15, 163, 1.00)', marginLeft: 12, lineHeight: 16, fontWeight: '500' },

  footer: { padding: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#FFFFFF' },
});
