import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Pressable, Keyboard,
} from 'react-native';
import { OtpInput } from '@/components/ui/OtpInput';
import { Button } from '@/components/ui/Button';
import { MessageIcon, WhatsAppIcon, RightArrowIcon } from '@/components/ui/Icons';
import { COLORS } from '@/constants';

interface OtpVerifyModalProps {
  visible: boolean;
  mobileNumber: string;
  isLoading: boolean;
  error?: string | null;
  onVerify: (otp: string) => void;
  onBack: () => void;
}

export function OtpVerifyModal({ visible, mobileNumber, isLoading, error, onVerify, onBack }: OtpVerifyModalProps) {
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    onVerify(otp);
  };

  const handleBack = () => {
    setOtp('');
    onBack();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.overlay}>
        <Pressable onPress={Keyboard.dismiss} style={StyleSheet.absoluteFill} />
        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to{' '}
              <Text style={styles.phone}>{mobileNumber}</Text>
            </Text>

            <OtpInput value={otp} onChange={setOtp} length={6} autoFocus />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.actionRow}>
              <TouchableOpacity activeOpacity={1} style={styles.actionLink}>
                <MessageIcon size={18} color="#64748B" />
                <Text style={styles.actionText}>Resend code in 29s</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} style={styles.actionLink}>
                <WhatsAppIcon size={18} />
                <Text style={[styles.actionText, { color: '#25D366' }]}>Send via WhatsApp</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Next"
              onPress={handleVerify}
              isLoading={isLoading}
              variant="primary"
              icon={<RightArrowIcon size={20} />}
              style={styles.nextButton}
            />

            <TouchableOpacity activeOpacity={1} onPress={handleBack} style={styles.backBtn}>
              <Text style={styles.backText}>← Change number</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By tapping on "Send via WhatsApp", you agree to receive important communications such as OTP and payment details, over WhatsApp
            </Text>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  phone: {
    color: '#0F172A',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: -8,
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 24,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  nextButton: {
    marginBottom: 16,
  },
  backBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
});
