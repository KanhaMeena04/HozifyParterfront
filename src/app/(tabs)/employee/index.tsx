import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon, EmployeeIcon, OutlineStarIcon } from '@/components/ui/Icons';
import { EmployeeModal } from '@/components/common/EmployeeModal';
import { useEmployeeStore } from '@/store/employeeStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';
import { StorageService } from '@/services/storage.service';

export default function EmployeeEmptyScreen() {
  const router = useSafeRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { employees, initialize, addEmployee } = useEmployeeStore();
  const [isApproved, setIsApproved] = useState(false);

  const handleBack = () => {
    if (isApproved) {
      router.back();
    }
  };

  useAndroidBack(() => {
    if (isApproved) {
      router.back();
    } else {
      return true; // block hardware back during onboarding
    }
  });

  useEffect(() => {
    initialize();
    const checkApproval = async () => {
      const session = await StorageService.getUserSession();
      if (session?.isApproved) {
        setIsApproved(true);
      }
    };
    checkApproval();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      router.replace('/(tabs)/employee/list');
    }
  }, [employees]);

  return (
    <RoleAccessGuard allowedRoles={['BSP', 'BS']}>
      <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          {isApproved ? (
            <TouchableOpacity activeOpacity={1} onPress={handleBack} style={styles.backButton}>
              <BackArrowIcon size={24} color="#0F172A" />
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} />
          )}
          <Text style={styles.headerTitle}>Add Employee</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.largeCircle}>
              <EmployeeIcon size={48} color="#3B82F6" />
            </View>
            <View style={styles.smallCircle}>
              <OutlineStarIcon size={20} color="#3B82F6" />
            </View>
          </View>

          <Text style={styles.title}>No Employee Added Yet</Text>
          <Text style={styles.subtitle}>
            Add your team members to manage{'\n'}bookings and assignments
          </Text>
        </View>

        <View style={styles.footer}>
          <Button 
            title="+ Add Employee" 
            onPress={() => setIsModalVisible(true)} 
            variant="primary" 
            style={isApproved ? undefined : { marginBottom: 12 }}
          />
          {!isApproved && (
            <Button 
              title="Skip / Continue" 
              onPress={async () => {
                await completeStepAndNavigate('branchEmployeeMapping', router, 'yet_to_start');
              }} 
              variant="outline" 
            />
          )}
        </View>
      </SafeAreaView>

      <EmployeeModal 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        mode="create" 
        onSubmit={(data) => {
          addEmployee(data);
        }}
      />
    </GradientBackground>
    </RoleAccessGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent',  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 16, fontWeight: '500', color: '#0F172A' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  iconContainer: { position: 'relative', marginBottom: 32 },
  largeCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(206, 218, 255, 0.8)', justifyContent: 'center', alignItems: 'center' },
  smallCircle: { position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', elevation: 3 },
  title: { fontSize: 22, fontWeight: '700', color: '#000000', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 22 },
  footer: { paddingHorizontal: 20, paddingBottom: 40 }
});
