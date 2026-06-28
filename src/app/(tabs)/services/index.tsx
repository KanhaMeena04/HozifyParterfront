import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Button } from '@/components/ui/Button';
import { BackArrowIcon, ServiceIcon, OutlineStarIcon } from '@/components/ui/Icons';
import { useServicesStore } from '@/store/servicesStore';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { RoleAccessGuard } from '@/components/common/RoleAccessGuard';
import { completeStepAndNavigate } from '@/utils/onboarding';
import { StorageService } from '@/services/storage.service';
import { useState } from 'react';

export default function ServicesEmptyScreen() {
  const router = useSafeRouter();
  const { services } = useServicesStore();
  const [isApproved, setIsApproved] = useState(false);

  // If we already have services, redirect to the list view
  React.useEffect(() => {
    if (services.length > 0) {
      router.replace('/(tabs)/services/list');
    }
  }, [services]);

  React.useEffect(() => {
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
      const prevRoute = await getPreviousStepRoute('partnerServiceSelection', role as any);
      router.replace(prevRoute as any);
    }
  };

  useAndroidBack(() => {
    handleBack();
    return true;
  });

  const handleAddServices = () => {
    router.push('/(tabs)/services/select');
  };

  return (
    <RoleAccessGuard allowedRoles={['BSP', 'ISP', 'BS']}>
      <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity activeOpacity={1} onPress={handleBack} style={styles.backButton}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Services</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.largeCircle}>
              <ServiceIcon size={48} color="#3B82F6" />
            </View>
          </View>

          <Text style={styles.title}>No Services Added Yet</Text>
          <Text style={styles.subtitle}>
            Add the services you offer to let{'\n'}customers find and book you easily
          </Text>
        </View>

        <View style={styles.footer}>
          <Button 
            title="+ Add Services" 
            onPress={handleAddServices} 
            variant="primary" 
            style={isApproved ? undefined : { marginBottom: 12 }}
          />
          {!isApproved && (
            <Button 
              title="Skip / Continue" 
              onPress={async () => {
                await completeStepAndNavigate('partnerServiceSelection', router, 'yet_to_start');
              }} 
              variant="outline" 
            />
          )}
        </View>
      </SafeAreaView>
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
  largeCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: 'rgba(26, 15, 163, 1.00)', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: '#000000', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 22 },
  footer: { paddingHorizontal: 20, paddingBottom: 40 }
});
