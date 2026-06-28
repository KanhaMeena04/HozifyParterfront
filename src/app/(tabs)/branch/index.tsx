import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon, BranchIcon, OutlineStarIcon } from '@/components/ui/Icons';
import { BranchModal } from '@/components/common/BranchModal';
import { useBranchStore } from '@/store/branchStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';

export default function BranchEmptyScreen() {
  const router = useSafeRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const addBranch = useBranchStore((state) => state.addBranch);
  const branches = useBranchStore((state) => state.branches);
  const initialize = useBranchStore((state) => state.initialize);

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

  const handleBack = async () => {
    if (isApproved) {
      router.back();
    } else {
      const s = await StorageService.getUserSession();
      const role = s?.role || 'ISP';
      const { getPreviousStepRoute } = require('@/utils/onboarding');
      const prevRoute = await getPreviousStepRoute('branchCreation', role as any);
      router.replace(prevRoute as any);
    }
  };

  useAndroidBack(() => {
    handleBack();
    return true;
  });

  useEffect(() => {
    if (branches.length > 0) {
      router.replace('/(tabs)/branch/list');
    }
  }, [branches]);

  return (
    <RoleAccessGuard allowedRoles={['BSP', 'BS']}>
      <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Branch</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.largeCircle}>
              <BranchIcon size={48} color="#3B82F6" />
            </View>
            <View style={styles.smallCircle}>
              <OutlineStarIcon size={20} color="#3B82F6" />
            </View>
          </View>

          <Text style={styles.title}>No Branch Added Yet</Text>
          <Text style={styles.subtitle}>
            Add your business branches to manage{'\n'}them from one place
          </Text>
        </View>

        <View style={styles.footer}>
          <Button 
            title="+ Add Branch" 
            onPress={() => setIsModalVisible(true)} 
            variant="primary" 
            style={isApproved ? undefined : { marginBottom: 12 }}
          />
          {!isApproved && (
            <Button 
              title="Skip / Continue" 
              onPress={async () => {
                await completeStepAndNavigate('branchCreation', router, 'yet_to_start');
              }} 
              variant="outline" 
            />
          )}
        </View>
      </SafeAreaView>

      <BranchModal 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        mode="create" 
        onSubmit={async (data) => {
          await addBranch(data);
          await completeStepAndNavigate('branchCreation', router, 'reviewing');
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
