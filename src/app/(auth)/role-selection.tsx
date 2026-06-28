import React from 'react';
import { BackHandler } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { RoleSelectionModal } from '@/components/ui/RoleSelectionModal';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { useAuthStore } from '@/store/authStore';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { StorageService } from '@/services/storage.service';

export default function RoleSelectionScreen() {
  useAndroidBack(() => {
    BackHandler.exitApp();
  });
  const router = useSafeRouter();
  const setRole = useAuthStore(state => state.setRole);

  const handleSelect = async (roleId: string) => {
    setRole(roleId as any);
    await StorageService.updateUserSession({ role: roleId as any });
    router.replace('/(auth)/create-profile');
  };

  return (
    <GradientBackground style={{ flex: 1 }}>
      <RoleSelectionModal
        visible={true}
        onSelect={handleSelect}
      />
    </GradientBackground>
  );
}
