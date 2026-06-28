import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Pressable } from 'react-native';

interface SelectOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
}

export function SelectOptionsModal({ visible, onClose, title, options, onSelect }: SelectOptionsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose}>
        <View style={styles.overlay} />
      </Pressable>
      
      <View style={styles.contentContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={1}
                style={styles.optionButton}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
          />
          
          <TouchableOpacity activeOpacity={1} style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingHorizontal: 24,
  },
  optionButton: {
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#334155',
  },
  separator: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  cancelButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});
