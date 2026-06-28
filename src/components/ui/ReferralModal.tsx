import React, { useState } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants';
import { Button } from './Button';
import { OtpInput } from './OtpInput';
import { RightArrowIcon } from './Icons';

interface ReferralModalProps {
  visible: boolean;
  onApply: (code: string) => void;
  onSkip: () => void;
}

export function ReferralModal({ visible, onApply, onSkip }: ReferralModalProps) {
  const [code, setCode] = useState('');

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Have a referral code?</Text>
            <Text style={styles.subtitle}>Enter it to unlock rewards (optional)</Text>
          </View>

          <OtpInput value={code} onChange={setCode} length={6} focusDelay={500} />

          <View style={styles.actions}>
            <Button 
              title="Apply & Continue" 
              onPress={() => onApply(code)} 
              variant="primary" 
              style={styles.applyBtn}
              icon={<RightArrowIcon size={20} />}
            />
            
            <TouchableOpacity activeOpacity={1} onPress={onSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  actions: {
    marginTop: 12,
    alignItems: 'center',
    width: '100%',
  },
  applyBtn: {
    width: '100%',
    marginBottom: 16,
  },
  skipBtn: {
    paddingVertical: 8,
  },
  skipText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
