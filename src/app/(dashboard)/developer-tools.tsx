import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useAuthStore } from '@/store/authStore';
import { PartnerRole } from '@/types';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { StorageService } from '@/services/storage.service';

const ROLES: PartnerRole[] = ['ISP', 'BSP', 'BS', 'BranchManager', 'Professional'];

export default function DeveloperToolsScreen() {
  const router = useSafeRouter();
  const currentRole = useAuthStore(state => state.role);
  const setRole = useAuthStore(state => state.setRole);

  const handleRoleSelect = async (role: PartnerRole) => {
    setRole(role);
    await StorageService.updateUserSession({ role: role as any });
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Developer Tools</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>SIMULATE ROLE</Text>
          <Text style={styles.sectionDesc}>Select a role to dynamically change menus and dashboard items. (Mock Data Only)</Text>
          
          <View style={styles.rolesContainer}>
            {ROLES.map(role => (
              <TouchableOpacity activeOpacity={1}
                key={role}
                style={[
                  styles.roleCard,
                  currentRole === role && styles.roleCardActive
                ]}
                onPress={() => handleRoleSelect(role)}
              >
                <Text style={[
                  styles.roleText,
                  currentRole === role && styles.roleTextActive
                ]}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Reset Session"
            onPress={() => useAuthStore.getState().logout()}
            variant="outline"
            style={styles.resetButton}
          />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  content: { padding: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 8, letterSpacing: 0.5 },
  sectionDesc: { fontSize: 13, color: '#64748B', marginBottom: 24, lineHeight: 18 },
  rolesContainer: { gap: 12, marginBottom: 32 },
  roleCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleCardActive: {
    borderColor: 'rgba(26, 15, 163, 1.00)',
    backgroundColor: '#EEF2FF',
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  roleTextActive: {
    color: 'rgba(26, 15, 163, 1.00)',
  },
  resetButton: {
    marginTop: 24,
  }
});
