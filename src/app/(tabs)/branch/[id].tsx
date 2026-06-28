import { useSafeRouter } from '@/hooks/useSafeRouter';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, } from 'expo-router';
import { BranchForm } from '@/components/common/BranchForm';
import { useBranchStore } from '@/store/branchStore';
import { BackArrowIcon } from '@/components/ui/Icons';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { useAndroidBack } from '@/hooks/useAndroidBack';

export default function EditBranchScreen() {
  useAndroidBack();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useSafeRouter();
  const { branches, updateBranch } = useBranchStore();
  const [branch, setBranch] = useState<any>(null);

  useEffect(() => {
    const found = branches.find(b => b.id === id);
    if (found) {
      setBranch(found);
    } else {
      router.back();
    }
  }, [id, branches]);

  const handleSubmit = async (data: any) => {
    if (id) {
      await updateBranch(id, data);
      router.back();
    }
  };

  if (!branch) {
    return (
      <GradientBackground style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="rgba(26, 15, 163, 1.00)" />
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Branch</Text>
        </View>
        <View style={styles.card}>
          <BranchForm mode="update" initialData={branch} onSubmit={handleSubmit} />
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
