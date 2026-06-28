import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { APP_CONSTANTS } from '../../constants';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

export function HelpModal({ visible, onClose }: HelpModalProps) {
  const handleCall = () => {
    Linking.openURL(`tel:${APP_CONSTANTS.SUPPORT_PHONE.replace(/\s+/g, '')}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone calls on this device.');
    });
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${APP_CONSTANTS.SUPPORT_EMAIL}`).catch(() => {
      Alert.alert('Error', 'No email client found on this device.');
    });
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose}>
        <View style={styles.backdrop}>
          <Pressable>
            <View style={styles.modalCard}>
              <Text style={styles.title}>Need Help?</Text>
              
              <Text style={styles.description}>
                If you are facing issues logging in or registering, please contact our support team.
              </Text>

              <View style={styles.optionsContainer}>
                <TouchableOpacity activeOpacity={1} onPress={handleCall} style={styles.optionButton}>
                  <Text style={styles.optionEmoji}>📞</Text>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionLabel}>Call Support</Text>
                    <Text style={styles.optionValue}>{APP_CONSTANTS.SUPPORT_PHONE}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} onPress={handleEmail} style={styles.optionButton}>
                  <Text style={styles.optionEmoji}>✉️</Text>
                  <View style={styles.optionTextContainer}>
                    <Text style={styles.optionLabel}>Email Support</Text>
                    <Text style={styles.optionValue}>{APP_CONSTANTS.SUPPORT_EMAIL}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.testHintContainer}>
                <Text style={styles.testHintTitle}>Testing Credentials:</Text>
                <Text style={styles.testHintText}>
                  Use any valid-starting 10-digit number (e.g. 9876543210).
                </Text>
                <Text style={styles.testHintText}>
                  Use the OTP code <Text style={{ fontWeight: 'bold' }}>{APP_CONSTANTS.MOCK_OTP}</Text> to login.
                </Text>
              </View>

              <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // slate-900 with opacity
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 340,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    width: '100%',
  },
  optionEmoji: {
    fontSize: 22,
    marginRight: 14,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  optionValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
    marginTop: 2,
  },
  testHintContainer: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginBottom: 24,
  },
  testHintTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 4,
  },
  testHintText: {
    fontSize: 11,
    color: '#0284C7',
    lineHeight: 15,
    marginTop: 2,
  },
  closeButton: {
    width: '100%',
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
  },
  closeButtonText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '700',
  },
});

export default HelpModal;
