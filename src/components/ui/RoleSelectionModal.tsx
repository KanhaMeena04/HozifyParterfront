import React, { useState } from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { COLORS } from '../../constants';
import { Button } from './Button';
import { BranchIcon, CartIcon } from './Icons';
import { StorageService } from '../../services/storage.service';
import { UserSession } from '../../types/storage.types';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// Custom optimized inline SVG icons for figma fidelity
const EditPencilIcon = ({ size = 20, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserOutlineIcon = ({ size = 24, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20 21a8 8 0 0 0-16 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

interface RoleSelectionModalProps {
  visible: boolean;
  onSelect: (roleId: string) => void;
  onClose?: () => void;
}

const ROLES = [
  {
    id: 'ISP',
    title: 'Independent Service Provider (ISP)',
    description: 'Individual service providers operating independently.',
    Icon: EditPencilIcon,
  },
  {
    id: 'BSP',
    title: 'Business Service Provider (BSP)',
    description: 'Agencies and businesses with a team.',
    Icon: BranchIcon,
  },
  {
    id: 'BS',
    title: 'Business Seller (BS)',
    description: 'Businesses selling products directly to customers.',
    Icon: CartIcon,
  }
];

export function RoleSelectionModal({ visible, onSelect, onClose }: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserSession['role']>(null);

  const handleContinue = async () => {
    if (selectedRole) {
      await StorageService.updateUserSession({ role: selectedRole });
      onSelect(selectedRole);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {onClose && (
          <TouchableOpacity activeOpacity={1} 
            style={StyleSheet.absoluteFill} 
            onPress={onClose} 
          />
        )}
        <View style={styles.sheetContainer}>
          <View style={styles.handleBar} />
          
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <View style={styles.iconWrapper}>
                <UserOutlineIcon size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.title}>Select your role</Text>
              <Text style={styles.subtitle}>
                Choose how you will be using the platform to customize your experience.
              </Text>
            </View>

            <View style={styles.rolesList}>
              {ROLES.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <TouchableOpacity activeOpacity={1}
                    key={role.id}
                    style={[styles.roleCard, isSelected && styles.roleCardSelected]}
                    onPress={() => setSelectedRole(role.id as UserSession['role'])}
                  >
                    <View style={styles.roleIconWrapper}>
                      <role.Icon size={22} color={COLORS.primary} />
                    </View>
                    
                    <View style={styles.roleContent}>
                      <Text style={styles.roleTitle}>{role.title}</Text>
                      <Text style={styles.roleDescription}>{role.description}</Text>
                    </View>

                    <View style={styles.radioWrapper}>
                      <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Continue"
              onPress={handleContinue}
              disabled={!selectedRole}
              variant="primary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    maxHeight: '88%',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: { boxShadow: '0px -4px 12px rgba(0,0,0,0.08)' },
    })
  },
  handleBar: {
    width: 48,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    marginTop: 12,
    marginBottom: 24,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF', // Indigo 50
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  rolesList: {
    gap: 12,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9', // slate-100
    borderRadius: 16,
  },
  roleCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F8FAFC',
  },
  roleIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  radioWrapper: {
    paddingLeft: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1', // slate-300
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  footer: {
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
  },
});
