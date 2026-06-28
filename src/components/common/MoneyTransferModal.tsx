import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';

interface MoneyTransferModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function MoneyTransferModal({ visible, onClose }: MoneyTransferModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity activeOpacity={1} style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.modalContent}>
          <View style={styles.dragHandle} />
          
          <Text style={styles.modalTitle}>Know more about money{'\n'}transfer</Text>

          <View style={styles.faqSection}>
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How much I can transfer at a time?</Text>
              <Text style={styles.faqAnswer}>You can transfer minimum of ₹1 or more at once.{'\n'}There is no limit on maximum transfer amount.</Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How many transfers are allowed in a{'\n'}Week?</Text>
              <Text style={styles.faqAnswer}>You can transfer 2 times in a Week.</Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>When can I transfer?</Text>
              <Text style={styles.faqAnswer}>You can transfer every Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday. If you have{'\n'}reached the transfer limit for the week, you can transfer again from next Monday.</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={1} style={styles.primaryButton} onPress={onClose}>
            <Text style={styles.primaryButtonText}>Okay, Got It</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 24,
    lineHeight: 28,
  },
  faqSection: {
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 24,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 20,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 20,
  },
  primaryButton: {
    borderWidth: 1.5,
    borderColor: 'rgba(26, 15, 163, 1.00)',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: 'rgba(26, 15, 163, 1.00)',
    fontSize: 14,
    fontWeight: '700',
  },
});
