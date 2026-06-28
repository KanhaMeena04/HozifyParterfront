import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { EmployeeForm } from '@/components/common/EmployeeForm';
import { useEmployeeStore } from '@/store/employeeStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';

export default function AddEmployeeScreen() {
  const router = useSafeRouter();
  const { addEmployee } = useEmployeeStore();
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const checkApproval = async () => {
      const session = await StorageService.getUserSession();
      if (session?.isApproved) {
        setIsApproved(true);
      }
    };
    checkApproval();
  }, []);

  useAndroidBack(() => {
    if (isApproved) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  });

  const handleSubmit = async (data: any) => {
    addEmployee(data);
    if (isApproved) {
      router.back();
    } else {
      await completeStepAndNavigate('addingEmployee', router, 'reviewing');
    }
  };

  const handleSkip = async () => {
    await completeStepAndNavigate('addingEmployee', router, 'completed');
  };

  return (
    <RoleAccessGuard allowedRoles={['BSP', 'BS']}>
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <TouchableOpacity activeOpacity={1} onPress={() => {
                if (isApproved) {
                  router.back();
                } else {
                  router.replace('/(tabs)');
                }
              }} style={styles.backButton}>
                <BackArrowIcon size={24} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Add Employee</Text>
            </View>
            {!isApproved && (
              <TouchableOpacity activeOpacity={1} 
                onPress={handleSkip} 
                style={{ paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#CBD5E1' }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748B' }}>Skip</Text>
              </TouchableOpacity>
            )}
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <View style={styles.card}>
              <EmployeeForm mode="create" onSubmit={handleSubmit} />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </GradientBackground>
    </RoleAccessGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1,  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20 },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
  },
});
