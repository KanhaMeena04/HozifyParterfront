import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, Pressable, Keyboard } from 'react-native';
import { EmployeeForm } from './EmployeeForm';
import { Employee } from '@/types';
import { CloseIcon } from '@/components/ui/Icons';

interface EmployeeModalProps {
  visible: boolean;
  onClose: () => void;
  mode: 'create' | 'update';
  initialData?: Employee;
  onSubmit: (data: any) => void;
}

export function EmployeeModal({ visible, onClose, mode, initialData, onSubmit }: EmployeeModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <Pressable onPress={Keyboard.dismiss} style={StyleSheet.absoluteFill}>
          <View style={StyleSheet.absoluteFill} />
        </Pressable>
        
        <View style={styles.keyboardView}>
          <View style={styles.modalContent}>
            <TouchableOpacity activeOpacity={1} style={styles.closeButton} onPress={onClose}>
              <CloseIcon size={24} color="#64748B" />
            </TouchableOpacity>
            
            <View style={styles.formContainer}>
              <EmployeeForm
                mode={mode}
                initialData={initialData}
                visible={visible}
                onSubmit={(data) => {
                  onSubmit(data);
                  onClose();
                }}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 20,
    maxHeight: '85%',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
    paddingTop: 48, // space for close button
    paddingHorizontal: 24,
    paddingBottom: 24,
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  formContainer: {
    flex: 1,
  },
});
