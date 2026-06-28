import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, Pressable, Keyboard } from 'react-native';
import { BranchForm } from './BranchForm';
import { Branch } from '@/types';
import { CloseIcon } from '@/components/ui/Icons';

interface BranchModalProps {
  visible: boolean;
  onClose: () => void;
  mode: 'create' | 'update';
  initialData?: Branch;
  onSubmit: (data: any) => void;
}

export function BranchModal({ visible, onClose, mode, initialData, onSubmit }: BranchModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType={Platform.OS === 'web' ? 'fade' : 'slide'}
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
            {Platform.OS !== 'web' && <View style={styles.dragHandle} />}
            <TouchableOpacity activeOpacity={1} style={styles.closeButton} onPress={onClose}>
              <CloseIcon size={24} color="#64748B" />
            </TouchableOpacity>
            
            <View style={styles.formContainer}>
              <BranchForm
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
    ...Platform.select({
      web: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      default: {
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
    }),
  },
  keyboardView: {
    width: '100%',
    flex: 1,
    ...Platform.select({
      web: {
        paddingHorizontal: 20,
        maxHeight: '85%',
        maxWidth: 600,
        alignSelf: 'center',
        justifyContent: 'center',
      },
      default: {
        paddingHorizontal: 0,
        maxHeight: '90%',
        justifyContent: 'flex-end',
      },
    }),
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    paddingTop: 48,
    flex: 1,
    ...Platform.select({
      web: {
        borderRadius: 24,
        width: '100%',
        maxHeight: '100%',
      },
      default: {
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: '100%',
        maxHeight: '100%',
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
      },
    }),
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    position: 'absolute',
    top: 12,
    left: '50%',
    marginLeft: -20,
    zIndex: 10,
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
