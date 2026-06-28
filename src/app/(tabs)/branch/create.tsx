import React from 'react';
import { View, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { BranchForm } from '@/components/common/BranchForm';
import { useFlowStore } from '@/store/flowStore';
import { BackArrowIcon } from '@/components/ui/Icons';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { StorageService } from '@/services/storage.service';
import { useBranchStore } from '@/store/branchStore';

export default function CreateBranchScreen() {
  useAndroidBack(() => router.replace('/(tabs)'));
  const router = useSafeRouter();
  const addBranch = useBranchStore((state: any) => state.addBranch);

  const handleSubmit = async (data: any) => {
    await addBranch(data);
    // Update flow store status to REVIEWING
    const { updateStepStatus } = useFlowStore.getState();
    updateStepStatus('branchCreation', 'REVIEWING');
    // Persist to storage (legacy key for backward compatibility)
    await StorageService.updateMandatoryFlowStep('branchCreation', 'reviewing');
    router.replace('/(tabs)');
  };

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.replace('/(tabs)')} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Branch</Text>
        </View>
        <View style={styles.card}>
          <BranchForm mode="create" onSubmit={handleSubmit} />
        </View>
      </SafeAreaView>
    </GradientBackground>
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
    overflow: 'hidden',
    padding: 24,
  },
});
