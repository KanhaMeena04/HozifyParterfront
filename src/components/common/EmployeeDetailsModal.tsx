import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, Pressable, ScrollView } from 'react-native';
import { Employee } from '@/types';
import { CloseIcon, UserGroupIcon } from '@/components/ui/Icons';

interface EmployeeDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export function EmployeeDetailsModal({ visible, onClose, employee }: EmployeeDetailsModalProps) {
  if (!employee) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill}>
          <View style={StyleSheet.absoluteFill} />
        </Pressable>
        
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity activeOpacity={1} style={styles.closeButton} onPress={onClose}>
              <CloseIcon size={24} color="#64748B" />
            </TouchableOpacity>
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              <View style={styles.header}>
                <View style={styles.avatar}>
                  {/* Dummy avatar for now */}
                  <UserGroupIcon size={40} color="#64748B" />
                </View>
                <Text style={styles.name}>{employee.name || 'Unknown Name'}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{employee.role.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.detailsList}>
                <DetailRow label="Mobile number" value={employee.mobileNumber || 'N/A'} />
                <DetailRow label="Email ID" value={employee.email || 'enter email id'} />
                <DetailRow label="Address" value={employee.address || 'enter address'} />
                <DetailRow 
                  label="Status" 
                  value={employee.isActive ? 'Active' : 'Inactive'} 
                  valueStyle={employee.isActive ? styles.activeStatus : styles.inactiveStatus} 
                />
                <DetailRow label="Created Date" value={employee.createdAt || '08 May 2024'} />
                <DetailRow label="Branch Name" value={employee.branchName || 'enter branch name'} />
                <DetailRow label="Partner Services" value={employee.mainService || 'Enter partner services'} />
                <DetailRow label="Sub Service" value={employee.subService || 'Enter partner sub services'} />
                <DetailRow label="Experience" value={employee.experience || 'Total year of exp'} />
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function DetailRow({ label, value, valueStyle }: { label: string, value: string, valueStyle?: any }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueStyle]} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    paddingHorizontal: 20,
    maxHeight: '90%',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
    paddingTop: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(26, 15, 163, 1.00)',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  detailsList: {
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 24,
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
    textAlign: 'right',
  },
  activeStatus: {
    color: '#22C55E', // green-500
  },
  inactiveStatus: {
    color: '#EF4444', // red-500
  },
});
